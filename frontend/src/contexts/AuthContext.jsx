import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/backend/auth/me', { withCredentials: true });
        setUser(res.data.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(
      '/backend/auth/signin',
      { email, password },
      { withCredentials: true }
    );
    setUser(res.data);
    return res;
  };

  const register = async (username, email, password) => {
    const res = await axios.post(
      '/backend/auth/signup',
      { username, email, password },
      { withCredentials: true }
    );
    setUser(res.data);
    return res;
  };

  const logout = async () => {
    await axios.post('/backend/auth/logout', {}, { withCredentials: true });
    setUser(null);
  };

  const deleteAccount = async () => {
    await axios.delete('/backend/auth/delete-profile', { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
