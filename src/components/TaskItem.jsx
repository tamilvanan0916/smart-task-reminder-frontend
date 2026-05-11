import React from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const TaskItem = ({ task, onDelete, onEdit }) => {
  const cn = (...inputs) => twMerge(clsx(inputs));

  const priorityColors = {
    Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    Medium: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    High: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  const statusColors = {
    Todo: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    Done: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="p-4 sm:p-6 hover:bg-white/40 dark:hover:bg-gray-800/40 transition-all group flex flex-col sm:flex-row gap-4 justify-between items-start border-l-4 border-transparent hover:border-indigo-500"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <h4 className={cn("text-lg font-semibold text-gray-900 dark:text-white truncate", task.status === 'Done' && "line-through text-gray-500")}>
            {task.title}
          </h4>
          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", priorityColors[task.priority])}>
            {task.priority}
          </span>
          <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", statusColors[task.status])}>
            {task.status}
          </span>
        </div>
        
        {task.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1 mt-3 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-auto">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          aria-label="Edit task"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default TaskItem;
