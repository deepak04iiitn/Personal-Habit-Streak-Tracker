import React, { useState, useEffect } from 'react';
import { X, Calendar, TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';

const HabitDetailsModal = ({ habit, isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    if (isOpen && habit) {
      fetchHabitStats();
    }
  }, [isOpen, habit, selectedPeriod]);

  const fetchHabitStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/backend/habits/${habit._id}/statistics?period=${selectedPeriod}`, {
        credentials: 'include'
      });

      if (response.ok) {
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
    if (!date) return 'Never';
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
    if (!habit.lastCompleted) return false;
    const today = new Date();
    const lastCompleted = new Date(habit.lastCompleted);
    return today.toDateString() === lastCompleted.toDateString();
  };

  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        
        <div className="flex items-start justify-between p-8 border-b border-gray-100 flex-shrink-0">
          <div className="space-y-4 flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{habit.title}</h2>
                <span className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-xl font-medium">
                  {formatCategory(habit.category)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-3 text-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Target size={18} className="text-blue-600" />
              </div>
              Habit Overview
            </h3>
            <div className="space-y-4">
              {habit.description && (
                <p className="text-gray-700 leading-relaxed text-base">{habit.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  habit.isDaily ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {habit.isDaily ? 'Daily Habit' : 'Custom Habit'}
                </span>
                <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-xl text-sm font-medium">
                  Created {formatDate(habit.createdAt)}
                </span>
                <span className={`px-4 py-2 rounded-xl text-sm font-medium ${
                  isCompletedToday() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isCompletedToday() ? '✓ Completed Today' : '✗ Not Completed Today'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={24} className="text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{habit.streakCount}</div>
              <div className="text-sm font-medium text-orange-700">Current Streak</div>
            </div>
            
            <div className="bg-purple-50 border border-purple-100 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{habit.longestStreak}</div>
              <div className="text-sm font-medium text-purple-700">Longest Streak</div>
            </div>
            
            <div className="bg-green-50 border border-green-100 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={24} className="text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {habit.completionRate ? habit.completionRate.toFixed(1) : '0.0'}%
              </div>
              <div className="text-sm font-medium text-green-700">Success Rate</div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{habit.completions?.length || 0}</div>
              <div className="text-sm font-medium text-blue-700">Total Completions</div>
            </div>
          </div>

          {loading ? (
            <div className="bg-gray-50 rounded-2xl p-12 text-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-medium">Loading detailed statistics...</p>
            </div>
          ) : stats && (
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h3 className="font-bold text-gray-900 flex items-center gap-3 text-lg">
                  <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-slate-600" />
                  </div>
                  Period Analysis
                </h3>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-white font-medium"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stats.period.completions}</div>
                  <div className="text-sm font-medium text-gray-600">Completions in {selectedPeriod} days</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stats.period.completionRate}</div>
                  <div className="text-sm font-medium text-gray-600">Period Success Rate</div>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stats.period.longestStreak}</div>
                  <div className="text-sm font-medium text-gray-600">Longest Streak in Period</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700">Last Completed</span>
                  <span className="text-gray-900 font-semibold">{formatDate(stats.lastCompleted)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-700">Overall Success Rate</span>
                  <span className="text-gray-900 font-semibold">{stats.overallCompletionRate}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 p-8 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex-shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer px-8 py-3 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HabitDetailsModal;
