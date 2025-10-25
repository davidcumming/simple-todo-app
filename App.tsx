
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { formatDateISO, addDays } from './utils/dateUtils';
import { Todo, TodoCreate } from './types';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const isoDate = formatDateISO(currentDate);

  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
  } = useTodos(isoDate);

  const handleDateChange = useCallback((newDate: Date) => {
    setCurrentDate(newDate);
  }, []);

  const handleAddTodo = useCallback(async (newTodoData: Omit<TodoCreate, 'date'>) => {
    await addTodo({ ...newTodoData, date: isoDate });
    // Refocus on the input after adding
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header
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
