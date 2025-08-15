import User from '../../../models/user.model.js';
import mongoose from 'mongoose';

describe('User Model', () => {

  beforeAll(async () => {
    await User.createIndexes();
  });

  describe('Validation', () => {
    test('should create a valid user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword'
      };
      
      const user = new User(userData);
      const savedUser = await user.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.username).toBe(userData.username);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.createdAt).toBeDefined();
    });

    test('should fail without required fields', async () => {
      const user = new User({});
      let error;
      
      try {
        await user.save();
      } catch (err) {
        error = err;
      }
      
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
      expect(error.errors.username).toBeDefined();
      expect(error.errors.email).toBeDefined();
      expect(error.errors.password).toBeDefined();
    });

    test('should fail with duplicate email', async () => {
        const userData = {
          username: 'user1',
          email: 'test@example.com',
          password: 'password'
        };
        
        await new User(userData).save();
        
        const duplicateUser = new User({
          username: 'user2',
          email: 'test@example.com',
          password: 'password'
        });
        
        let error;
        try {
          await duplicateUser.save();
        } catch (err) {
          error = err;
        }
        
        expect(error).toBeDefined();
        expect(error).toHaveProperty('code', 11000);
       });
  });
});