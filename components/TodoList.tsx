
import React, { useState, useMemo } from 'react';
import { Todo, TodoStatus, TodoUpdate } from '../types';
import { TodoItem } from './TodoItem';
import { StatusFilter } from './StatusFilter';
import { formatDateDisplay } from '../utils/dateUtils';
import { ListChecksIcon } from './Icons';

interface TodoListProps {
  todos: Todo[];
  isLoading: boolean;
  onUpdateTodo: (id: string, data: TodoUpdate) => void;
  onDeleteTodo: (id: string) => void;
  currentDate: Date;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, isLoading, onUpdateTodo, onDeleteTodo, currentDate }) => {
  const [filter, setFilter] = useState<TodoStatus | 'all'>('all');

  const filteredTodos = useMemo(() => {
    if (filter === 'all') {
      return todos;
    }
    return todos.filter(todo => todo.status === filter);
  }, [todos, filter]);

  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto"></div>
        <p className="mt-4 text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-white mb-2 sm:mb-0">Tasks</h3>
        <StatusFilter selectedFilter={filter} onFilterChange={setFilter} />
      </div>
      
      {todos.length === 0 ? (
        <div className="text-center py-12 px-6 border-2 border-dashed border-gray-700 rounded-lg">
          <ListChecksIcon className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-white">No tasks for {formatDateDisplay(currentDate)}</h3>
          <p className="mt-1 text-sm text-gray-400">Add a task above to get started!</p>
        </div>
      ) : filteredTodos.length === 0 ? (
         <div className="text-center py-12 px-6 border-2 border-dashed border-gray-700 rounded-lg">
          <ListChecksIcon className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-white">No tasks match your filter</h3>
          <p className="mt-1 text-sm text-gray-400">Try selecting a different status filter.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onUpdateTodo={onUpdateTodo}
              onDeleteTodo={onDeleteTodo}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
