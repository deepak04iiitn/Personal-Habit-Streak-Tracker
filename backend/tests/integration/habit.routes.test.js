import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import habitRoutes from '../../routes/habit.route.js';
import { createAuthenticatedUser, createTestHabit } from '../setup/testHelpers.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/habits', habitRoutes);

// Mock error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

describe('Habit Routes Integration', () => {
  let authUser, authToken;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser();
    authUser = auth.user;
    authToken = auth.token;
  });

  describe('POST /habits/create-new-habit', () => {
    test('should create a new habit successfully', async () => {
      const habitData = {
        title: 'Morning Run',
        description: 'Daily morning exercise',
        category: 'EXERCISE',
        isDaily: true
      };

      const response = await request(app)
        .post('/habits/create-new-habit')
        .set('Cookie', `access_token=${authToken}`)
        .send(habitData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(habitData.title);
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .post('/habits/create-new-habit')
        .send({
          title: 'Test Habit',
          category: 'EXERCISE'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /habits/my-habits', () => {
    test('should return user habits with pagination', async () => {
      // Creating test habits
      await createTestHabit(authUser._id, { title: 'Habit 1' });
      await createTestHabit(authUser._id, { title: 'Habit 2' });

      const response = await request(app)
        .get('/habits/my-habits')
        .set('Cookie', `access_token=${authToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.totalHabits).toBe(2);
    });

    test('should filter habits by category', async () => {
      await createTestHabit(authUser._id, { 
        title: 'Exercise Habit', 
        category: 'EXERCISE' 
      });
      await createTestHabit(authUser._id, { 
        title: 'Reading Habit', 
        category: 'READING' 
      });

      const response = await request(app)
        .get('/habits/my-habits')
        .set('Cookie', `access_token=${authToken}`)
        .query({ category: 'EXERCISE' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].category).toBe('EXERCISE');
    });

    test('should search habits by title', async () => {
      await createTestHabit(authUser._id, { title: 'Morning Exercise' });
      await createTestHabit(authUser._id, { title: 'Evening Reading' });

      const response = await request(app)
        .get('/habits/my-habits')
        .set('Cookie', `access_token=${authToken}`)
        .query({ search: 'Exercise' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toContain('Exercise');
    });
  });

  describe('POST /habits/:id/mark-complete', () => {
    test('should mark habit as complete successfully', async () => {
      const habit = await createTestHabit(authUser._id);

      const response = await request(app)
        .post(`/habits/${habit._id}/mark-complete`)
        .set('Cookie', `access_token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.streakCount).toBe(1);
    });

    test('should fail to mark habit complete twice in same day', async () => {
      const habit = await createTestHabit(authUser._id);

      // First completion
      await request(app)
        .post(`/habits/${habit._id}/mark-complete`)
        .set('Cookie', `access_token=${authToken}`);

      // Second completion (should fail)
      const response = await request(app)
        .post(`/habits/${habit._id}/mark-complete`)
        .set('Cookie', `access_token=${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /habits/:id/statistics', () => {
    test('should return habit statistics', async () => {
      const habit = await createTestHabit(authUser._id);

      const response = await request(app)
        .get(`/habits/${habit._id}/statistics`)
        .set('Cookie', `access_token=${authToken}`)
        .query({ period: '30' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalCompletions');
      expect(response.body.data).toHaveProperty('currentStreak');
      expect(response.body.data).toHaveProperty('period');
    });
  });
});