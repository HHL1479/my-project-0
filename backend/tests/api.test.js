import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/User.js';

describe('AI Life Coach API', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/ai_life_coach_test');
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    // Clear test data
    await User.deleteMany({});
  });

  describe('Authentication', () => {
    test('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe('test@example.com');
      
      authToken = response.body.token;
      userId = response.body.user.id;
    });

    test('should login with valid credentials', async () => {
      // First register
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'login@example.com',
          password: 'password123',
          firstName: 'Login',
          lastName: 'Test'
        });

      // Then login
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    test('should get current user', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user.email).toBe('test@example.com');
    });
  });

  describe('Goals', () => {
    let goalId;

    test('should create a new goal', async () => {
      const response = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Learn Node.js',
          description: 'Master backend development',
          category: 'learning',
          effort: 4,
          targetDate: '2024-12-31'
        });

      expect(response.status).toBe(201);
      expect(response.body.goal.title).toBe('Learn Node.js');
      expect(response.body.goal.category).toBe('learning');
      
      goalId = response.body.goal._id;
    });

    test('should get all goals', async () => {
      const response = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test('should update a goal', async () => {
      const response = await request(app)
        .put(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Learn Node.js and Express',
          effort: 5
        });

      expect(response.status).toBe(200);
      expect(response.body.goal.title).toBe('Learn Node.js and Express');
      expect(response.body.goal.effort).toBe(5);
    });
  });

  describe('Backbone Schedule', () => {
    test('should create backbone schedule', async () => {
      const response = await request(app)
        .post('/api/backbone')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          schedule: [
            {
              day: 1,
              startTime: 9,
              endTime: 17,
              label: 'Work',
              color: 'grey',
              type: 'work'
            },
            {
              day: 1,
              startTime: 22,
              endTime: 24,
              label: 'Sleep',
              color: 'darkgrey',
              type: 'sleep'
            }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Backbone schedule saved successfully');
    });

    test('should get backbone schedule', async () => {
      const response = await request(app)
        .get('/api/backbone')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('schedule');
      expect(Array.isArray(response.body.schedule)).toBe(true);
    });

    test('should calculate free time slots', async () => {
      const response = await request(app)
        .get('/api/backbone/free-time?weekStart=2024-01-01')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('freeTimeSlots');
      expect(Array.isArray(response.body.freeTimeSlots)).toBe(true);
    });
  });

  describe('Tasks', () => {
    let taskId;

    test('should create a task', async () => {
      // First create a goal
      const goalResponse = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task Goal',
          category: 'learning'
        });

      const goalId = goalResponse.body.goal._id;

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          goalId: goalId,
          title: 'Complete API testing',
          description: 'Write comprehensive tests',
          scheduledDate: '2024-01-01',
          startTime: 18,
          endTime: 19,
          duration: 60,
          priority: 'high'
        });

      expect(response.status).toBe(201);
      expect(response.body.task.title).toBe('Complete API testing');
      
      taskId = response.body.task._id;
    });

    test('should get tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    test('should mark task as complete', async () => {
      const response = await request(app)
        .put(`/api/tasks/${taskId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.task.status).toBe('completed');
      expect(response.body.task).toHaveProperty('completedAt');
    });
  });

  describe('Planning', () => {
    test('should generate task plan', async () => {
      // Create a goal first
      const goalResponse = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Learn Python Programming',
          description: 'Master Python for data science',
          category: 'learning',
          effort: 4
        });

      const goalId = goalResponse.body.goal._id;

      const response = await request(app)
        .post('/api/plan')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          "goalIds": [goalId],
          "weekStart": "2024-01-01"
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toContain('Task plan generated successfully');
      expect(response.body).toHaveProperty('tasks');
    });
  });

  describe('User Profile', () => {
    test('should get user statistics', async () => {
      const response = await request(app)
        .get('/api/users/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('taskStats');
      expect(response.body).toHaveProperty('goalStats');
      expect(response.body).toHaveProperty('totalTasks');
      expect(response.body).toHaveProperty('totalGoals');
    });

    test('should update user profile', async () => {
      const response = await request(app)
        .put('/api/users/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          firstName: 'Updated Name',
          preferences: {
            defaultTaskLength: 90,
            timezone: 'America/New_York'
          }
        });

      expect(response.status).toBe(200);
      expect(response.body.user.firstName).toBe('Updated Name');
      expect(response.body.user.preferences.defaultTaskLength).toBe(90);
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/api/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});

export default {};