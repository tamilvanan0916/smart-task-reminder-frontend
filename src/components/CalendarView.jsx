import React, { useState } from 'react';
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];
  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      // Check tasks for this day
      const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), cloneDay));
      
      days.push(
        <div
          className={`p-2 border border-gray-100 dark:border-gray-700/50 min-h-[80px] transition-colors relative ${
            !isSameMonth(day, monthStart)
              ? "text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-gray-800/30"
              : isSameDay(day, new Date()) ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
          }`}
          key={day}
        >
          <span className="text-sm block text-right">{formattedDate}</span>
          <div className="mt-1 space-y-1">
            {dayTasks.map(t => (
              <div key={t._id} className="text-[10px] truncate bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-1 py-0.5 rounded" title={t.title}>
                {t.title}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className="grid grid-cols-7" key={day}>
        {days}
      </div>
    );
    days = [];
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-panel p-6 rounded-2xl w-full"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Calendar</h3>
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronLeft className="h-5 w-5 dark:text-white" /></button>
          <span className="font-medium text-gray-700 dark:text-gray-200 min-w-[120px] text-center">{format(currentDate, "MMMM yyyy")}</span>
          <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"><ChevronRight className="h-5 w-5 dark:text-white" /></button>
        </div>
      </div>
      
      <div className="rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
        <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-700/50">
          {weekdays.map(day => (
            <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/50">
              {day}
            </div>
          ))}
        </div>
        <div>
          {rows}
        </div>
      </div>
    </motion.div>
  );
};

export default CalendarView;
