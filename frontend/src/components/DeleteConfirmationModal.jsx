import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

const DeleteConfirmationModal = ({ habit, isOpen, onClose, onConfirm, isDeleting }) => {
  if(!isOpen || !habit) return null;

  const formatCategory = (category) => {
    return category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete Habit</h2>
              <p className="text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="cursor-pointer p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="lg:col-span-2 space-y-4">
              <p className="text-gray-700 text-base leading-relaxed">
                Are you sure you want to delete <strong className="text-gray-900">"{habit.title}"</strong>?
              </p>
              
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                <p className="text-red-700 flex items-start space-x-3 text-sm leading-relaxed">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    Deleting this habit will permanently remove all your progress data, including streaks and completion history.
                  </span>
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="cursor-pointer px-6 py-2.5 text-gray-700 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isDeleting}
                  className="cursor-pointer flex items-center space-x-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isDeleting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Forever</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 text-sm mb-3">Habit Statistics</h4>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="font-semibold text-gray-900">{formatCategory(habit.category)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="font-semibold text-gray-900">{habit.streakCount} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Longest Streak:</span>
                    <span className="font-semibold text-gray-900">{habit.longestStreak} days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Completions:</span>
                    <span className="font-semibold text-gray-900">{habit.completions?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Success Rate:</span>
                    <span className="font-semibold text-gray-900">
                      {habit.completionRate ? habit.completionRate.toFixed(1) : '0.0'}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
