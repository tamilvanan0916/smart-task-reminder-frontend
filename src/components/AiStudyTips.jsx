import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const tips = [
  "Use active recall to test your memory rather than simply re-reading your notes.",
  "Spaced repetition helps you retain information long-term. Review material at increasing intervals.",
  "The Feynman Technique: Try explaining a concept simply, as if you were teaching it to a beginner.",
  "Break your study sessions into chunks using the Pomodoro technique to maintain focus and prevent burnout.",
  "Change your study environment occasionally. It forces your brain to retrieve info without context clues.",
  "Sleep is when your brain consolidates memory. Never sacrifice sleep for a late-night cram session.",
  "Interleave your practice. Mix different subjects or types of problems to improve problem-solving skills.",
  "Dual coding: combine verbal materials with visuals (like charts or diagrams) to enhance learning.",
  "Eliminate digital distractions. Keep your phone in another room while studying.",
  "Stay hydrated and eat brain-boosting foods like nuts, berries, and dark chocolate."
];

const AiStudyTips = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setTipIndex(Math.floor(Math.random() * tips.length));
  }, []);

  const getNewTip = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let newIdx;
      do {
        newIdx = Math.floor(Math.random() * tips.length);
      } while (newIdx === tipIndex);
      setTipIndex(newIdx);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">AI Study Coach</h3>
        </div>
        <button 
          onClick={getNewTip}
          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-full hover:bg-white/20"
        >
          <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
      <motion.p 
        key={tipIndex}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gray-700 dark:text-gray-300 italic text-sm leading-relaxed min-h-[80px]"
      >
        "{tips[tipIndex]}"
      </motion.p>
    </motion.div>
  );
};

export default AiStudyTips;
