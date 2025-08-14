import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';

const HabitDetailsModal = ({ habit, isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    if(isOpen && habit) 
    {
      fetchHabitStats();
    }
  }, [isOpen, habit, selectedPeriod]);

  const fetchHabitStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/backend/habits/${habit._id}/statistics?period=${selectedPeriod}`, {
        credentials: 'include'
      });

      if(response.ok) 
      {
        const data = await response.json();
        setStats(data.data);
      }

    } catch (error) {
      console.error('Failed to fetch habit stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if(!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const isCompletedToday = () => {
    if(!habit.lastCompleted) return false;
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    return today.toDateString() === lastCompleted.toDateString();
  };

  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{habit.title}</h2>
            <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              {formatCategory(habit.category)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target size={18} className="text-blue-600" />
              Habit Details
            </h3>
            <div className="space-y-2">
              {habit.description && (
                <p className="text-gray-700">{habit.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Type: {habit.isDaily ? 'Daily' : 'Custom'}</span>
                <span>Created: {formatDate(habit.createdAt)}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  isCompletedToday() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isCompletedToday() ? 'Completed Today' : 'Not Completed Today'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp size={20} className="text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{habit.streakCount}</div>
              <div className="text-sm text-orange-700">Current Streak</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Award size={20} className="text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{habit.longestStreak}</div>
              <div className="text-sm text-purple-700">Longest Streak</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 size={20} className="text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">
                {habit.completionRate ? habit.completionRate.toFixed(1) : '0.0'}%
              </div>
              <div className="text-sm text-green-700">Success Rate</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Calendar size={20} className="text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{habit.completions?.length || 0}</div>
              <div className="text-sm text-blue-700">Total Completions</div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading statistics...</p>
            </div>
          ) : stats && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-blue-600" />
                  Period Statistics
                </h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stats.period.completions}</div>
                  <div className="text-sm text-gray-600">Completions in {selectedPeriod} days</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stats.period.completionRate}</div>
                  <div className="text-sm text-gray-600">Period Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{stats.period.longestStreak}</div>
                  <div className="text-sm text-gray-600">Longest Streak in Period</div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Last Completed</span>
                  <span>{formatDate(stats.lastCompleted)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Overall Success Rate</span>
                  <span>{stats.overallCompletionRate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="cursor-pointer px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailsModal;