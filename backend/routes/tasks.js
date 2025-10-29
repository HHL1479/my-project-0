import express from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/Task.js';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/tasks
// @desc    Get tasks with optional filtering
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { 
      date, 
      status, 
      goalId, 
      startDate, 
      endDate,
      limit = 50,
      offset = 0 
    } = req.query;

    let filter = { user: req.user._id };

    // Filter by specific date
    if (date) {
      filter.scheduledDate = new Date(date);
    }

    // Filter by date range
    if (startDate || endDate) {
      filter.scheduledDate = {};
      if (startDate) {
        filter.scheduledDate.$gte = new Date(startDate);
      }
      if (endDate) {
        filter.scheduledDate.$lte = new Date(endDate);
      }
    }

    // Filter by status
    if (status) {
      filter.status = status;
    }

    // Filter by goal
    if (goalId) {
      filter.goal = goalId;
    }

    const tasks = await Task.find(filter)
      .populate('goal', 'title color category')
      .sort({ scheduledDate: 1, startTime: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: total > parseInt(offset) + parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      message: 'Server error fetching tasks' 
    });
  }
});

// @route   GET /api/tasks/today
// @desc    Get today's tasks
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({
      user: req.user._id,
      scheduledDate: today,
      status: { $in: ['scheduled', 'in_progress'] }
    })
    .populate('goal', 'title color category')
    .sort({ startTime: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ 
      message: 'Server error fetching today tasks' 
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).populate('goal', 'title color category');

    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ 
      message: 'Server error fetching task' 
    });
  }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private
router.post('/', protect, [
  body('goalId')
    .isMongoId()
    .withMessage('Valid goal ID is required'),
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('scheduledDate')
    .isISO8601()
    .withMessage('Valid scheduled date is required'),
  body('startTime')
    .isInt({ min: 0, max: 23 })
    .withMessage('Start time must be between 0-23'),
  body('endTime')
    .isInt({ min: 0, max: 24 })
    .withMessage('End time must be between 0-24'),
  body('duration')
    .isInt({ min: 15, max: 480 })
    .withMessage('Duration must be between 15-480 minutes'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { 
      goalId, 
      title, 
      description, 
      scheduledDate, 
      startTime, 
      endTime, 
      duration, 
      priority 
    } = req.body;

    // Verify goal exists and belongs to user
    const goal = await Goal.findOne({ _id: goalId, user: req.user._id });
    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found or does not belong to you' 
      });
    }

    // Validate time range
    if (startTime >= endTime) {
      return res.status(400).json({ 
        message: 'End time must be after start time' 
      });
    }

    const task = new Task({
      user: req.user._id,
      goal: goalId,
      title,
      description,
      scheduledDate: new Date(scheduledDate),
      startTime,
      endTime,
      duration,
      priority: priority || 'medium',
      status: 'scheduled'
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: await task.populate('goal', 'title color category')
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      message: 'Server error creating task' 
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('status')
    .optional()
    .isIn(['draft', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'])
    .withMessage('Invalid status'),
  body('startTime')
    .optional()
    .isInt({ min: 0, max: 23 })
    .withMessage('Start time must be between 0-23'),
  body('endTime')
    .optional()
    .isInt({ min: 0, max: 24 })
    .withMessage('End time must be between 0-24'),
  body('scheduledDate')
    .optional()
    .isISO8601()
    .withMessage('Valid scheduled date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }

    const updates = req.body;
    
    // Handle task completion
    if (updates.status === 'completed' && task.status !== 'completed') {
      task.completedAt = new Date();
    }
    
    // Handle task rescheduling
    if (updates.scheduledDate && updates.scheduledDate !== task.scheduledDate) {
      updates.status = 'rescheduled';
    }

    // Update fields
    Object.assign(task, updates);
    await task.save();

    res.json({
      message: 'Task updated successfully',
      task: await task.populate('goal', 'title color category')
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      message: 'Server error updating task' 
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }

    res.json({ 
      message: 'Task deleted successfully' 
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      message: 'Server error deleting task' 
    });
  }
});

// @route   PUT /api/tasks/:id/complete
// @desc    Mark task as completed
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    await task.save();

    res.json({
      message: 'Task marked as completed',
      task: await task.populate('goal', 'title color category')
    });
  } catch (error) {
    console.error('Complete task error:', error);
    res.status(500).json({ 
      message: 'Server error completing task' 
    });
  }
});

// @route   PUT /api/tasks/:id/reschedule
// @desc    Reschedule task to new date/time
// @access  Private
router.put('/:id/reschedule', protect, [
  body('scheduledDate')
    .isISO8601()
    .withMessage('Valid scheduled date is required'),
  body('startTime')
    .isInt({ min: 0, max: 23 })
    .withMessage('Start time must be between 0-23'),
  body('endTime')
    .isInt({ min: 0, max: 24 })
    .withMessage('End time must be between 0-24')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const task = await Task.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!task) {
      return res.status(404).json({ 
        message: 'Task not found' 
      });
    }

    const { scheduledDate, startTime, endTime } = req.body;

    // Validate time range
    if (startTime >= endTime) {
      return res.status(400).json({ 
        message: 'End time must be after start time' 
      });
    }

    task.scheduledDate = new Date(scheduledDate);
    task.startTime = startTime;
    task.endTime = endTime;
    task.status = 'rescheduled';
    
    await task.save();

    res.json({
      message: 'Task rescheduled successfully',
      task: await task.populate('goal', 'title color category')
    });
  } catch (error) {
    console.error('Reschedule task error:', error);
    res.status(500).json({ 
      message: 'Server error rescheduling task' 
    });
  }
});

export default router;