import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Menu, X } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 text-white shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center space-x-3 hover:opacity-90 transition-all duration-300 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
            Habit Tracker
          </span>
        </Link>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="p-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200 border border-slate-600/30"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation menu */}
        <ul className={`md:flex items-center space-y-3 md:space-y-0 md:space-x-6 ${
          isMenuOpen ? 'block' : 'hidden'
        } absolute md:relative bg-slate-900/98 md:bg-transparent backdrop-blur-md md:backdrop-blur-none w-full md:w-auto left-0 top-full md:top-0 p-6 md:p-0 border-b md:border-b-0 border-slate-700/50 shadow-xl md:shadow-none`}>
          {user ? (
            <>
              <li>
                <Link 
                  to="/dashboard" 
                  className="block md:inline-block px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 font-medium" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link 
                  to="/habits" 
                  className="block md:inline-block px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 font-medium" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Habits
                </Link>
              </li>
              <li>
                <Link 
                  to="/habits/create" 
                  className="block md:inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Habit
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout} 
                  className="block md:inline-block w-full md:w-auto px-4 py-2 text-gray-300 hover:text-red-400 text-sm font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className="block md:inline-block px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200 font-medium" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className="block md:inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/25" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
