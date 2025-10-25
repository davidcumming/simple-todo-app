import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Login } from './components/Login';
import { useTodos } from './hooks/useTodos';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { formatDateISO, addDays } from './utils/dateUtils';
import { Todo, TodoCreate, User } from './types';
import * as todoService from './services/todoService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('dailyFocusUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const isoDate = formatDateISO(currentDate);

  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
  } = useTodos(isoDate, user?.id);
  
  useEffect(() => {
    if (user) {
      localStorage.setItem('dailyFocusUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('dailyFocusUser');
    }
  }, [user]);

  const handleLoginSuccess = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
  }, []);

  const handleLogout = useCallback(() => {
    // @ts-ignore
    if (window.google?.accounts?.id) {
        // @ts-ignore
        window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
  }, []);

  const handleDateChange = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const handleAddTodo = useCallback(async (newTodoData: Omit<TodoCreate, 'date'>) => {
    await addTodo({ ...newTodoData, date: isoDate });
    const input = document.getElementById('new-todo-input') as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }, [addTodo, isoDate]);
  
  const handleSetToday = useCallback(() => {
    handleDateChange(new Date());
  }, [handleDateChange]);

  const handlePrevDay = useCallback(() => {
    handleDateChange(addDays(currentDate, -1));
  }, [currentDate, handleDateChange]);

  const handleNextDay = useCallback(() => {
    handleDateChange(addDays(currentDate, 1));
  }, [currentDate, handleDateChange]);

  useKeyboardShortcuts({
    't': handleSetToday,
    'ArrowLeft': handlePrevDay,
    'ArrowRight': handleNextDay,
  });

  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header
          user={user}
          onLogout={handleLogout}
          currentDate={currentDate}
          onDateChange={handleDateChange}
          onAddTodo={handleAddTodo}
          onSetToday={handleSetToday}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
        />
        <main className="mt-6">
          {error && (
            <div className="bg-red-800 border border-red-600 text-red-100 px-4 py-3 rounded-md mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
          <TodoList
            todos={todos}
            isLoading={loading}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            currentDate={currentDate}
          />
        </main>
      </div>
    </div>
  );
};

export default App;