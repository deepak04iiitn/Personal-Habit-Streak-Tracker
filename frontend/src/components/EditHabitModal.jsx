import React, { useState } from 'react';
import { X, Save, Type, FileText, Tag, Calendar, Check, AlertCircle, Edit } from 'lucide-react';

const EditHabitModal = ({ habit, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: habit?.title || '',
    description: habit?.description || '',
    category: habit?.category || '',
    isDaily: habit?.isDaily !== undefined ? habit.isDaily : true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    if(habit) 
    {
      setFormData({
        title: habit.title || '',
        description: habit.description || '',
        category: habit.category || '',
        isDaily: habit.isDaily !== undefined ? habit.isDaily : true,
      });
      setErrors({});
    }
  }, [habit]);

  const categories = [
    { value: 'EXERCISE', label: 'Exercise', icon: '🏃' },
    { value: 'DIET', label: 'Nutrition', icon: '🥗' },
    { value: 'HYDRATION', label: 'Hydration', icon: '💧' },
    { value: 'SLEEP', label: 'Sleep', icon: '😴' },
    { value: 'MINDFULNESS', label: 'Mindfulness', icon: '🧘' },
    { value: 'SKILL_DEVELOPMENT', label: 'Skills', icon: '📚' },
    { value: 'READING', label: 'Reading', icon: '📖' },
    { value: 'LEARNING', label: 'Learning', icon: '🎓' },
    { value: 'WAKE_UP_ON_TIME', label: 'Wake Up', icon: '⏰' },
    { value: 'PLANNING', label: 'Planning', icon: '📋' },
    { value: 'FOCUSED_WORK', label: 'Focus', icon: '🎯' },
    { value: 'CHORES', label: 'Chores', icon: '🧹' },
    { value: 'FINANCES', label: 'Finances', icon: '💰' },
    { value: 'SOCIAL', label: 'Social', icon: '👥' },
    { value: 'NO_SMOKING', label: 'No Smoking', icon: '🚫' },
    { value: 'NO_JUNK_FOOD', label: 'Healthy Eating', icon: '🍎' },
    { value: 'LIMITED_SCREEN_TIME', label: 'Screen Time', icon: '📱' },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    if(errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if(!formData.title.trim()) 
    {
      newErrors.title = 'Title is required';
    } 
    else if(formData.title.length > 100) 
    {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if(!formData.category) 
    {
      newErrors.category = 'Please select a category';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if(Object.keys(newErrors).length > 0) 
    {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[90vh] overflow-hidden shadow-2xl border border-gray-100 flex flex-col">
        
        <div className="flex items-start justify-between p-8 border-b border-gray-100 flex-shrink-0">
          <div className="space-y-3 flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                <Edit className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Edit Habit</h2>
                <p className="text-gray-600 mt-1 text-lg">Update your habit details</p>
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
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Type className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Basic Information</h3>
                  <p className="text-gray-600 text-sm">Update your habit details</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              
              <div className="group">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-3">
                  Habit Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Morning meditation, Evening walk..."
                    className={`w-full px-4 py-4 border-2 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all ${
                      errors.title ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-slate-500'
                    }`}
                  />
                  {formData.title && !errors.title && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.title}</span>
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What will you do? When? Where? Why is this important to you?"
                  className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:border-slate-500 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Tag className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Update Category</h3>
                  <p className="text-gray-600 text-sm">Choose the best fitting category</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <label
                    key={cat.value}
                    className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      formData.category === cat.value
                        ? 'border-slate-500 bg-slate-50 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
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
                    <div className="text-center space-y-2">
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <span className="text-sm font-semibold text-gray-900 block">{cat.label}</span>
                    </div>
                    {formData.category === cat.value && (
                      <div className="absolute -top-2 -right-2">
                        <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center shadow-lg">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="mt-4 text-sm text-red-600 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.category}</span>
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Frequency</h3>
                  <p className="text-gray-600 text-sm">How often will you do this?</p>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-center space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="isDaily"
                    checked={formData.isDaily}
                    onChange={handleChange}
                    className="w-5 h-5 text-slate-900 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-gray-100"
                  />
                  {formData.isDaily && (
                    <Check className="absolute top-0.5 left-0.5 h-3 w-3 text-white pointer-events-none" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-gray-900 font-semibold cursor-pointer block">
                    Daily habit
                  </label>
                  <p className="text-sm text-gray-600">
                    {formData.isDaily ? 'Perfect! Daily habits build strong momentum 🚀' : 'You can track this occasionally'}
                  </p>
                </div>
                <div className="text-3xl">
                  {formData.isDaily ? '📅' : '📝'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-8 border-t border-gray-100 bg-gray-50 rounded-b-3xl flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer px-8 py-3 text-gray-700 bg-white border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            Cancel
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="cursor-pointer flex items-center space-x-3 px-8 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:scale-100"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating habit...</span>
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                <span>Update Habit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHabitModal;
