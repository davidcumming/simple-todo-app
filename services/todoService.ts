
import { Todo, TodoCreate, TodoStatus, TodoUpdate } from '../types';
import { formatDateISO } from '../utils/dateUtils';

// --- In-memory database with seed data ---
let MOCK_TODOS: Todo[] = [];
const STORAGE_KEY = 'dailyFocusTodos';

const loadFromLocalStorage = () => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      MOCK_TODOS = JSON.parse(storedData);
    } else {
      generateSeedData();
      saveToLocalStorage();
    }
  } catch (e) {
    console.error("Failed to load from local storage, using seed data.", e);
    generateSeedData();
  }
};

const saveToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TODOS));
  } catch (e) {
    console.error("Failed to save to local storage.", e);
  }
};

const generateSeedData = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayISO = formatDateISO(today);
    const tomorrowISO = formatDateISO(tomorrow);
    const yesterdayISO = formatDateISO(yesterday);

    MOCK_TODOS = [
        // Today's tasks
        { id: '1', title: 'Review PR for feature X', date: todayISO, status: TodoStatus.Open, sortIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), difficulty: 3, project: 'Project Phoenix' },
        { id: '2', title: 'Draft weekly report', date: todayISO, status: TodoStatus.Open, sortIndex: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), assignee: 'Me', nextAction: 'Gather metrics' },
        { id: '3', title: 'Call the vet for appointment', date: todayISO, status: TodoStatus.Completed, sortIndex: 3, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), scheduleInfo: 'After 3 PM' },
        // Yesterday's tasks
        { id: '4', title: 'Plan Q3 roadmap', date: yesterdayISO, status: TodoStatus.Completed, sortIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: '5', title: 'Fix bug #1234', date: yesterdayISO, status: TodoStatus.Abandoned, sortIndex: 2, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), plan: 'Was not a bug, user error.' },
        // Tomorrow's tasks
        { id: '6', title: 'Prepare for sprint planning', date: tomorrowISO, status: TodoStatus.Open, sortIndex: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];
};

loadFromLocalStorage();

// --- Mock API Functions ---

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getTodos = async (date: string): Promise<Todo[]> => {
  await simulateDelay(300);
  console.log(`Fetching todos for ${date}`);
  const todosForDate = MOCK_TODOS
    .filter(todo => todo.date === date)
    .sort((a, b) => a.sortIndex - b.sortIndex);
  return JSON.parse(JSON.stringify(todosForDate)); // Deep copy
};

export const createTodo = async (data: TodoCreate): Promise<Todo> => {
    await simulateDelay(200);
    const maxSortIndex = MOCK_TODOS
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
    MOCK_TODOS.push(newTodo);
    saveToLocalStorage();
    console.log('Created todo:', newTodo);
    return JSON.parse(JSON.stringify(newTodo));
};

export const updateTodo = async (id: string, data: TodoUpdate): Promise<Todo> => {
    await simulateDelay(250);
    const todoIndex = MOCK_TODOS.findIndex(t => t.id === id);
    if (todoIndex === -1) {
        throw new Error('Todo not found');
    }
    const updatedTodo = {
        ...MOCK_TODOS[todoIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    MOCK_TODOS[todoIndex] = updatedTodo;
    saveToLocalStorage();
    console.log('Updated todo:', updatedTodo);
    return JSON.parse(JSON.stringify(updatedTodo));
};

export const deleteTodo = async (id: string): Promise<{ id: string }> => {
    await simulateDelay(400);
    const todoIndex = MOCK_TODOS.findIndex(t => t.id === id);
    if (todoIndex === -1) {
        throw new Error('Todo not found');
    }
    MOCK_TODOS.splice(todoIndex, 1);
    saveToLocalStorage();
    console.log('Deleted todo:', id);
    return { id };
};
