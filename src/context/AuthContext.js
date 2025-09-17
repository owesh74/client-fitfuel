import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/user');
          setUser(data);
        } catch (error) {
          console.error('Failed to fetch user', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    const userRes = await api.get('/auth/user');
    setUser(userRes.data);
    navigate('/outlets');
  };
  
  // --- NEW FUNCTION ADDED HERE ---
  const verifyAndLogin = async (email, otp) => {
    // 1. Get token from the verify-otp endpoint
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('token', data.token);

    // 2. Immediately use the new token to get user data
    const userRes = await api.get('/auth/user');

    // 3. Set the user state with the data
    setUser(userRes.data);

    // 4. NOW, navigate to the next page
    navigate('/outlets');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    // Make sure to provide the new function in the value
    <AuthContext.Provider value={{ user, login, verifyAndLogin, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};