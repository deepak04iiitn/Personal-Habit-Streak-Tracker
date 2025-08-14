// HabitCard.jsx
import React, { useState } from 'react';
import { Calendar, TrendingUp, Eye, Trash2, Edit, CheckCircle, Circle } from 'lucide-react';

const HabitCard = ({ habit, onView, onEdit, onDelete, onMarkComplete, viewMode }) => {
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

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

  const handleMarkComplete = async () => {
    if (isCompletedToday() || isMarkingComplete) return;
    
    try {
      setIsMarkingComplete(true);
      await onMarkComplete(habit);
    } catch (error) {
      console.error('Error marking habit complete:', error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 flex-1">
            {/* Mark Complete Button */}
            <button
              onClick={handleMarkComplete}
              disabled={isCompletedToday() || isMarkingComplete}
              className={`flex-shrink-0 p-3 rounded-2xl transition-all duration-200 ${
                isCompletedToday() 
                  ? 'bg-green-100 text-green-600 cursor-default' 
                  : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 hover:scale-105'
              } ${isMarkingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isCompletedToday() ? 'Completed Today' : 'Mark as Complete'}
            >
              {isMarkingComplete ? (
                <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : isCompletedToday() ? (
                <CheckCircle size={24} />
              ) : (
                <Circle size={24} />
              )}
            </button>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <h3 className="text-xl font-semibold text-gray-800">{habit.title}</h3>
                <span className={`px-3 py-1.5 rounded-xl text-sm font-medium ${
                  isCompletedToday() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isCompletedToday() ? 'Completed Today' : 'Pending'}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed">{habit.description}</p>
              <div className="flex items-center gap-6 text-gray-500">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Category:</span> {formatCategory(habit.category)}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="font-medium">Streak:</span> {habit.streakCount}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="font-medium">Best:</span> {habit.longestStreak}
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Rate:</span> {getCompletionRate()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onView(habit)}
              className="p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105"
              title="View Details"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={() => onEdit(habit)}
              className="p-3 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition-all duration-200 hover:scale-105"
              title="Edit Habit"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => onDelete(habit)}
              className="p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 hover:scale-105"
              title="Delete Habit"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl hover:border-gray-300 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-5 flex-1">
          {/* Mark Complete Button */}
          <button
            onClick={handleMarkComplete}
            disabled={isCompletedToday() || isMarkingComplete}
            className={`flex-shrink-0 p-3 rounded-2xl transition-all duration-200 ${
              isCompletedToday() 
                ? 'bg-green-100 text-green-600 cursor-default' 
                : 'bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 hover:scale-105'
            } ${isMarkingComplete ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isCompletedToday() ? 'Completed Today' : 'Mark as Complete'}
          >
            {isMarkingComplete ? (
              <div className="w-6 h-6 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            ) : isCompletedToday() ? (
              <CheckCircle size={24} />
            ) : (
              <Circle size={24} />
            )}
          </button>

          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-gray-800 leading-tight">{habit.title}</h3>
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg font-medium">
              {formatCategory(habit.category)}
            </span>
          </div>
        </div>
        
        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
          isCompletedToday() ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isCompletedToday() ? '✓ Completed' : 'Pending'}
        </span>
      </div>
      
      <p className="text-gray-600 mb-8 leading-relaxed text-base line-clamp-3">{habit.description}</p>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp size={18} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Streak</p>
              <p className="text-2xl font-bold text-gray-800">{habit.streakCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Calendar size={18} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Best Streak</p>
              <p className="text-2xl font-bold text-gray-800">{habit.longestStreak}</p>
            </div>
          </div>
        </div>
        
        <div className="col-span-2 bg-gray-50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-700">Completion Rate</span>
            <span className="text-lg font-bold text-gray-800">{getCompletionRate()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(habit.completionRate || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-medium ${
              habit.isDaily ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {habit.isDaily ? 'Daily' : 'Custom'}
            </span>
          </p>
          <p className="text-xs text-gray-500">
            Created {new Date(habit.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(habit)}
            className="cursor-pointer p-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200 hover:scale-105"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(habit)}
            className="cursor-pointer p-3 text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-xl transition-all duration-200 hover:scale-105"
            title="Edit Habit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(habit)}
            className="cursor-pointer p-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-200 hover:scale-105"
            title="Delete Habit"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
