import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: Number, // Hour in 24-hour format (0-23)
    required: true
  },
  endTime: {
    type: Number, // Hour in 24-hour format (0-23)
    required: true
  },
  duration: {
    type: Number, // Duration in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  completedAt: {
    type: Date
  },
  recurrence: {
    type: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none'
    },
    interval: {
      type: Number,
      default: 1
    },
    endDate: {
      type: Date
    }
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
taskSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for getting the full datetime range
taskSchema.virtual('datetimeRange').get(function() {
  const start = new Date(this.scheduledDate);
  start.setHours(this.startTime, 0, 0, 0);
  
  const end = new Date(this.scheduledDate);
  end.setHours(this.endTime, 0, 0, 0);
  
  return { start, end };
});

// Index for efficient querying
taskSchema.index({ user: 1, scheduledDate: 1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ goal: 1 });

export default mongoose.model('Task', taskSchema);