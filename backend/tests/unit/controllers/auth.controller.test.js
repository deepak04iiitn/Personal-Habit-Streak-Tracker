import { jest } from '@jest/globals';
import { signin } from '../../../controllers/auth.controller.js';
import User from '../../../models/user.model.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../../models/user.model.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Controller - Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();

    User.findOne = jest.fn();
    bcryptjs.compareSync = jest.fn();
    jwt.sign = jest.fn();
  });

  describe('signin', () => {
    it('should call next with error if user is not found', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      User.findOne.mockResolvedValue(null);
      await signin(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));
    });

    it('should call next with error if password does not match', async () => {
      mockReq.body = { email: 'test@example.com', password: 'wrongpassword' };
      const mockUser = { _id: '123', password: 'hashedpassword' };
      User.findOne.mockResolvedValue(mockUser);
      bcryptjs.compareSync.mockReturnValue(false);
      await signin(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 400 }));
    });

    it('should sign in successfully and return a token', async () => {
      mockReq.body = { email: 'test@example.com', password: 'password123' };
      const mockUser = {
        _id: '123',
        password: 'hashedpassword',
        _doc: { username: 'testuser', email: 'test@example.com' },
      };
      User.findOne.mockResolvedValue(mockUser);
      bcryptjs.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('testtoken');

      await signin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.cookie).toHaveBeenCalledWith('access_token', 'testtoken', { httpOnly: true });
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ token: 'testtoken' }));
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});