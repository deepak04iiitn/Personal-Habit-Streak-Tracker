import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import habitRoutes from '../../routes/habit.route.js';
import { createAuthenticatedUser, createTestHabit } from '../setup/testHelpers.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/habits', habitRoutes);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message 
  });
});

describe('Security Tests', () => {
  let authUser, authToken, otherUser, otherToken;

  beforeEach(async () => {
    // Creating two different authenticated users with unique data
    const auth1 = await createAuthenticatedUser({
      username: `securityuser1_${Date.now()}`,
      email: `security1_${Date.now()}@example.com`
    });
    authUser = auth1.user;
    authToken = auth1.token;

    // Ensuring second user has different timestamp
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const auth2 = await createAuthenticatedUser({
      username: `securityuser2_${Date.now()}`,
      email: `security2_${Date.now()}@example.com`
    });
    otherUser = auth2.user;
    otherToken = auth2.token;
  });

  test('should not allow access to other user\'s habits', async () => {
    // Creating habit for first user
    const habit = await createTestHabit(authUser._id, { title: 'Private Habit' });

    // Trying to access with second user's token
    const response = await request(app)
      .get(`/habits/${habit._id}/details`)
      .set('Cookie', `access_token=${otherToken}`);

    expect(response.status).toBe(404); // Should not find habit
  });

  test('should not allow modifying other user\'s habits', async () => {
    const habit = await createTestHabit(authUser._id);

    const response = await request(app)
      .put(`/habits/${habit._id}/update`)
      .set('Cookie', `access_token=${otherToken}`)
      .send({ title: 'Hacked Title' });

    expect(response.status).toBe(404);
  });

  test('should not allow deleting other user\'s habits', async () => {
    const habit = await createTestHabit(authUser._id);

    const response = await request(app)
      .delete(`/habits/${habit._id}/remove`)
      .set('Cookie', `access_token=${otherToken}`);

    expect(response.status).toBe(404);
  });

  test('should validate habit ID format', async () => {
    const response = await request(app)
      .get('/habits/invalid-id/details')
      .set('Cookie', `access_token=${authToken}`);

    expect(response.status).toBe(400);
  });
});

describe('Boundary Tests', () => {
  let authUser, authToken;

  beforeEach(async () => {
    const auth = await createAuthenticatedUser({
      username: `boundaryuser_${Date.now()}`,
      email: `boundary_${Date.now()}@example.com`
    });
    authUser = auth.user;
    authToken = auth.token;
  });

  test('should handle pagination edge cases', async () => {
    // Testing with page 0
    const response1 = await request(app)
      .get('/habits/my-habits')
      .set('Cookie', `access_token=${authToken}`)
      .query({ page: 0 });

    expect(response1.status).toBe(400);

    // Testing with limit too high
    const response2 = await request(app)
      .get('/habits/my-habits')
      .set('Cookie', `access_token=${authToken}`)
      .query({ limit: 100 });

    expect(response2.status).toBe(400);
  });

  test('should handle habit title length limits', async () => {
    // Too short title
    const response1 = await request(app)
      .post('/habits/create-new-habit')
      .set('Cookie', `access_token=${authToken}`)
      .send({
        title: 'AB',
        category: 'EXERCISE'
      });

    expect(response1.status).toBe(400);

    // Too long title
    const longTitle = 'A'.repeat(101);
    const response2 = await request(app)
      .post('/habits/create-new-habit')
      .set('Cookie', `access_token=${authToken}`)
      .send({
        title: longTitle,
        category: 'EXERCISE'
      });

    expect(response2.status).toBe(400);
  });
});