import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskForm = ({ onClose, onSuccess, taskToEdit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Todo');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status);
      setPriority(taskToEdit.priority);
      if (taskToEdit.dueDate) {
        setDueDate(new Date(taskToEdit.dueDate).toISOString().split('T')[0]);
      }
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const taskData = { title, description, status, priority, dueDate };

      if (taskToEdit) {
        await axios.put(`/api/tasks/${taskToEdit._id}`, taskData, config);
      } else {
        await axios.post('/api/tasks', taskData, config);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving task', error);
      alert('Failed to save task');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-colors"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {taskToEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 rounded-xl glass-input outline-none text-gray-800 dark:text-white"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-xl glass-input outline-none resize-none h-24 text-gray-800 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                className="w-full px-4 py-2 rounded-xl glass-input outline-none text-gray-800 dark:text-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select
                className="w-full px-4 py-2 rounded-xl glass-input outline-none text-gray-800 dark:text-white"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full px-4 py-2 rounded-xl glass-input outline-none text-gray-800 dark:text-white [color-scheme:light] dark:[color-scheme:dark]"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-600 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 font-medium"
            >
              {taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskForm;
