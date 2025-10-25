
import React, { useState, useCallback } from 'react';
import { formatDateDisplay } from '../utils/dateUtils';
import { TodoCreate } from '../types';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, SparklesIcon } from './Icons';
import { suggestNextAction } from '../services/aiService';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAddTodo: (todo: Omit<TodoCreate, 'date'>) => void;
  onSetToday: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onAddTodo,
  onSetToday,
  onPrevDay,
  onNextDay,
}) => {
  const [title, setTitle] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTodo({ title: title.trim() });
      setTitle('');
    }
  };
  
  const handleSuggest = async () => {
    if(!title.trim()) return;
    setIsSuggesting(true);
    try {
      const suggestion = await suggestNextAction(title);
      // For simplicity, we just log it. A real app might show it in the UI.
      console.log('AI Suggestion:', suggestion);
    } catch(err) {
      console.error('AI suggestion failed', err);
    } finally {
      setIsSuggesting(false);
    }
  };

  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Daily Focus
        </h1>
        <div className="flex items-center space-x-2">
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
      </div>
    </header>
  );
};
