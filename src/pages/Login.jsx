import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Welcome Back
        </h2>
        {error && <div className="bg-red-100/80 text-red-700 p-3 rounded-xl mb-6 text-center text-sm font-medium border border-red-200">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 rounded-xl glass-input outline-none text-gray-800 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 rounded-xl glass-input outline-none text-gray-800 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg shadow-indigo-500/30 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        >
          Sign In
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Don't have an account? <Link to="/register" className="font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">Register here</Link>
      </p>
      </motion.div>
    </div>
  );
};

export default Login;
