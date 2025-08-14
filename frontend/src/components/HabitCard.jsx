import React from 'react';
import { Calendar, TrendingUp, Eye, Trash2, Edit } from 'lucide-react';

const HabitCard = ({ habit, onView, onEdit, onDelete, viewMode }) => {
  const isCompletedToday = () => {
    if (!habit.lastCompleted) return false;
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    return today.toDateString() === lastCompleted.toDateString();
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCompletionRate = () => {
    return habit.completionRate ? habit.completionRate.toFixed(1) + '%' : '0%';
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800">{habit.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isCompletedToday() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {isCompletedToday() ? 'Completed Today' : 'Pending'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>Category: {formatCategory(habit.category)}</span>
              <span>Streak: {habit.streakCount}</span>
              <span>Best: {habit.longestStreak}</span>
              <span>Rate: {getCompletionRate()}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(habit)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => onEdit(habit)}
              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
              title="Edit Habit"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(habit)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete Habit"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{habit.title}</h3>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {formatCategory(habit.category)}
          </span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isCompletedToday() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
        }`}>
          {isCompletedToday() ? '✓ Done' : 'Pending'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{habit.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-orange-500" />
          <span>Streak: <strong>{habit.streakCount}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-purple-500" />
          <span>Best: <strong>{habit.longestStreak}</strong></span>
        </div>
        <div className="col-span-2">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Completion Rate</span>
            <span>{getCompletionRate()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min(habit.completionRate || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {habit.isDaily ? 'Daily' : 'Custom'} • Created {new Date(habit.createdAt).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onView(habit)}
            className="cursor-pointer p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            onClick={() => onEdit(habit)}
            className="cursor-pointer p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
            title="Edit Habit"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={() => onDelete(habit)}
            className="cursor-pointer p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Delete Habit"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;