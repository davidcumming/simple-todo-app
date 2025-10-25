
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { formatDateDisplay } from '../utils/dateUtils';
import { TodoCreate, User } from '../types';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SparklesIcon } from './Icons';
// FIX: Import AISuggestion type and use real AI service.
import { suggestNextAction, AISuggestion } from '../services/aiService';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAddTodo: (todo: Omit<TodoCreate, 'date'>) => void;
  onSetToday: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  currentDate,
  onAddTodo,
  onSetToday,
  onPrevDay,
  onNextDay,
}) => {
  const [title, setTitle] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  // FIX: Add state to store and display the AI suggestion.
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      // FIX: Pass the suggested next action when creating a new todo.
      onAddTodo({ title: title.trim(), nextAction: suggestion?.suggestion });
      setTitle('');
      setSuggestion(null);
    }
  };
  
  const handleSuggest = async () => {
    if(!title.trim()) return;
    setIsSuggesting(true);
    setSuggestion(null); // Clear previous suggestion
    try {
      // FIX: Call the real AI service and store the suggestion in state.
      const aiSuggestion = await suggestNextAction(title);
      setSuggestion(aiSuggestion);
    } catch(err) {
      console.error('AI suggestion failed', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Daily Focus
        </h1>
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={onPrevDay}
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              aria-label="Previous day"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onSetToday}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
            >
              Today
            </button>
            <button
              onClick={onNextDay}
              className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              aria-label="Next day"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-2">
              <img src={user.picture} alt={user.name} className="w-9 h-9 rounded-full" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-20">
                <div className="p-2">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-gray-700 rounded-md"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2 text-indigo-300">
           <CalendarIcon className="w-6 h-6" />
           <h2 className="text-xl font-semibold">{formatDateDisplay(currentDate)}</h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-4 flex items-center space-x-2">
          <div className="relative flex-grow">
            <PlusIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="new-todo-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-gray-700 border border-gray-600 rounded-md pl-10 pr-20 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
             <button
              type="button"
              onClick={handleSuggest}
              disabled={isSuggesting || !title.trim()}
              className="absolute right-10 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-600 text-indigo-300 hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label="Suggest next action with AI"
            >
              <SparklesIcon className={`w-4 h-4 ${isSuggesting ? 'animate-pulse' : ''}`} />
            </button>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 disabled:opacity-50"
            disabled={!title.trim()}
          >
            Add
          </button>
        </form>
        {/* FIX: Display the AI suggestion to the user */}
        {suggestion && (
          <div className="mt-3 p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-sm">
            <p className="font-semibold text-indigo-300 flex items-center">
              <SparklesIcon className="w-4 h-4 inline-block mr-2" />
              <span>AI Suggestion</span>
            </p>
            <p className="mt-2 text-gray-200"><strong className="font-medium text-gray-300">Next Action:</strong> {suggestion.suggestion}</p>
            <p className="mt-1 text-gray-400"><em>{suggestion.rationale}</em></p>
          </div>
        )}
      </div>
    </header>
  );
};
