import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({

  title: {
    type: String,
    required: [true, 'Habit title is required'],
    trim: true,
    minlength: [3, 'Habit title must be at least 3 characters long'],
    maxlength: [100, 'Habit title cannot exceed 100 characters'],
  },

  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
  },

  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'EXERCISE', 'DIET', 'HYDRATION', 'SLEEP', 'MINDFULNESS',
        'SKILL_DEVELOPMENT', 'READING', 'LEARNING', 'WAKE_UP_ON_TIME',
        'PLANNING', 'FOCUSED_WORK', 'CHORES', 'FINANCES', 'SOCIAL',
        'NO_SMOKING', 'NO_JUNK_FOOD', 'LIMITED_SCREEN_TIME',
      ],
      message: '{VALUE} is not a valid category',
    },
  },

  isDaily: {
    type: Boolean,
    default: true,
  },

  streakCount: {
    type: Number,
    default: 0,
    min: [0, 'Streak count cannot be negative'],
  },

  longestStreak: {
    type: Number,
    default: 0,
    min: [0, 'Longest streak cannot be negative'],
  },

  lastCompleted: {
    type: Date,
    default: null,
    validate: {
      validator: function(date) {
        if (!date) return true;
        return date <= new Date();
      },
      message: 'lastCompleted date cannot be in the future.',
    },
  },

  completions: [{
    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function(date) {
          return date <= new Date();
        },
        message: 'Completion date cannot be in the future.'
      }
    }
  }],  

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required'],
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Preventing duplicate habit titles for the same user
habitSchema.index({ title: 1, owner: 1 }, { unique: true });


// Virtual for completion rate
habitSchema.virtual('completionRate').get(function() {

  const createdAt = this.createdAt;

  if(!createdAt) return 0;

  const now = new Date();

  const daysSinceCreation = Math.max(1, Math.ceil((now - createdAt) / (1000 * 60 * 60 * 24)));

  return (this.completions.length / daysSinceCreation) * 100;

});


// Updating the streak and tracking completions
habitSchema.methods.updateStreak = function() {

  if(this.isDaily) 
 {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    if(this.lastCompleted) 
    {
      const lastCompletedDate = new Date(this.lastCompleted);
      lastCompletedDate.setHours(0, 0, 0, 0);

      if(lastCompletedDate.getTime() === yesterday.getTime()) 
      {
        this.streakCount++;
      } 
      else 
      {
        this.streakCount = 1;
      }
    } 
    else 
    {
      this.streakCount = 1; // First completion
    }

    if(this.streakCount > this.longestStreak) 
    {
      this.longestStreak = this.streakCount;
    }

    this.lastCompleted = new Date();
    this.completions.push({ date: new Date() });
  }
};

const Habit = mongoose.model('Habit', habitSchema);

export default Habit;
