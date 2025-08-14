import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';
import { 
  BarChart3, 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Award, 
  Trash2,
  Sparkles,
  Activity,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteAccount } = useAuth();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/backend/habits/my-summary', { withCredentials: true });
        setSummary(res.data.data);
      } catch (err) {
        setError('Failed to load summary');
      }
    };
    fetchSummary();
  }, []);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <div className="text-red-500 text-3xl mb-4">⚠️</div>
          <p className="text-red-700 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Habits',
      value: summary.totalHabits,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Streaks',
      value: summary.activeStreaks,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Longest Streak',
      value: summary.longestOverallStreak,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Completion Rate',
      value: `${summary.averageCompletionRate.toFixed(1)}%`,
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Completed Today',
      value: summary.completedToday,
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Total Completions',
      value: summary.totalCompletions,
      icon: Activity,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Sparkles className="h-6 w-6 text-gray-500" />
            <h1 className="text-3xl font-semibold text-gray-800">Your Dashboard</h1>
            <Sparkles className="h-6 w-6 text-gray-500" />
          </div>
          <p className="text-gray-600 text-base">Track your progress and celebrate your achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-lg p-5 bg-white shadow border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgColor}`}> 
                    <Icon className={`${card.color} h-6 w-6`} />
                  </div>
                  <div className="text-2xl font-semibold text-gray-900">{card.value}</div>
                </div>
                <h3 className="text-gray-700 font-medium text-lg">{card.title}</h3>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-10 border border-gray-200">
          <div className="text-center">
            <div className="w-14 h-14 bg-gray-300 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="h-7 w-7 text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-1">Keep Going!</h2>
            <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
              {summary.completedToday > 0 
                ? `Great job! You've completed ${summary.completedToday} habit${summary.completedToday > 1 ? 's' : ''} today. Every small step counts towards your bigger goals.`
                : "Today is a fresh start! Check off your first habit to build momentum for the rest of your day."
              }
            </p>
            {summary.activeStreaks > 0 && (
              <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-yellow-100 rounded-full">
                <span className="text-xl">🔥</span>
                <span className="text-yellow-800 font-semibold">
                  {summary.activeStreaks} streak{summary.activeStreaks > 1 ? 's' : ''} going strong!
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-10 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <Target className="h-5 w-5 text-gray-700" />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/habits"
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">View Habits</div>
                <div className="text-sm text-gray-600">Check your progress</div>
              </div>
            </a>
            
            <a
              href="/habits/create"
              className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">New Habit</div>
                <div className="text-sm text-gray-600">Start building</div>
              </div>
            </a>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gray-300 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">Achievement</div>
                <div className="text-sm text-gray-600">Keep it up!</div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 border border-red-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-400 rounded-lg flex items-center justify-center">
              <Trash2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-700">Danger Zone</h3>
              <p className="text-red-600 text-sm">Irreversible actions</p>
            </div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-red-700 mb-4 text-sm">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="cursor-pointer flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold rounded-lg transition duration-200 shadow-md disabled:cursor-not-allowed"
            >
              <Trash2 className="h-4 w-4" />
              <span>{isDeleting ? 'Deleting Account...' : 'Delete Account'}</span>
            </button>
          </div>
        </div>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed."
          confirmText={isDeleting ? "Deleting..." : "Yes, Delete"}
          cancelText="Cancel"
          type="danger"
        />
      </div>
    </div>
  );
};

export default Dashboard;
