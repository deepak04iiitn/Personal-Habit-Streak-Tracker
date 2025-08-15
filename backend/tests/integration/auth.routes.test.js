import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from '../../routes/auth.route.js';
import { createTestUser, generateToken } from '../setup/testHelpers.js';
import User from '../../models/user.model.js';

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Auth route error:', err.message);
  res.status(err.statusCode || 500).json({ 
    success: false, 
    message: err.message || 'Internal Server Error' 
  });
});

describe('Auth Routes Integration Tests', () => {
  
  describe('POST /auth/signup', () => {
    test('should signup a new user successfully', async () => {
      const timestamp = Date.now();
      const userData = {
        username: `newuser_${timestamp}`,
        email: `newuser_${timestamp}@example.com`,
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/signup')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Signup successful!');

      const user = await User.findOne({ email: userData.email });
      expect(user).toBeTruthy();
      expect(user.username).toBe(userData.username);
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    test('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: '', // Missing email
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    test('should fail with invalid email format', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'invalid-email-format',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    test('should fail with password too short', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '123' // Too short
        });

      expect(response.status).toBe(400);
    });

    test('should fail with password without numbers', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'onlyletters' 
        });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /auth/signin', () => {
    let testUserData;

    beforeEach(async () => {
      const timestamp = Date.now();
      testUserData = {
        username: `signinuser_${timestamp}`,
        email: `signin_${timestamp}@example.com`,
        password: 'password123'
      };

      await request(app)
        .post('/auth/signup')
        .send(testUserData);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    test('should signin successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: testUserData.email,
          password: testUserData.password
        });

      console.log('Signin test response:', response.status, response.body);

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.expiresAt).toBeDefined();
      expect(response.body.email).toBe(testUserData.email);
      expect(response.body.username).toBe(testUserData.username);
      expect(response.body.password).toBeUndefined(); // Password should not be returned
      expect(response.headers['set-cookie']).toBeDefined(); 
    });

    test('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: '',
          password: ''
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('All fields are required!');
    });

    test('should fail with invalid email', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials!');
    });

    test('should fail with invalid password', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({
          email: testUserData.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials!');
    });
  });

  describe('POST /auth/logout', () => {
    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Signed out successfully.');
      
      // Check that cookie is cleared
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('access_token=;');
    });
  });

  describe('GET /auth/me', () => {
    let authToken, userData;

    beforeEach(async () => {
      const timestamp = Date.now();
      userData = {
        username: `meuser_${timestamp}`,
        email: `me_${timestamp}@example.com`,
        password: 'password123'
      };

      await request(app)
        .post('/auth/signup')
        .send(userData);

      await new Promise(resolve => setTimeout(resolve, 100));

      const signinResponse = await request(app)
        .post('/auth/signin')
        .send({
          email: userData.email,
          password: userData.password
        });

      authToken = signinResponse.body.token;
      expect(authToken).toBeDefined();
    });

    test('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Cookie', `access_token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.username).toBe(userData.username);
      expect(response.body.data.email).toBe(userData.email);
      expect(response.body.data.password).toBeUndefined();
    });

    test('should fail without authentication token', async () => {
      const response = await request(app)
        .get('/auth/me');

      expect(response.status).toBe(401);
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/auth/me')
        .set('Cookie', 'access_token=invalid-token');

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /auth/delete-profile', () => {
    let authToken, userData, userId;

    beforeEach(async () => {
      const timestamp = Date.now();
      userData = {
        username: `deleteuser_${timestamp}`,
        email: `delete_${timestamp}@example.com`,
        password: 'password123'
      };

      await request(app)
        .post('/auth/signup')
        .send(userData);

      await new Promise(resolve => setTimeout(resolve, 100));

      const signinResponse = await request(app)
        .post('/auth/signin')
        .send({
          email: userData.email,
          password: userData.password
        });

      authToken = signinResponse.body.token;
      userId = signinResponse.body._id;
      expect(authToken).toBeDefined();
    });

    test('should delete user account successfully', async () => {
      const response = await request(app)
        .delete('/auth/delete-profile')
        .set('Cookie', `access_token=${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Account deleted successfully.');

      const deletedUser = await User.findById(userId);
      expect(deletedUser).toBeNull();

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('access_token=;');
    });

    test('should fail without authentication', async () => {
      const response = await request(app)
        .delete('/auth/delete-profile');

      expect(response.status).toBe(401);
    });

    test('should fail with invalid token', async () => {
      const response = await request(app)
        .delete('/auth/delete-profile')
        .set('Cookie', 'access_token=invalid-token');

      expect(response.status).toBe(401);
    });
  });
});