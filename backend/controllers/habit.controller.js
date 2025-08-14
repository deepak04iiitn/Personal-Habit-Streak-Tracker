import Habit from '../models/habit.model.js';
import { errorHandler } from '../utils/error.js';
import mongoose from 'mongoose';


// Endpoint for creating a new habit
export const createHabit = async (req, res, next) => {
  try {
    const { title, description, isDaily } = req.body;
    const category = req.body.category ? req.body.category.toUpperCase() : undefined;
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


// Endpoint for getting all habits for a user 
export const getHabits = async (req, res, next) => {
    try {
      const owner = req.user.id;
      const { 
        category, 
        isDaily, 
        search,
        page = 1,
        limit = 8,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;
  
      const filter = { owner };
      
      if(category) filter.category = category;
      
      if(isDaily !== undefined) filter.isDaily = isDaily === 'true';
      
      if(search && search.trim() !== '') 
      {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
  
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;
  
      if(pageNum < 1) 
      {
        return next(errorHandler(400, 'Page number must be greater than 0'));
      }
      
      if(limitNum < 1 || limitNum > 50) 
      {
        return next(errorHandler(400, 'Limit must be between 1 and 50'));
      }
  
      const sortOptions = {};
      const validSortFields = ['title', 'category', 'createdAt', 'updatedAt', 'streakCount', 'longestStreak'];
      
      if(validSortFields.includes(sortBy)) 
      {
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
      } 
      else 
      {
        sortOptions.createdAt = -1; 
      }
  
      const totalHabits = await Habit.countDocuments(filter);
      
      const habits = await Habit.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'username email');
  
      const totalPages = Math.ceil(totalHabits / limitNum);
      const hasNextPage = pageNum < totalPages;
      const hasPrevPage = pageNum > 1;
  
      res.status(200).json({
        success: true,
        data: habits,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalHabits,
          habitsPerPage: limitNum,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? pageNum + 1 : null,
          prevPage: hasPrevPage ? pageNum - 1 : null
        },
        filters: {
          category: category || null,
          isDaily: isDaily || null,
          search: search || null,
          sortBy,
          sortOrder
        }
      });
    } catch (error) {
      next(error);
    }
};


// Endpoint for getting a specific habit by its ID
export const getHabit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const owner = req.user.id;

    if(!mongoose.Types.ObjectId.isValid(id)) 
    {
      return next(errorHandler(400, 'Invalid habit ID'));
    }

    const habit = await Habit.findOne({ _id: id, owner })
      .populate('owner', 'username email');

    if(!habit) 
    {
      return next(errorHandler(404, 'Habit not found'));
    }

    res.status(200).json({
      success: true,
      data: habit
    });
  } catch (error) {
    next(error);
  }
};