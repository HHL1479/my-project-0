import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  targetDate: {
    type: Date
  },
  effort: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['health', 'learning', 'career', 'social', 'finance', 'hobby', 'personal', 'other'],
    default: 'other'
  },
  color: {
    type: String,
    default: 'blue'
  },
  progress: {
    current: { type: Number, default: 0 },
    total: { type: Number, default: 100 }
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
goalSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient querying
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, targetDate: 1 });

export default mongoose.model('Goal', goalSchema);