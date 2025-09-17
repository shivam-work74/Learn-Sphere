// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios'; // 1. Import our new API client instead of axios
import { useNavigate } from 'react-router-dom';

// Create the context
const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      // 2. Use 'API' for the request
      const { data } = await API.post(
        '/api/auth/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (error) {
      throw error.response.data.message || 'An error occurred';
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
       // 2. Use 'API' for the request
      const { data } = await API.post(
        '/api/auth/register',
        { name, email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (data.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      throw error.response.data.message || 'An error occurred';
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  const updateUser = (newUserInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(newUserInfo));
    setUser(newUserInfo);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};