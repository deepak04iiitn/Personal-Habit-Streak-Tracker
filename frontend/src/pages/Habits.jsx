import React, { useEffect, useState, useCallback } from 'react';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

      if(!response.ok) 
      {
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
      if(filters.search !== '') 
      {
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

      if(!response.ok) 
      {
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

      if(!response.ok) 
      {
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
    <div className="max-w-7xl mx-auto p-6">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="text-gray-600 mt-1">
            {pagination.totalHabits || 0} habits found
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search habits by title or description..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {filters.search && (
              <button
                onClick={() => handleFilterChange('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            Filters
            {getActiveFiltersCount() > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {getActiveFiltersCount()}
              </span>
            )}
          </button>

          
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 cursor-pointer ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 cursor-pointer ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.isDaily}
                  onChange={(e) => handleFilterChange('isDaily', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="true">Daily Habits</option>
                  <option value="false">Custom Habits</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Per Page</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {filters.sortOrder === 'desc' ? <SortDesc size={16} /> : <SortAsc size={16} />}
                {filters.sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
              </button>

              {getActiveFiltersCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && habits.length > 0 && (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
          : "space-y-4 mb-6"
        }>
          {habits.map(habit => (
            <HabitCard
              key={habit._id}
              habit={habit}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {!loading && habits.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No habits found</h3>
          <p className="text-gray-600 mb-6">
            {getActiveFiltersCount() > 0 
              ? "Try adjusting your filters to see more results"
              : "Start building better habits by creating your first one!"
            }
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Create Your First Habit
          </button>
        </div>
      )}

      
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white border rounded-lg p-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Showing {((pagination.currentPage - 1) * pagination.habitsPerPage) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.habitsPerPage, pagination.totalHabits)} of{' '}
              {pagination.totalHabits} habits
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      pageNum === pagination.currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
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
              className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight size={16} />
            </button>
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
  );
};

export default Habits;