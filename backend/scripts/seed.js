import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import Task from '../models/Task.js';
import Backbone from '../models/Backbone.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai_life_coach');
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Goal.deleteMany({});
    await Task.deleteMany({});
    await Backbone.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create sample user
    const sampleUser = new User({
      email: 'demo@example.com',
      password: 'demo123',
      firstName: 'Demo',
      lastName: 'User',
      isFirstTimeUser: false,
      preferences: {
        defaultTaskLength: 60,
        preferredTimeWindows: [
          { day: 1, startTime: 18, endTime: 21 }, // Monday evening
          { day: 2, startTime: 18, endTime: 21 }, // Tuesday evening
          { day: 3, startTime: 18, endTime: 21 }, // Wednesday evening
          { day: 4, startTime: 18, endTime: 21 }, // Thursday evening
          { day: 5, startTime: 18, endTime: 22 }, // Friday evening
          { day: 6, startTime: 9, endTime: 18 }  // Saturday daytime
        ]
      }
    });

    await sampleUser.save();
    console.log('👤 Created sample user: demo@example.com / demo123');

    // Create sample backbone schedule
    const sampleBackbone = new Backbone({
      user: sampleUser._id,
      schedule: [
        // Monday-Friday work schedule
        { day: 1, startTime: 9, endTime: 17, label: 'Work', color: 'grey', type: 'work' },
        { day: 2, startTime: 9, endTime: 17, label: 'Work', color: 'grey', type: 'work' },
        { day: 3, startTime: 9, endTime: 17, label: 'Work', color: 'grey', type: 'work' },
        { day: 4, startTime: 9, endTime: 17, label: 'Work', color: 'grey', type: 'work' },
        { day: 5, startTime: 9, endTime: 17, label: 'Work', color: 'grey', type: 'work' },
        
        // Daily sleep schedule
        { day: 0, startTime: 23, endTime: 7, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        { day: 1, startTime: 23, endTime: 7, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        { day: 2, startTime: 23, endTime: 7, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        { day: 3, startTime: 23, endTime: 7, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        { day: 4, startTime: 23, endTime: 7, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        { day: 5, startTime: 24, endTime: 8, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        { day: 6, startTime: 24, endTime: 8, label: 'Sleep', color: 'darkgrey', type: 'sleep' },
        
        // Meals
        { day: 1, startTime: 12, endTime: 13, label: 'Lunch', color: 'lightgrey', type: 'meal' },
        { day: 2, startTime: 12, endTime: 13, label: 'Lunch', color: 'lightgrey', type: 'meal' },
        { day: 3, startTime: 12, endTime: 13, label: 'Lunch', color: 'lightgrey', type: 'meal' },
        { day: 4, startTime: 12, endTime: 13, label: 'Lunch', color: 'lightgrey', type: 'meal' },
        { day: 5, startTime: 12, endTime: 13, label: 'Lunch', color: 'lightgrey', type: 'meal' }
      ]
    });

    await sampleBackbone.save();
    console.log('📅 Created sample backbone schedule');

    // Create sample goals
    const sampleGoals = [
      {
        user: sampleUser._id,
        title: 'Learn React Development',
        description: 'Master React.js and build modern web applications',
        category: 'learning',
        effort: 4,
        color: 'blue',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
      },
      {
        user: sampleUser._id,
        title: 'Get Fit and Healthy',
        description: 'Exercise regularly and improve overall health',
        category: 'health',
        effort: 3,
        color: 'green',
        targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      },
      {
        user: sampleUser._id,
        title: 'Read More Books',
        description: 'Read 12 books this year - one per month',
        category: 'personal',
        effort: 2,
        color: 'purple'
      }
    ];

    const createdGoals = [];
    for (const goalData of sampleGoals) {
      const goal = new Goal(goalData);
      await goal.save();
      createdGoals.push(goal);
    }
    console.log('🎯 Created sample goals');

    // Create sample tasks
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sampleTasks = [
      // React Learning Tasks
      {
        user: sampleUser._id,
        goal: createdGoals[0]._id,
        title: 'Complete React Tutorial Chapter 1',
        description: 'Learn about components and JSX',
        scheduledDate: today,
        startTime: 18,
        endTime: 19,
        duration: 60,
        status: 'scheduled',
        priority: 'high'
      },
      {
        user: sampleUser._id,
        goal: createdGoals[0]._id,
        title: 'Build a simple component',
        description: 'Practice creating your first React component',
        scheduledDate: tomorrow,
        startTime: 19,
        endTime: 20,
        duration: 60,
        status: 'scheduled',
        priority: 'medium'
      },
      
      // Fitness Tasks
      {
        user: sampleUser._id,
        goal: createdGoals[1]._id,
        title: '30-minute cardio workout',
        description: 'Go for a run or use the treadmill',
        scheduledDate: today,
        startTime: 19,
        endTime: 20,
        duration: 30,
        status: 'scheduled',
        priority: 'medium'
      },
      {
        user: sampleUser._id,
        goal: createdGoals[1]._id,
        title: 'Strength training session',
        description: 'Focus on upper body exercises',
        scheduledDate: tomorrow,
        startTime: 18,
        endTime: 19,
        duration: 60,
        status: 'scheduled',
        priority: 'medium'
      },
      
      // Reading Tasks
      {
        user: sampleUser._id,
        goal: createdGoals[2]._id,
        title: 'Read 20 pages of current book',
        description: 'Continue with "Atomic Habits"',
        scheduledDate: today,
        startTime: 21,
        endTime: 22,
        duration: 60,
        status: 'scheduled',
        priority: 'low'
      }
    ];

    for (const taskData of sampleTasks) {
      const task = new Task(taskData);
      await task.save();
    }
    console.log('✅ Created sample tasks');

    console.log('\n🎉 Database seeded successfully!');
    console.log('Sample user: demo@example.com / demo123');
    console.log('You can now start the development server with: npm run dev');

  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

seedDatabase();