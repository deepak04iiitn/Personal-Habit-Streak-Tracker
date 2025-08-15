import User from '../../models/user.model.js';
import Habit from '../../models/habit.model.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

let userCounter = 0;
let habitCounter = 0;

export const createTestUser = async (userData = {}) => {
  userCounter++;
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  
  const defaultUser = {
    username: `testuser${userCounter}_${randomSuffix}`,
    email: `test${userCounter}_${timestamp}@example.com`,
    password: bcryptjs.hashSync('password123', 10)
  };
  
  const user = new User({ ...defaultUser, ...userData });
  await user.save();
  return user;
};

export const createTestHabit = async (userId, habitData = {}) => {
  habitCounter++;
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(7);
  
  const defaultHabit = {
    title: `Test Habit ${habitCounter}_${randomSuffix}`,
    description: `Test Description ${timestamp}`,
    category: 'EXERCISE',
    isDaily: true,
    owner: userId
  };
  
  const habit = new Habit({ ...defaultHabit, ...habitData });
  await habit.save();
  return habit;
};

export const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'test-secret-key-for-testing';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '1h'
  });
};

export const createAuthenticatedUser = async (userData = {}) => {
  const user = await createTestUser(userData);
  const token = generateToken(user._id);
  return { user, token };
};

// Helper for clearing all test data
export const clearTestData = async () => {
  await User.deleteMany({});
  await Habit.deleteMany({});
  userCounter = 0;
  habitCounter = 0;
};

// Helper for creating multiple test habits
export const createMultipleTestHabits = async (userId, count = 3) => {
  const habits = [];
  for(let i = 0; i < count; i++) 
  {
    const habit = await createTestHabit(userId, {
      title: `Habit ${i + 1}`,
      category: i % 2 === 0 ? 'EXERCISE' : 'READING'
    });
    habits.push(habit);
  }
  return habits;
};