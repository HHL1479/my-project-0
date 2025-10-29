import express from 'express';
import { body, validationResult } from 'express-validator';
import Backbone from '../models/Backbone.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/backbone
// @desc    Get user's backbone schedule
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const backbone = await Backbone.findOne({ user: req.user._id });
    
    if (!backbone) {
      return res.status(404).json({ 
        message: 'No backbone schedule found' 
      });
    }

    res.json(backbone);
  } catch (error) {
    console.error('Get backbone error:', error);
    res.status(500).json({ 
      message: 'Server error fetching backbone schedule' 
    });
  }
});

// @route   POST /api/backbone
// @desc    Create or update backbone schedule
// @access  Private
router.post('/', protect, [
  body('schedule')
    .isArray()
    .withMessage('Schedule must be an array'),
  body('schedule.*.day')
    .isInt({ min: 0, max: 6 })
    .withMessage('Day must be between 0-6'),
  body('schedule.*.startTime')
    .isInt({ min: 0, max: 24 })
    .withMessage('Start time must be between 0-24'),
  body('schedule.*.endTime')
    .isInt({ min: 0, max: 24 })
    .withMessage('End time must be between 0-24'),
  body('schedule.*.label')
    .notEmpty()
    .withMessage('Label is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { schedule } = req.body;

    // Validate time ranges
    for (const block of schedule) {
      if (block.startTime >= block.endTime) {
        return res.status(400).json({ 
          message: `Invalid time range for ${block.label}: start time must be before end time` 
        });
      }
    }

    // Find existing backbone or create new one
    let backbone = await Backbone.findOne({ user: req.user._id });

    if (backbone) {
      // Update existing backbone
      backbone.schedule = schedule;
      await backbone.save();
    } else {
      // Create new backbone
      backbone = new Backbone({
        user: req.user._id,
        schedule
      });
      await backbone.save();
    }

    // Update user to indicate they've set up their backbone
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(req.user._id, { isFirstTimeUser: false });

    res.json({
      message: 'Backbone schedule saved successfully',
      backbone
    });
  } catch (error) {
    console.error('Save backbone error:', error);
    res.status(500).json({ 
      message: 'Server error saving backbone schedule' 
    });
  }
});

// @route   DELETE /api/backbone
// @desc    Delete backbone schedule
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    const backbone = await Backbone.findOneAndDelete({ user: req.user._id });
    
    if (!backbone) {
      return res.status(404).json({ 
        message: 'No backbone schedule found' 
      });
    }

    res.json({ 
      message: 'Backbone schedule deleted successfully' 
    });
  } catch (error) {
    console.error('Delete backbone error:', error);
    res.status(500).json({ 
      message: 'Server error deleting backbone schedule' 
    });
  }
});

// @route   GET /api/backbone/free-time
// @desc    Get free time slots for a specific week
// @access  Private
router.get('/free-time', protect, async (req, res) => {
  try {
    const { weekStart } = req.query;
    
    if (!weekStart) {
      return res.status(400).json({ 
        message: 'weekStart parameter is required' 
      });
    }

    const backbone = await Backbone.findOne({ user: req.user._id });
    
    if (!backbone) {
      return res.status(404).json({ 
        message: 'No backbone schedule found' 
      });
    }

    const startDate = new Date(weekStart);
    const freeTimeSlots = [];

    // Generate free time slots for each day of the week
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + day);
      
      // Get backbone blocks for this day
      const dayBlocks = backbone.schedule.filter(block => block.day === day);
      
      // Sort blocks by start time
      dayBlocks.sort((a, b) => a.startTime - b.startTime);
      
      // Find free time slots between blocks
      let lastEndTime = 0; // Start of day (midnight)
      
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
      
      // Check for free time after the last block
      if (lastEndTime < 24) {
        freeTimeSlots.push({
          date: currentDate.toISOString().split('T')[0],
          day: day,
          startTime: lastEndTime,
          endTime: 24,
          duration: (24 - lastEndTime) * 60 // minutes
        });
      }
    }

    res.json({
      weekStart: startDate.toISOString().split('T')[0],
      freeTimeSlots
    });
  } catch (error) {
    console.error('Get free time error:', error);
    res.status(500).json({ 
      message: 'Server error calculating free time' 
    });
  }
});

export default router;