import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StickyNotes = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('sticky_notes');
    return saved ? JSON.parse(saved) : [{ id: 1, text: 'Brainstorm project ideas!', color: 'bg-yellow-200 text-yellow-900' }];
  });
  const [newNote, setNewNote] = useState('');

  const colors = [
    'bg-yellow-200 text-yellow-900',
    'bg-pink-200 text-pink-900',
    'bg-blue-200 text-blue-900',
    'bg-green-200 text-green-900',
    'bg-purple-200 text-purple-900'
  ];

  useEffect(() => {
    localStorage.setItem('sticky_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const color = colors[Math.floor(Math.random() * colors.length)];
    setNotes([...notes, { id: Date.now(), text: newNote, color }]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6 rounded-2xl h-full flex flex-col"
    >
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Quick Notes</h3>
      
      <form onSubmit={addNote} className="flex gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Add a sticky note..." 
          className="flex-1 glass-input rounded-lg px-3 py-2 text-sm outline-none text-gray-800 dark:text-gray-100 placeholder-gray-500"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {notes.map(note => (
            <motion.div 
              key={note.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`${note.color} p-3 rounded-lg shadow-sm relative group`}
            >
              <p className="text-sm pr-6 break-words">{note.text}</p>
              <button 
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-black/10"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {notes.length === 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">No notes yet.</p>
        )}
      </div>
    </motion.div>
  );
};

export default StickyNotes;
