import { useState, useEffect, useCallback } from 'react';
import { Todo, TodoCreate, TodoUpdate } from '../types';
import * as todoService from '../services/todoService';

export const useTodos = (date: string, userId?: string) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async (isoDate: string, currentUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTodos = await todoService.getTodos(isoDate, currentUserId);
      setTodos(fetchedTodos);
    } catch (err) {
      setError('Failed to fetch tasks.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchTodos(date, userId);
    } else {
      setTodos([]);
      setLoading(false);
    }
  }, [date, userId, fetchTodos]);

  const addTodo = useCallback(async (newTodoData: TodoCreate) => {
    if (!userId) return;
    try {
      const newTodo = await todoService.createTodo(newTodoData, userId);
      if (newTodo.date === date) {
        setTodos(prev => [...prev, newTodo].sort((a,b) => a.sortIndex - b.sortIndex));
      }
    } catch (err) {
      setError('Failed to add task.');
      console.error(err);
    }
  }, [date, userId]);

  const updateTodo = useCallback(async (id: string, data: TodoUpdate) => {
    if (!userId) return;
    const originalTodos = [...todos];
    
    setTodos(prev => {
      if (data.date && data.date !== date) {
        return prev.filter(t => t.id !== id);
      }
      return prev.map(t => t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t)
    });

    try {
      await todoService.updateTodo(id, data, userId);
    } catch (err) {
      setError('Failed to update task. Reverting changes.');
      console.error(err);
      setTodos(originalTodos);
    }
  }, [todos, date, userId]);

  const deleteTodo = useCallback(async (id: string) => {
    if (!userId) return;
    const originalTodos = [...todos];
    setTodos(prev => prev.filter(t => t.id !== id));
    try {
      await todoService.deleteTodo(id, userId);
    } catch (err) {
      setError('Failed to delete task.');
      console.error(err);
      setTodos(originalTodos);
    }
  }, [todos, userId]);

  return { todos, loading, error, addTodo, updateTodo, deleteTodo };
};