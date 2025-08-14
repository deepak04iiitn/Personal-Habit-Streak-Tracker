import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HabitForm from '../components/HabitForm';
import { Plus, ArrowLeft, Lightbulb, TrendingUp, Clock } from 'lucide-react';

const CreateHabit = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await axios.post('/backend/habits/create-new-habit', formData, { withCredentials: true });
      navigate('/habits');
    } catch (err) {
      console.error('Failed to create habit');
    }
  };

  const handleBack = () => {
    navigate('/habits');
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleBack}
            className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">New Habit</h1>
            <p className="text-gray-600 text-sm">Build something great</p>
          </div>
          
          <div className="w-20"></div> 
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-3">
            <HabitForm onSubmit={handleSubmit} />
          </div>

          <div className="lg:col-span-1 space-y-4">
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span>Quick Stats</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium text-green-600">87%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Daily Habits</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-medium text-orange-600">5 days</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span>Pro Tips</span>
              </h3>
              <div className="space-y-3 text-xs text-gray-600">
                <p>• Start with 2-minute habits</p>
                <p>• Stack habits together</p>
                <p>• Use environment design</p>
                <p>• Track immediately after</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>Best Times</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Morning</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">High Energy</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Evening</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">Reflect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHabit;
