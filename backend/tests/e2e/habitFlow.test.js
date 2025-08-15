import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../../routes/auth.route.js';
import habitRoutes from '../../routes/habit.route.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);
app.use('/habits', habitRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error in test:', err.message);
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message 
  });
});

describe('Complete Habit Flow E2E', () => {
  let userToken, userId;

  test('Complete user journey: signup -> create habit -> complete habit -> view stats', async () => {
    const timestamp = Date.now();
    const uniqueEmail = `e2e${timestamp}@example.com`;
    const uniqueUsername = `e2euser${timestamp}`;

    // Step 1: User Signup
    const signupResponse = await request(app)
      .post('/auth/signup')
      .send({
        username: uniqueUsername,
        email: uniqueEmail,
        password: 'password123'
      });

    expect(signupResponse.status).toBe(201);
    console.log('Signup response:', signupResponse.body);

    // Step 2: User Signin
    const signinResponse = await request(app)
      .post('/auth/signin')
      .send({
        email: uniqueEmail,
        password: 'password123'
      });

    console.log('Signin response status:', signinResponse.status);
    console.log('Signin response body:', signinResponse.body);
    
    expect(signinResponse.status).toBe(200);
    userToken = signinResponse.body.token;
    userId = signinResponse.body._id;

    expect(userToken).toBeDefined();
    expect(userId).toBeDefined();

    // Step 3: Create a habit
    const habitResponse = await request(app)
      .post('/habits/create-new-habit')
      .set('Cookie', `access_token=${userToken}`)
      .send({
        title: 'Daily Meditation',
        description: '10 minutes of daily meditation',
        category: 'MINDFULNESS',
        isDaily: true
      });

    expect(habitResponse.status).toBe(201);
    const habitId = habitResponse.body.data._id;

    // Step 4: Get user habits
    const habitsResponse = await request(app)
      .get('/habits/my-habits')
      .set('Cookie', `access_token=${userToken}`);

    expect(habitsResponse.status).toBe(200);
    expect(habitsResponse.body.data).toHaveLength(1);
    expect(habitsResponse.body.data[0].title).toBe('Daily Meditation');

    // Step 5: Mark habit as complete
    const completeResponse = await request(app)
      .post(`/habits/${habitId}/mark-complete`)
      .set('Cookie', `access_token=${userToken}`);

    expect(completeResponse.status).toBe(200);
    expect(completeResponse.body.data.streakCount).toBe(1);

    // Step 6: Get habit statistics
    const statsResponse = await request(app)
      .get(`/habits/${habitId}/statistics`)
      .set('Cookie', `access_token=${userToken}`)
      .query({ period: '7' });

    expect(statsResponse.status).toBe(200);
    expect(statsResponse.body.data.currentStreak).toBe(1);
    expect(statsResponse.body.data.totalCompletions).toBe(1);

    // Step 7: Get user summary
    const summaryResponse = await request(app)
      .get('/habits/my-summary')
      .set('Cookie', `access_token=${userToken}`);

    expect(summaryResponse.status).toBe(200);
    expect(summaryResponse.body.data.totalHabits).toBe(1);
    expect(summaryResponse.body.data.completedToday).toBe(1);
    expect(summaryResponse.body.data.activeStreaks).toBe(1);

    // Step 8: Update habit
    const updateResponse = await request(app)
      .put(`/habits/${habitId}/update`)
      .set('Cookie', `access_token=${userToken}`)
      .send({
        description: 'Updated to 15 minutes of daily meditation'
      });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.description).toBe('Updated to 15 minutes of daily meditation');

    // Step 9: Delete habit
    const deleteResponse = await request(app)
      .delete(`/habits/${habitId}/remove`)
      .set('Cookie', `access_token=${userToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.success).toBe(true);
  });
});