import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work'); // work, break

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Auto-switch mode on complete
      if (mode === 'work') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
      alert(`Time's up! Starting ${mode === 'work' ? 'Break' : 'Work'} session.`);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Calculate percentage for circular progress
  const totalTime = mode === 'work' ? 25 * 60 : 5 * 60;
  const percentage = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white z-10">Pomodoro</h3>
      
      <div className="flex gap-2 mb-6 z-10">
        <button 
          onClick={() => switchMode('work')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === 'work' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          Work
        </button>
        <button 
          onClick={() => switchMode('break')}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${mode === 'break' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
        >
          Break
        </button>
      </div>

      <div className="relative w-40 h-40 flex items-center justify-center mb-6 z-10">
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle cx="80" cy="80" r="70" fill="transparent" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth="8" />
          <circle cx="80" cy="80" r="70" fill="transparent" stroke={mode === 'work' ? '#4f46e5' : '#22c55e'} strokeWidth="8" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * percentage) / 100} className="transition-all duration-1000 ease-linear" />
        </svg>
        <div className="text-4xl font-mono font-bold text-gray-900 dark:text-white">
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="flex gap-4 z-10">
        <button 
          onClick={toggleTimer}
          className="p-3 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-400 dark:hover:bg-indigo-800/60 transition-colors"
        >
          {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
        </button>
        <button 
          onClick={resetTimer}
          className="p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
      </div>
    </motion.div>
  );
};

export default PomodoroTimer;
