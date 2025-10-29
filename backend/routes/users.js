import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isFirstTimeUser: user.isFirstTimeUser,
        preferences: user.preferences,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user profile' 
    });
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile
// @access  Private
router.put('/me', protect, [
  body('firstName')
    .optional()
    .notEmpty()
    .withMessage('First name cannot be empty'),
  body('lastName')
    .optional()
    .notEmpty()
    .withMessage('Last name cannot be empty'),
  body('preferences.defaultTaskLength')
    .optional()
    .isInt({ min: 15, max: 480 })
    .withMessage('Default task length must be between 15-480 minutes')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Update basic info
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    
    // Update preferences
    if (preferences) {
      if (preferences.defaultTaskLength !== undefined) {
        user.preferences.defaultTaskLength = preferences.defaultTaskLength;
      }
      if (preferences.preferredTimeWindows !== undefined) {
        user.preferences.preferredTimeWindows = preferences.preferredTimeWindows;
      }
      if (preferences.timezone !== undefined) {
        user.preferences.timezone = preferences.timezone;
      }
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isFirstTimeUser: user.isFirstTimeUser,
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      message: 'Server error updating profile' 
    });
  }
});

// @route   PUT /api/users/onboarding/complete
// @desc    Mark onboarding as complete
// @access  Private
router.put('/onboarding/complete', protect, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isFirstTimeUser: false },
      { new: true }
    ).select('-password');

    res.json({
      message: 'Onboarding completed successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isFirstTimeUser: user.isFirstTimeUser
      }
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ 
      message: 'Server error completing onboarding' 
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const Task = (await import('../models/Task.js')).default;
    const Goal = (await import('../models/Goal.js')).default;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    // Task statistics
    const taskStats = await Task.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Weekly task completion
    const weeklyCompleted = await Task.countDocuments({
      user: req.user._id,
      status: 'completed',
      completedAt: { $gte: weekStart }
    });

    // Goal statistics
    const goalStats = await Goal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Today's tasks
    const todayTasks = await Task.countDocuments({
      user: req.user._id,
      scheduledDate: today,
      status: { $in: ['scheduled', 'in_progress'] }
    });

    res.json({
      taskStats: taskStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      goalStats: goalStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      weeklyCompleted,
      todayTasks,
      totalTasks: taskStats.reduce((sum, stat) => sum + stat.count, 0),
      totalGoals: goalStats.reduce((sum, stat) => sum + stat.count, 0)
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ 
      message: 'Server error fetching user statistics' 
    });
  }
});

export default router;