import Habit from '../../../models/habit.model.js';
import User from '../../../models/user.model.js';
import { createTestUser } from '../../setup/testHelpers.js';

describe('Habit Model', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await createTestUser();
  });

  describe('Validation', () => {
    test('should create a valid habit', async () => {
      const habitData = {
        title: 'Morning Exercise',
        description: 'Daily morning workout',
        category: 'EXERCISE',
        owner: testUser._id
      };
      
      const habit = new Habit(habitData);
      const savedHabit = await habit.save();
      
      expect(savedHabit._id).toBeDefined();
      expect(savedHabit.title).toBe(habitData.title);
      expect(savedHabit.category).toBe(habitData.category);
      expect(savedHabit.isDaily).toBe(true);
      expect(savedHabit.streakCount).toBe(0);
    });

    test('should fail with invalid category', async () => {
      const habit = new Habit({
        title: 'Test Habit',
        category: 'INVALID_CATEGORY',
        owner: testUser._id
      });
      
      let error;
      try {
        await habit.save();
      } catch (err) {
        error = err;
      }
      
      expect(error.errors.category).toBeDefined();
    });

    test('should fail with title too short', async () => {
      const habit = new Habit({
        title: 'AB',
        category: 'EXERCISE',
        owner: testUser._id
      });
      
      let error;
      try {
        await habit.save();
      } catch (err) {
        error = err;
      }
      
      expect(error.errors.title).toBeDefined();
    });

    test('should calculate completion rate correctly', async () => {
      const habit = new Habit({
        title: 'Test Habit',
        category: 'EXERCISE',
        owner: testUser._id,
        completions: [
          { date: new Date() },
          { date: new Date(Date.now() - 86400000) }
        ]
      });
      
      await habit.save();
      expect(habit.completionRate).toBeGreaterThan(0);
    });
  });

  describe('Methods', () => {
    test('should update streak correctly', async () => {
      const habit = new Habit({
        title: 'Test Habit',
        category: 'EXERCISE',
        owner: testUser._id
      });
      
      await habit.save();
      
      // First completion
      habit.updateStreak();
      expect(habit.streakCount).toBe(1);
      expect(habit.longestStreak).toBe(1);
      expect(habit.completions.length).toBe(1);
      
      // Second completion (simulate yesterday)
      habit.lastCompleted = new Date(Date.now() - 86400000);
      habit.updateStreak();
      expect(habit.streakCount).toBe(2);
      expect(habit.longestStreak).toBe(2);
    });

    test('should reset streak if gap in completions', async () => {
      const habit = new Habit({
        title: 'Test Habit',
        category: 'EXERCISE',
        owner: testUser._id,
        streakCount: 5,
        longestStreak: 5,
        lastCompleted: new Date(Date.now() - 2 * 86400000) // 2 days ago
      });
      
      await habit.save();
      habit.updateStreak();
      
      expect(habit.streakCount).toBe(1);
      expect(habit.longestStreak).toBe(5); // Should maintain longest
    });
  });
});