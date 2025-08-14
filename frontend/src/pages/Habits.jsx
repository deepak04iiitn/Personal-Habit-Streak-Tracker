// Habits.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Plus, X, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import HabitDetailsModal from '../components/HabitDetailsModal';
import EditHabitModal from '../components/EditHabitModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const CATEGORIES = [
  'EXERCISE', 'DIET', 'HYDRATION', 'SLEEP', 'MINDFULNESS',
  'SKILL_DEVELOPMENT', 'READING', 'LEARNING', 'WAKE_UP_ON_TIME',
  'PLANNING', 'FOCUSED_WORK', 'CHORES', 'FINANCES', 'SOCIAL',
  'NO_SMOKING', 'NO_JUNK_FOOD', 'LIMITED_SCREEN_TIME'
];

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Created Date' },
  { value: 'updatedAt', label: 'Updated Date' },
  { value: 'title', label: 'Title' },
  { value: 'category', label: 'Category' },
  { value: 'streakCount', label: 'Current Streak' },
  { value: 'longestStreak', label: 'Longest Streak' }
];

const PAGE_SIZE_OPTIONS = [4, 8, 12, 16, 20];

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [filters, setFilters] = useState({
    page: 1,
    limit: 8,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    search: '',
    category: '',
    isDaily: '',
  });

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, value);
        }
      });

      const response = await fetch(`/backend/habits/my-habits?${params.toString()}`, {
        credentials: 'include'
      });

      if(!response.ok) {
        throw new Error('Failed to fetch habits');
      }

      const data = await response.json();
      setHabits(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load habits');
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if(filters.search !== '') {
        fetchHabits();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: filters.limit,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      search: '',
      category: '',
      isDaily: '',
    });
  };

  const toggleSortOrder = () => {
    handleFilterChange('sortOrder', filters.sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleView = (habit) => {
    setSelectedHabit(habit);
    setShowDetailsModal(true);
  };

  const handleEdit = (habit) => {
    setSelectedHabit(habit);
    setShowEditModal(true);
  };

  const handleDelete = (habit) => {
    setSelectedHabit(habit);
    setShowDeleteModal(true);
  };

  const handleMarkComplete = async (habit) => {
    try {
      const response = await fetch(`/backend/habits/${habit._id}/mark-complete`, {
        method: 'POST',
        credentials: 'include'
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark habit as complete');
      }

      await fetchHabits();
      console.log('Habit marked as complete successfully');
    } catch (error) {
      setError(error.message || 'Failed to mark habit as complete');
      console.error('Error marking habit complete:', error);
    }
  };

  const handleEditSave = async (updatedData) => {
    try {
      const response = await fetch(`/backend/habits/${selectedHabit._id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update habit');
      }

      await fetchHabits();
      setShowEditModal(false);
      setSelectedHabit(null);
      console.log('Habit updated successfully');
    } catch (error) {
      setError(error.message || 'Failed to update habit');
      console.error('Error updating habit:', error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true);
      
      const response = await fetch(`/backend/habits/${selectedHabit._id}/remove`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if(!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete habit');
      }

      await fetchHabits();
      setShowDeleteModal(false);
      setSelectedHabit(null);
      console.log('Habit deleted successfully');
    } catch (error) {
      setError(error.message || 'Failed to delete habit');
      console.error('Error deleting habit:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const closeModals = () => {
    setShowDetailsModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedHabit(null);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if(filters.search) count++;
    if(filters.category) count++;
    if(filters.isDaily !== '') count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <Sparkles className="h-7 w-7 text-slate-600" />
              <h1 className="text-4xl font-bold text-gray-900">My Habits</h1>
            </div>
            <p className="text-gray-600 text-lg">
              {pagination.totalHabits || 0} habit{pagination.totalHabits !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <a 
            href="/habits/create"
            className="flex items-center space-x-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            <span>Create New Habit</span>
          </a>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-10">
          <div className="flex flex-col lg:flex-row gap-6">
            
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                placeholder="Search habits by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all text-gray-900 placeholder-gray-500 bg-gray-50 hover:bg-white"
              />
              {filters.search && (
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="cursor-pointer flex items-center gap-3 px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
            >
              <Filter size={20} />
              <span>Filters</span>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-slate-600 text-white text-xs rounded-full px-3 py-1 font-bold">
                  {getActiveFiltersCount()}
                </span>
              )}
            </button>

            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`cursor-pointer p-4 transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`cursor-pointer p-4 transition-all ${
                  viewMode === 'list' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-gray-50 hover:bg-white"
                  >
                    <option value="">All Categories</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
                  <select
                    value={filters.isDaily}
                    onChange={(e) => handleFilterChange('isDaily', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-gray-50 hover:bg-white"
                  >
                    <option value="">All Types</option>
                    <option value="true">Daily Habits</option>
                    <option value="false">Custom Habits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-gray-50 hover:bg-white"
                  >
                    {SORT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Per Page</label>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all bg-gray-50 hover:bg-white"
                  >
                    {PAGE_SIZE_OPTIONS.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={toggleSortOrder}
                  className="cursor-pointer flex items-center gap-3 px-5 py-3 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold"
                >
                  {filters.sortOrder === 'desc' ? <SortDesc size={18} /> : <SortAsc size={18} />}
                  {filters.sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
                </button>

                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="cursor-pointer px-5 py-3 text-sm text-red-600 border border-red-300 rounded-xl hover:bg-red-50 hover:border-red-400 transition-all font-semibold"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 font-medium">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-slate-600 mx-auto"></div>
              <p className="text-gray-600 font-medium">Loading your habits...</p>
            </div>
          </div>
        )}

        {!loading && habits.length > 0 && (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12"
            : "space-y-6 mb-12"
          }>
            {habits.map(habit => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkComplete={handleMarkComplete}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}

        {!loading && habits.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 text-center py-20 px-8">
            <div className="text-8xl mb-6">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No habits found</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              {getActiveFiltersCount() > 0 
                ? "Try adjusting your filters to see more results"
                : "Start building better habits by creating your first one!"
              }
            </p>
            <a 
              href="/habits/create"
              className="inline-flex items-center space-x-2 bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} />
              <span>Create Your First Habit</span>
            </a>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-gray-700 font-medium">
                Showing {((pagination.currentPage - 1) * pagination.habitsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.habitsPerPage, pagination.totalHabits)} of{' '}
                {pagination.totalHabits} habits
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="cursor-pointer flex items-center gap-2 px-4 py-3 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`cursor-pointer px-4 py-3 text-sm rounded-xl transition-all font-semibold ${
                          pageNum === pagination.currentPage
                            ? 'bg-slate-900 text-white shadow-lg'
                            : 'border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="cursor-pointer flex items-center gap-2 px-4 py-3 text-sm border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        <HabitDetailsModal
          habit={selectedHabit}
          isOpen={showDetailsModal}
          onClose={closeModals}
        />

        <EditHabitModal
          habit={selectedHabit}
          isOpen={showEditModal}
          onClose={closeModals}
          onSave={handleEditSave}
        />

        <DeleteConfirmationModal
          habit={selectedHabit}
          isOpen={showDeleteModal}
          onClose={closeModals}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default Habits;
