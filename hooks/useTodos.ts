
import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoCreate, TodoUpdate } from '../types';
import * as todoService from '../services/todoService';

export const useTodos = (date: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (isoDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTodos = await todoService.getTodos(isoDate);
      setTodos(fetchedTodos);
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos(date);
  }, [date, fetchTodos]);

  const addTodo = useCallback(async (newTodoData: TodoCreate) => {
    try {
      const newTodo = await todoService.createTodo(newTodoData);
      // Only add to the list if its date matches the currently viewed date
      if (newTodo.date === date) {
        setTodos(prev => [...prev, newTodo].sort((a,b) => a.sortIndex - b.sortIndex));
      }
    } catch (err) {
      setError('Failed to add task.');
      console.error(err);
    }
  }, [date]);

  const updateTodo = useCallback(async (id: string, data: TodoUpdate) => {
    const originalTodos = todos;
    
    // Optimistic update
    setTodos(prev => {
      // If redating, remove it from the current view
      if (data.date && data.date !== date) {
        return prev.filter(t => t.id !== id);
      }
      // Otherwise, update in place
      return prev.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t)
    });

    try {
      await todoService.updateTodo(id, data);
      // If the update was a redate to a different day, we don't need to do anything else,
      // as the optimistic update already removed it.
      // If it was another update, the UI is already correct.
    } catch (err) {
      setError('Failed to update task. Reverting changes.');
      console.error(err);
      // Revert on error
      setTodos(originalTodos);
    }
  }, [todos, date]);


  const deleteTodo = useCallback(async (id: string) => {
    const originalTodos = todos;
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await todoService.deleteTodo(id);
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
      setTodos(originalTodos);
    }
  }, [todos]);

  return { todos, loading, error, addTodo, updateTodo, deleteTodo };
};
