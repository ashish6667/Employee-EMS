import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        } catch (err) {
          console.error('Failed to verify token (backend might be offline):', err.message);
          // Don't log out user immediately if it's just a temporary network refusal
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;
      
      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(jwtToken);
      setUser(userData);
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 
        (error.code === 'ERR_NETWORK' || !error.response
          ? 'Cannot connect to backend API server. Please ensure ASP.NET Core API is running on http://localhost:5000'
          : 'Login failed. Please check your credentials.');
      return { success: false, message };
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const response = await api.post('/auth/register', { fullName, email, password });
      const { token: jwtToken, user: userData } = response.data;

      if (jwtToken && userData) {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(jwtToken);
        setUser(userData);
      }
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const message = error.response?.data?.message || 
        (error.code === 'ERR_NETWORK' || !error.response
          ? 'Cannot connect to backend API server. Please ensure ASP.NET Core API is running on http://localhost:5000'
          : 'Signup failed. Please try again.');
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
