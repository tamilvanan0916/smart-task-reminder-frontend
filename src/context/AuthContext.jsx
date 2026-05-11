import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/auth/login', { email, password }, config);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const register = async (name, email, password) => {
    const config = { headers: { 'Content-Type': 'application/json' } };
    const { data } = await axios.post('/api/auth/register', { name, email, password }, config);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
