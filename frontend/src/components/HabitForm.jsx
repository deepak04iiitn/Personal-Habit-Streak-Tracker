import { useState } from 'react';
import { Type, FileText, Tag, Calendar, Check, AlertCircle } from 'lucide-react';

const HabitForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    category: initialData.category || '',
    isDaily: initialData.isDaily !== undefined ? initialData.isDaily : true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'EXERCISE', label: 'Exercise', icon: '🏃', color: 'bg-red-500' },
    { value: 'DIET', label: 'Nutrition', icon: '🥗', color: 'bg-green-500' },
    { value: 'HYDRATION', label: 'Hydration', icon: '💧', color: 'bg-blue-500' },
    { value: 'SLEEP', label: 'Sleep', icon: '😴', color: 'bg-indigo-500' },
    { value: 'MINDFULNESS', label: 'Mindfulness', icon: '🧘', color: 'bg-purple-500' },
    { value: 'SKILL_DEVELOPMENT', label: 'Skills', icon: '📚', color: 'bg-yellow-500' },
    { value: 'READING', label: 'Reading', icon: '📖', color: 'bg-orange-500' },
    { value: 'LEARNING', label: 'Learning', icon: '🎓', color: 'bg-pink-500' },
    { value: 'WAKE_UP_ON_TIME', label: 'Wake Up', icon: '⏰', color: 'bg-cyan-500' },
    { value: 'PLANNING', label: 'Planning', icon: '📋', color: 'bg-teal-500' },
    { value: 'FOCUSED_WORK', label: 'Focus', icon: '🎯', color: 'bg-emerald-500' },
    { value: 'CHORES', label: 'Chores', icon: '🧹', color: 'bg-lime-500' },
    { value: 'FINANCES', label: 'Finances', icon: '💰', color: 'bg-amber-500' },
    { value: 'SOCIAL', label: 'Social', icon: '👥', color: 'bg-rose-500' },
    { value: 'NO_SMOKING', label: 'No Smoking', icon: '🚫', color: 'bg-gray-500' },
    { value: 'NO_JUNK_FOOD', label: 'Healthy Eating', icon: '🍎', color: 'bg-green-600' },
    { value: 'LIMITED_SCREEN_TIME', label: 'Screen Time', icon: '📱', color: 'bg-slate-500' },
  ];

  const selectedCategory = categories.find(cat => cat.value === formData.category);

  return (
    <div className="space-y-6">
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Type className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Morning meditation"
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600 flex items-center space-x-1">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="What will you do? When? Where?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Tag className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Category</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map(cat => (
              <label
                key={cat.value}
                className={`relative cursor-pointer p-3 rounded-lg border-2 transition-all hover:shadow-sm ${
                  formData.category === cat.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={formData.category === cat.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{cat.label}</span>
                </div>
                {formData.category === cat.value && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                )}
              </label>
            ))}
          </div>
          {errors.category && (
            <p className="mt-3 text-xs text-red-600 flex items-center space-x-1">
              <AlertCircle className="h-3 w-3" />
              <span>{errors.category}</span>
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Frequency</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="isDaily"
                checked={formData.isDaily}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Daily habit</span>
                <p className="text-xs text-gray-600">Track this every day</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="cursor-pointer px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="cursor-pointer flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-md transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              <span>Create Habit</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HabitForm;
