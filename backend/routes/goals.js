import express from 'express';
import { body, validationResult } from 'express-validator';
import Goal from '../models/Goal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/goals
// @desc    Get all goals for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category } = req.query;
    
    let filter = { user: req.user._id };
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = category;
    }

    const goals = await Goal.find(filter)
      .sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ 
      message: 'Server error fetching goals' 
    });
  }
});

// @route   GET /api/goals/:id
// @desc    Get single goal
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found' 
      });
    }

    res.json(goal);
  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ 
      message: 'Server error fetching goal' 
    });
  }
});

// @route   POST /api/goals
// @desc    Create new goal
// @access  Private
router.post('/', protect, [
  body('title')
    .notEmpty()
    .withMessage('Title is required'),
  body('effort')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Effort must be between 1-5'),
  body('category')
    .optional()
    .isIn(['health', 'learning', 'career', 'social', 'finance', 'hobby', 'personal', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, description, targetDate, effort, category } = req.body;

    const goal = new Goal({
      user: req.user._id,
      title,
      description,
      targetDate: targetDate ? new Date(targetDate) : undefined,
      effort: effort || 3,
      category: category || 'other'
    });

    await goal.save();

    res.status(201).json({
      message: 'Goal created successfully',
      goal
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ 
      message: 'Server error creating goal' 
    });
  }
});

// @route   PUT /api/goals/:id
// @desc    Update goal
// @access  Private
router.put('/:id', protect, [
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),
  body('effort')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Effort must be between 1-5'),
  body('status')
    .optional()
    .isIn(['active', 'paused', 'completed', 'cancelled'])
    .withMessage('Invalid status'),
  body('category')
    .optional()
    .isIn(['health', 'learning', 'career', 'social', 'finance', 'hobby', 'personal', 'other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const goal = await Goal.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found' 
      });
    }

    // Update fields
    const { title, description, targetDate, effort, status, category } = req.body;
    
    if (title !== undefined) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetDate !== undefined) goal.targetDate = targetDate ? new Date(targetDate) : undefined;
    if (effort !== undefined) goal.effort = effort;
    if (status !== undefined) goal.status = status;
    if (category !== undefined) goal.category = category;

    await goal.save();

    res.json({
      message: 'Goal updated successfully',
      goal
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ 
      message: 'Server error updating goal' 
    });
  }
});

// @route   DELETE /api/goals/:id
// @desc    Delete goal
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!goal) {
      return res.status(404).json({ 
        message: 'Goal not found' 
      });
    }

    // Also delete associated tasks
    const Task = (await import('../models/Task.js')).default;
    await Task.deleteMany({ goal: req.params.id });

    res.json({ 
      message: 'Goal deleted successfully' 
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ 
      message: 'Server error deleting goal' 
    });
  }
});

// @route   GET /api/goals/active
// @desc    Get active goals for planning
// @access  Private
router.get('/active/planning', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ 
      user: req.user._id, 
      status: 'active' 
    }).sort({ createdAt: -1 });

    res.json(goals);
  } catch (error) {
    console.error('Get active goals error:', error);
    res.status(500).json({ 
      message: 'Server error fetching active goals' 
    });
  }
});

export default router;