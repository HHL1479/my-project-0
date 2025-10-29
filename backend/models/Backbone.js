import mongoose from 'mongoose';

const backboneSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  schedule: [{
    day: {
      type: Number,
      required: true,
      min: 0,
      max: 6 // 0 = Sunday, 1 = Monday, etc.
    },
    startTime: {
      type: Number,
      required: true,
      min: 0,
      max: 24
    },
    endTime: {
      type: Number,
      required: true,
      min: 0,
      max: 24
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      default: 'grey'
    },
    type: {
      type: String,
      enum: ['work', 'school', 'sleep', 'commute', 'meal', 'personal', 'other'],
      default: 'other'
    }
  }],
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
backboneSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient querying
backboneSchema.index({ user: 1 });

export default mongoose.model('Backbone', backboneSchema);