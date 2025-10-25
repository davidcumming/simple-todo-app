import { Todo, TodoCreate, TodoStatus, TodoUpdate } from '../types';
import { formatDateISO } from '../utils/dateUtils';

// --- User-specific in-memory database simulation using Local Storage ---

const getStorageKey = (userId: string) => `dailyFocusTodos_${userId}`;

const getUserTodos = (userId: string): Todo[] => {
  try {
    const storedData = localStorage.getItem(getStorageKey(userId));
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      // If no data, create seed data for this new user
      const seedData = generateSeedData();
      saveUserTodos(userId, seedData);
      return seedData;
    }
  } catch (e) {
    console.error(`Failed to load todos for user ${userId}, using seed data.`, e);
    return generateSeedData();
  }
};

const saveUserTodos = (userId: string, todos: Todo[]) => {
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(todos));
  } catch (e) {
    console.error(`Failed to save todos for user ${userId}.`, e);
  }
};

const generateSeedData = (): Todo[] => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayISO = formatDateISO(today);
    const tomorrowISO = formatDateISO(tomorrow);
    const yesterdayISO = formatDateISO(yesterday);

    return [
        { id: '1', title: 'Review PR for feature X', date: todayISO, status: TodoStatus.Open, sortIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), difficulty: 3, project: 'Project Phoenix', urls: ['https://github.com/example/repo/pull/123'] },
        { id: '2', title: 'Draft weekly report', date: todayISO, status: TodoStatus.Open, sortIndex: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), assignee: 'Me', nextAction: 'Gather metrics', urls: ['https://docs.google.com/document/d/example'] },
        { id: '3', title: 'Call the vet for appointment', date: todayISO, status: TodoStatus.Completed, sortIndex: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), scheduleInfo: 'After 3 PM' },
        { id: '4', title: 'Plan Q3 roadmap', date: yesterdayISO, status: TodoStatus.Completed, sortIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '5', title: 'Fix bug #1234', date: yesterdayISO, status: TodoStatus.Abandoned, sortIndex: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), plan: 'Was not a bug, user error.' },
        { id: '6', title: 'Prepare for sprint planning', date: tomorrowISO, status: TodoStatus.Open, sortIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
};

// --- Mock API Functions ---

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTodos = async (date: string, userId: string): Promise<Todo[]> => {
  await simulateDelay(300);
  const allTodos = getUserTodos(userId);
  const todosForDate = allTodos
    .filter(todo => todo.date === date)
    .sort((a, b) => a.sortIndex - b.sortIndex);
  return JSON.parse(JSON.stringify(todosForDate));
};

export const createTodo = async (data: TodoCreate, userId: string): Promise<Todo> => {
    await simulateDelay(200);
    const allTodos = getUserTodos(userId);
    const maxSortIndex = allTodos
        .filter(t => t.date === data.date)
        .reduce((max, t) => Math.max(max, t.sortIndex), 0);

    const newTodo: Todo = {
        ...data,
        id: crypto.randomUUID(),
        status: TodoStatus.Open,
        sortIndex: maxSortIndex + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    const updatedTodos = [...allTodos, newTodo];
    saveUserTodos(userId, updatedTodos);
    return JSON.parse(JSON.stringify(newTodo));
};

export const updateTodo = async (id: string, data: TodoUpdate, userId: string): Promise<Todo> => {
    await simulateDelay(250);
    const allTodos = getUserTodos(userId);
    const todoIndex = allTodos.findIndex(t => t.id === id);
    if (todoIndex === -1) throw new Error('Todo not found');
    
    const updatedTodo = { ...allTodos[todoIndex], ...data, updatedAt: new Date().toISOString() };
    allTodos[todoIndex] = updatedTodo;
    saveUserTodos(userId, allTodos);
    return JSON.parse(JSON.stringify(updatedTodo));
};

export const deleteTodo = async (id: string, userId: string): Promise<{ id: string }> => {
    await simulateDelay(400);
    let allTodos = getUserTodos(userId);
    const initialLength = allTodos.length;
    allTodos = allTodos.filter(t => t.id !== id);
    if (allTodos.length === initialLength) throw new Error('Todo not found');
    
    // FIX: Corrected typo from `saveUserodes` to `saveUserTodos`.
    saveUserTodos(userId, allTodos);
    return { id };
};