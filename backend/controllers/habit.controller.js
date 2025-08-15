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


// Endpoint for marking a habit as complete
export const markHabitComplete = async (req, res, next) => {
    try {
      const { id } = req.params;
      const owner = req.user.id;
  
      if(!mongoose.Types.ObjectId.isValid(id)) 
      {
        return next(errorHandler(400, 'Invalid habit ID'));
      }
  
      const habit = await Habit.findOne({ _id: id, owner });
  
      if(!habit) 
      {
        return next(errorHandler(404, 'Habit not found'));
      }
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;

      if(lastCompleted) 
      {
        lastCompleted.setHours(0, 0, 0, 0);
        if(lastCompleted.getTime() === today.getTime()) 
        {
          return next(errorHandler(400, 'Habit already completed today'));
        }
      }
  
      habit.updateStreak();
      await habit.save();
  
      res.status(200).json({
        success: true,
        message: 'Habit marked as complete',
        data: {
          streakCount: habit.streakCount,
          longestStreak: habit.longestStreak,
          completions: habit.completions.length,
          completionRate: habit.completionRate
        }
      });
    } catch (error) {
      next(error);
    }
};


// Endpoint for updating a habit
export const updateHabit = async (req, res, next) => {
    try {
      const { id } = req.params;
      const owner = req.user.id;
      const { title, description, category, isDaily } = req.body;
  
      if(!mongoose.Types.ObjectId.isValid(id)) 
      {
        return next(errorHandler(400, 'Invalid habit ID'));
      }
  
      const updateData = {};

      if(title !== undefined) updateData.title = title;
      if(description !== undefined) updateData.description = description;
      if(category !== undefined) updateData.category = category;
      if(isDaily !== undefined) updateData.isDaily = isDaily;
  
      const habit = await Habit.findOneAndUpdate(
        { _id: id, owner },
        updateData,
        { new: true, runValidators: true }
      );
  
      if(!habit) 
      {
        return next(errorHandler(404, 'Habit not found'));
      }
  
      res.status(200).json({
        success: true,
        message: 'Habit updated successfully',
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


// Endpoint for deleting a habit
export const deleteHabit = async (req, res, next) => {
    try {
      const { id } = req.params;
      const owner = req.user.id;
  
      if(!mongoose.Types.ObjectId.isValid(id)) 
      {
        return next(errorHandler(400, 'Invalid habit ID'));
      }
  
      const habit = await Habit.findOneAndDelete({ _id: id, owner });
  
      if(!habit) 
      {
        return next(errorHandler(404, 'Habit not found'));
      }
  
      res.status(200).json({
        success: true,
        message: 'Habit deleted successfully'
      });

    } catch (error) {
      next(error);
    }
};


// Endpoint for getting the statistics of a habit
export const getHabitStats = async (req, res, next) => {
    try {
      const { id } = req.params;
      const owner = req.user.id;
      const { period = '30' } = req.query;
  
      if(!mongoose.Types.ObjectId.isValid(id)) 
      {
        return next(errorHandler(400, 'Invalid habit ID'));
      }
  
      const habit = await Habit.findOne({ _id: id, owner });
      if(!habit) 
      {
        return next(errorHandler(404, 'Habit not found'));
      }
  
      const days = parseInt(period);
      if(isNaN(days) || days <= 0) 
      {
        return next(errorHandler(400, 'Invalid period specified'));
      }
  
      // calculating period start date
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() - days);
  
      const completionsInPeriod = habit.completions
        .map(c => new Date(c.date))
        .filter(d => d >= startDate);
  
      // calculating streaks in the period
      let longestStreakInPeriod = 0;
      let currentStreakInPeriod = 0;
  
      if(completionsInPeriod.length > 0) 
      {
        const uniqueDates = [...new Set(completionsInPeriod.map(d => d.setHours(0,0,0,0)))]
          .map(t => new Date(t))
          .sort((a,b) => a - b);
  
        longestStreakInPeriod = 1;
        currentStreakInPeriod = 1;

        for(let i = 1; i < uniqueDates.length; i++) 
        {
          const diff = (uniqueDates[i] - uniqueDates[i-1]) / (1000*3600*24);

          if(diff === 1) 
          {
            currentStreakInPeriod++;
          } 
          else 
          {
            currentStreakInPeriod = 1;
          }

          if(currentStreakInPeriod > longestStreakInPeriod) 
          {
            longestStreakInPeriod = currentStreakInPeriod;
          }
        }
      }
  
      const periodCompletionRate = Math.min((completionsInPeriod.length / days) * 100, 100).toFixed(2) + '%';
  
      const stats = {
        totalCompletions: habit.completions.length,
        currentStreak: habit.streakCount,
        longestStreak: habit.longestStreak,
        overallCompletionRate: habit.completionRate.toFixed(2) + '%',
        lastCompleted: habit.lastCompleted,
        createdAt: habit.createdAt,
        period: {
          days,
          completions: completionsInPeriod.length,
          completionRate: periodCompletionRate,
          longestStreak: longestStreakInPeriod,
        }
      };
  
      res.status(200).json({ success: true, data: stats });

    } catch (error) {
      next(error);
    }
};


// Endpoint for getting the user's summary
export const getUserHabitSummary = async (req, res, next) => {
    try {
      const owner = req.user.id;
      const habits = await Habit.find({ owner });
      const dailyHabits = habits.filter(habit => habit.isDaily);
      
      const summary = {
        totalHabits: habits.length,
        activeStreaks: habits.filter(habit => habit.streakCount > 0).length,
        longestOverallStreak: Math.max(...habits.map(habit => habit.longestStreak), 0),
        averageCompletionRate: habits.length > 0 
          ? habits.reduce((sum, habit) => sum + habit.completionRate, 0) / habits.length 
          : 0,
        categoriesCount: [...new Set(habits.map(habit => habit.category))].length,
        dailyHabits: dailyHabits.length,
        totalCompletions: habits.reduce((sum, habit) => sum + habit.completions.length, 0)
      };
  
      // Habits which are completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      const completedToday = habits.filter(habit => {

        if(!habit.lastCompleted) return false;

        const lastCompleted = new Date(habit.lastCompleted);

        return lastCompleted >= today && lastCompleted < tomorrow;

      }).length;
  
      summary.completedToday = completedToday;
      summary.dailyCompletionRate = dailyHabits.length > 0 
        ? (completedToday / dailyHabits.length) * 100 
        : 0;
  
      res.status(200).json({
        success: true,
        data: summary
      });

    } catch (error) {
      next(error);
    }
};