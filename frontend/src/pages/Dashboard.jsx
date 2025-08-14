import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from '../components/ConfirmationModal';

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

  if(error) return <p className="text-red-500">{error}</p>;
  if(!summary) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3>Total Habits</h3>
          <p className="text-xl">{summary.totalHabits}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3>Active Streaks</h3>
          <p className="text-xl">{summary.activeStreaks}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3>Longest Streak</h3>
          <p className="text-xl">{summary.longestOverallStreak}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3>Avg Completion Rate</h3>
          <p className="text-xl">{summary.averageCompletionRate.toFixed(2)}%</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3>Completed Today</h3>
          <p className="text-xl">{summary.completedToday}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3>Total Completions</h3>
          <p className="text-xl">{summary.totalCompletions}</p>
        </div>
      </div>
      
      <button 
        onClick={() => setShowDeleteModal(true)} 
        className="cursor-pointer mt-8 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2"
        disabled={isDeleting}
      >
        {isDeleting ? 'Deleting...' : 'Delete Account'}
      </button>

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
  );
};

export default Dashboard;