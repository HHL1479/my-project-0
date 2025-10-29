import express from 'express';
import { body, validationResult } from 'express-validator';
import Goal from '../models/Goal.js';
import Task from '../models/Task.js';
import Backbone from '../models/Backbone.js';
import aiTaskGenerator from '../services/aiTaskGenerator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/plan
// @desc    Generate task plan for selected goals
// @access  Private
router.post('/', protect, [
  body('goalIds')
    .isArray()
    .withMessage('goalIds must be an array'),
  body('goalIds.*')
    .isMongoId()
    .withMessage('Each goalId must be a valid MongoDB ID'),
  body('weekStart')
    .optional()
    .isISO8601()
    .withMessage('weekStart must be a valid date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { goalIds, weekStart } = req.body;
    const startDate = weekStart ? new Date(weekStart) : new Date();
    
    // Get the selected goals
    const goals = await Goal.find({ 
      _id: { $in: goalIds }, 
      user: req.user._id,
      status: 'active'
    });

    if (goals.length === 0) {
      return res.status(400).json({ 
        message: 'No active goals found for the provided IDs' 
      });
    }

    // Get user's backbone schedule
    const backbone = await Backbone.findOne({ user: req.user._id });
    if (!backbone) {
      return res.status(400).json({ 
        message: 'Please set up your backbone schedule first' 
      });
    }

    // Calculate free time slots for the week
    const freeTimeSlots = calculateFreeTimeSlots(backbone, startDate);
    
    // Generate tasks for each goal using AI
    const allGeneratedTasks = [];
    
    for (const goal of goals) {
      try {
        const generatedTasks = await aiTaskGenerator.generateTasksForGoal(goal);
        
        // Schedule these tasks into free time slots
        const scheduledTasks = await aiTaskGenerator.scheduleTasks(
          generatedTasks, 
          freeTimeSlots
        );
        
        // Create task documents in draft status
        for (const taskData of scheduledTasks) {
          const task = new Task({
            user: req.user._id,
            goal: goal._id,
            title: taskData.title,
            description: taskData.description,
            scheduledDate: new Date(taskData.scheduledDate),
            startTime: taskData.startTime,
            endTime: taskData.endTime,
            duration: taskData.duration,
            status: 'draft',
            priority: taskData.priority,
            aiGenerated: true
          });
          
          await task.save();
          allGeneratedTasks.push(task);
        }
      } catch (error) {
        console.error(`Error generating tasks for goal ${goal._id}:`, error);
        // Continue with other goals even if one fails
      }
    }

    res.json({
      message: 'Task plan generated successfully',
      tasks: allGeneratedTasks,
      goalsProcessed: goals.length,
      tasksGenerated: allGeneratedTasks.length
    });
  } catch (error) {
    console.error('Generate plan error:', error);
    res.status(500).json({ 
      message: 'Server error generating task plan' 
    });
  }
});

// @route   POST /api/plan/commit
// @desc    Commit drafted tasks to scheduled status
// @access  Private
router.post('/commit', protect, [
  body('taskIds')
    .isArray()
    .withMessage('taskIds must be an array'),
  body('taskIds.*')
    .isMongoId()
    .withMessage('Each taskId must be a valid MongoDB ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { taskIds } = req.body;

    // Update all specified tasks to scheduled status
    const result = await Task.updateMany(
      { 
        _id: { $in: taskIds }, 
        user: req.user._id,
        status: 'draft'
      },
      { 
        status: 'scheduled',
        updatedAt: new Date()
      }
    );

    res.json({
      message: `${result.modifiedCount} tasks committed successfully`,
      committedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Commit plan error:', error);
    res.status(500).json({ 
      message: 'Server error committing plan' 
    });
  }
});

// @route   DELETE /api/plan/draft
// @desc    Delete all draft tasks
// @access  Private
router.delete('/draft', protect, async (req, res) => {
  try {
    const result = await Task.deleteMany({
      user: req.user._id,
      status: 'draft'
    });

    res.json({
      message: `${result.deletedCount} draft tasks deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Delete draft tasks error:', error);
    res.status(500).json({ 
      message: 'Server error deleting draft tasks' 
    });
  }
});

// Helper function to calculate free time slots
function calculateFreeTimeSlots(backbone, weekStart) {
  const freeTimeSlots = [];
  const startDate = new Date(weekStart);

  // Generate free time slots for each day of the week
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Get backbone blocks for this day
    const dayBlocks = backbone.schedule.filter(block => block.day === day);
    
    // Sort blocks by start time
    dayBlocks.sort((a, b) => a.startTime - b.startTime);
    
    // Find free time slots between blocks
    let lastEndTime = 7; // Start from 7 AM (reasonable default)
    
    for (const block of dayBlocks) {
      // Check if there's free time before this block
      if (block.startTime > lastEndTime) {
        freeTimeSlots.push({
          date: currentDate.toISOString().split('T')[0],
          day: day,
          startTime: lastEndTime,
          endTime: block.startTime,
          duration: (block.startTime - lastEndTime) * 60 // minutes
        });
      }
      lastEndTime = Math.max(lastEndTime, block.endTime);
    }
    
    // Check for free time after the last block (up to 10 PM)
    if (lastEndTime < 22) {
      freeTimeSlots.push({
        date: currentDate.toISOString().split('T')[0],
        day: day,
        startTime: lastEndTime,
        endTime: 22,
        duration: (22 - lastEndTime) * 60 // minutes
      });
    }
  }

  return freeTimeSlots;
}

export default router;