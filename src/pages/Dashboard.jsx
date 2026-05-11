import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import PomodoroTimer from '../components/PomodoroTimer';
import StickyNotes from '../components/StickyNotes';
import CalendarView from '../components/CalendarView';
import AiStudyTips from '../components/AiStudyTips';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PlusCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const { user } = useAuth();

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let url = `/api/tasks?`;
      if (search) url += `search=${search}&`;
      if (filterStatus) url += `status=${filterStatus}&`;
      if (filterPriority) url += `priority=${filterPriority}`;
      
      const { data } = await axios.get(url, config);
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  const fetchStats = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/tasks/stats', config);
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [search, filterStatus, filterPriority, user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/tasks/${id}`, config);
        fetchTasks();
        fetchStats();
      } catch (error) {
        console.error('Error deleting task', error);
      }
    }
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const statusData = stats ? [
    { name: 'Todo', value: stats.status.todo },
    { name: 'In Progress', value: stats.status.inProgress },
    { name: 'Done', value: stats.status.done },
  ] : [];

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 drop-shadow-sm"
        >
          My Study Hub
        </motion.h1>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-full shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/50 transition-all font-medium"
        >
          <PlusCircle className="h-5 w-5" />
          Add Task
        </motion.button>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tasks & Calendar (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Stats Section */}
          {stats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: 'Total Tasks', value: stats.total, color: 'text-indigo-600 dark:text-indigo-400' },
                { label: 'Todo', value: stats.status.todo, color: 'text-red-500' },
                { label: 'In Progress', value: stats.status.inProgress, color: 'text-yellow-500' },
                { label: 'Done', value: stats.status.done, color: 'text-green-500' }
              ].map((stat, idx) => (
                <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col justify-center items-center">
                  <h3 className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</h3>
                  <p className={`text-3xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Filters & Search */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your tasks..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input outline-none dark:text-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="rounded-xl px-4 py-2.5 glass-input outline-none dark:text-white min-w-[140px]"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <select
              className="rounded-xl px-4 py-2.5 glass-input outline-none dark:text-white min-w-[140px]"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </motion.div>

          {/* Task List */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-panel rounded-2xl overflow-hidden shadow-sm min-h-[300px]"
          >
            {tasks.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                <img src="/vite.svg" alt="Empty" className="h-16 w-16 mb-4 opacity-50 grayscale" />
                <p className="text-lg">No tasks found. Create one to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {tasks.map(task => (
                  <TaskItem 
                    key={task._id} 
                    task={task} 
                    onDelete={handleDelete} 
                    onEdit={openEditForm} 
                  />
                ))}
              </div>
            )}
          </motion.div>

          {/* Calendar View */}
          <CalendarView tasks={tasks} />
        </div>

        {/* Right Column: Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <PomodoroTimer />
          
          <div className="h-64">
            <StickyNotes />
          </div>

          <AiStudyTips />

          {/* Charts Sidebar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-2xl"
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Task Completion</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-sm mt-2">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div> Todo</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div> In Progress</div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div> Done</div>
            </div>
          </motion.div>
        </div>
      </div>

      {isFormOpen && (
        <TaskForm 
          onClose={closeForm} 
          onSuccess={() => { closeForm(); fetchTasks(); fetchStats(); }} 
          taskToEdit={editingTask} 
        />
      )}
    </div>
  );
};

export default Dashboard;
