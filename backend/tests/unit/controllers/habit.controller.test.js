import { jest } from '@jest/globals';
import * as habitController from '../../../controllers/habit.controller.js';
import Habit from '../../../models/habit.model.js';
import User from '../../../models/user.model.js';
import { createTestUser, createTestHabit } from '../../setup/testHelpers.js';

// Error handler 
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

describe('Habit Controller Unit Tests', () => {
  let testUser;
  let mockReq, mockRes, mockNext;

  beforeEach(async () => {
    testUser = await createTestUser();
    
    // Mock request, response, and next function
    mockReq = {
      user: { id: testUser._id.toString() },
      body: {},
      params: {},
      query: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('createHabit', () => {
    test('should create a new habit successfully', async () => {
      mockReq.body = {
        title: 'Morning Exercise',
        description: 'Daily workout routine',
        category: 'exercise', // Will be converted to uppercase
        isDaily: true
      };

      await habitController.createHabit(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Habit created successfully',
        data: expect.objectContaining({
          title: 'Morning Exercise',
          category: 'EXERCISE',
          owner: testUser._id
        })
      });
    });

    test('should fail with missing required fields', async () => {
      mockReq.body = {
        description: 'Missing title and category'
      };

      await habitController.createHabit(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining('required')
        })
      );
    });

    test('should handle validation errors', async () => {
      mockReq.body = {
        title: 'AB', // Too short
        category: 'EXERCISE'
      };

      await habitController.createHabit(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400
        })
      );
    });
  });

  describe('getHabits', () => {
    beforeEach(async () => {
      // Creating test habits
      await createTestHabit(testUser._id, { 
        title: 'Exercise Habit', 
        category: 'EXERCISE' 
      });
      await createTestHabit(testUser._id, { 
        title: 'Reading Habit', 
        category: 'READING' 
      });
    });

    test('should get user habits with default pagination', async () => {
      mockReq.query = {};

      await habitController.getHabits(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({ category: 'EXERCISE' }),
            expect.objectContaining({ category: 'READING' })
          ]),
          pagination: expect.objectContaining({
            currentPage: 1,
            totalHabits: 2
          })
        })
      );
    });

    test('should filter habits by category', async () => {
      mockReq.query = { category: 'EXERCISE' };

      await habitController.getHabits(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.arrayContaining([
            expect.objectContaining({ 
              category: 'EXERCISE' 
            })
          ])
        })
      );
      
      // Should only return 1 habit (filtered)
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.data).toHaveLength(1);
    });

    test('should handle pagination parameters', async () => {
      mockReq.query = { page: '1', limit: '1' };

      await habitController.getHabits(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      const responseData = mockRes.json.mock.calls[0][0];
      expect(responseData.pagination.habitsPerPage).toBe(1);
      expect(responseData.pagination.totalPages).toBe(2);
    });

    test('should fail with invalid page number', async () => {
      mockReq.query = { page: '0' };

      await habitController.getHabits(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining('Page number')
        })
      );
    });
  });

  describe('markHabitComplete', () => {
    let testHabit;

    beforeEach(async () => {
      testHabit = await createTestHabit(testUser._id);
    });

    test('should mark habit as complete successfully', async () => {
      mockReq.params = { id: testHabit._id.toString() };

      await habitController.markHabitComplete(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Habit marked as complete',
        data: expect.objectContaining({
          streakCount: expect.any(Number),
          longestStreak: expect.any(Number)
        })
      });
    });

    test('should fail when habit already completed today', async () => {
      mockReq.params = { id: testHabit._id.toString() };

      // Marking habit as completed first time
      await habitController.markHabitComplete(mockReq, mockRes, mockNext);
      
      jest.clearAllMocks();

      // Trying to mark complete again
      await habitController.markHabitComplete(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 400,
          message: expect.stringContaining('already completed')
        })
      );
    });
  });

  describe('updateHabit', () => {
    let testHabit;

    beforeEach(async () => {
      testHabit = await createTestHabit(testUser._id);
    });

    test('should update habit successfully', async () => {
      mockReq.params = { id: testHabit._id.toString() };
      mockReq.body = {
        title: 'Updated Habit Title',
        description: 'Updated description'
      };

      await habitController.updateHabit(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Habit updated successfully',
        data: expect.objectContaining({
          title: 'Updated Habit Title',
          description: 'Updated description'
        })
      });
    });
  });

  describe('deleteHabit', () => {
    let testHabit;

    beforeEach(async () => {
      testHabit = await createTestHabit(testUser._id);
    });

    test('should delete habit successfully', async () => {
      mockReq.params = { id: testHabit._id.toString() };

      await habitController.deleteHabit(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Habit deleted successfully'
      });

      // Verifying that habit was actually deleted
      const deletedHabit = await Habit.findById(testHabit._id);
      expect(deletedHabit).toBeNull();
    });
  });

  describe('getHabitStats', () => {
    let testHabit;

    beforeEach(async () => {
      testHabit = await createTestHabit(testUser._id);
    });

    test('should get habit statistics successfully', async () => {
      mockReq.params = { id: testHabit._id.toString() };
      mockReq.query = { period: '30' };

      await habitController.getHabitStats(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          totalCompletions: expect.any(Number),
          currentStreak: expect.any(Number),
          longestStreak: expect.any(Number)
        })
      });
    });
  });
});