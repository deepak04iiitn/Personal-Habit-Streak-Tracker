import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import HabitDetails from './pages/HabitDetails';
import CreateHabit from './pages/CreateHabit';
import EditHabit from './pages/EditHabit';

const PrivateRoute = ({ children }) => {

  const { user, loading } = useAuth();

  if(loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;

};

function App() {
  return (
    <AuthProvider>

      <Router>

        <div className="flex flex-col min-h-screen">

          <Header />

          <main className="flex-grow container mx-auto px-4 py-8">

            <Routes>
              
              <Route path="/login" element={<Login />} />

              <Route path="/register" element={<Register />} />

              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Navigate to="/dashboard" />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/habits"
                element={
                  <PrivateRoute>
                    <Habits />
                  </PrivateRoute>
                }
              />

              <Route
                path="/habits/create"
                element={
                  <PrivateRoute>
                    <CreateHabit />
                  </PrivateRoute>
                }
              />

              <Route
                path="/habits/:id"
                element={
                  <PrivateRoute>
                    <HabitDetails />
                  </PrivateRoute>
                }
              />

              <Route
                path="/habits/:id/edit"
                element={
                  <PrivateRoute>
                    <EditHabit />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<Navigate to="/login" />} />

            </Routes>
            
          </main>

          <Footer />

        </div>

      </Router>

    </AuthProvider>
  );
}

export default App;