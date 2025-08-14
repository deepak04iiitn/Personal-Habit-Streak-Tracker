import Habit from '../models/habit.model.js';
import { errorHandler } from '../utils/error.js';

export const createHabit = async (req, res, next) => {
  try {
    const { title, description, category, isDaily } = req.body;
    const owner = req.user.id;

    if(!title || !category || title === '' || category === '') 
    {
      return next(errorHandler(400, 'Title and category are required!'));
    }

    const habitData = {
      title,
      description,
      category,
      isDaily: isDaily !== undefined ? isDaily : true,
      owner
    };

    const habit = new Habit(habitData);
    await habit.save();

    res.status(201).json({
      success: true,
      message: 'Habit created successfully',
      data: habit
    });
  } catch (error) {
    if(error.code === 11000) 
    {
      return next(errorHandler(400, 'A habit with this title already exists'));
    }
    
    if(error.name === 'ValidationError') 
    {
      const errors = Object.values(error.errors).map(err => err.message);
      return next(errorHandler(400, errors.join(', ')));
    }

    next(error);
  }
};