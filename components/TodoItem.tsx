import React, { useState, useCallback } from 'react';
import { Todo, TodoStatus, TodoUpdate } from '../types';
import { formatDateISO } from '../utils/dateUtils';
import { CalendarIcon, ChevronDownIcon, GripVerticalIcon, TrashIcon, XCircleIcon } from './Icons';

interface TodoItemProps {
  todo: Todo;
  onUpdateTodo: (id: string, data: TodoUpdate) => void;
  onDeleteTodo: (id: string) => void;
}

const statusClasses: Record<TodoStatus, { bg: string, text: string, checkbox: string }> = {
  [TodoStatus.Open]: { bg: 'bg-gray-700', text: 'text-white', checkbox: 'border-gray-400' },
  [TodoStatus.Completed]: { bg: 'bg-green-900/50', text: 'text-gray-400 line-through', checkbox: 'border-green-500 bg-green-500' },
  [TodoStatus.Abandoned]: { bg: 'bg-red-900/50', text: 'text-gray-400 line-through', checkbox: 'border-red-500' },
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onUpdateTodo, onDeleteTodo }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVanishing, setIsVanishing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = e.target.checked ? TodoStatus.Completed : TodoStatus.Open;
    onUpdateTodo(todo.id, { status: newStatus });
  }, [todo.id, onUpdateTodo]);

  const handleAbandon = useCallback(() => {
    onUpdateTodo(todo.id, { status: TodoStatus.Abandoned });
  }, [todo.id, onUpdateTodo]);

  const handleDelete = useCallback(() => {
    if (window.confirm(`Are you sure you want to delete "${todo.title}"?`)) {
      onDeleteTodo(todo.id);
    }
  }, [todo.id, todo.title, onDeleteTodo]);

  const handleRedate = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      setIsVanishing(true);
      setTimeout(() => {
        onUpdateTodo(todo.id, { date: newDate });
        // The component will unmount, so no need to reset isVanishing
      }, 300); // match transition duration
    }
    setShowDatePicker(false);
  }, [todo.id, onUpdateTodo]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const classes = statusClasses[todo.status];

  return (
    <li
      className={`relative p-3 rounded-lg shadow-sm flex flex-col transition-all duration-300 ${classes.bg} ${isVanishing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${showDatePicker ? 'z-10' : 'z-0'}`}
    >
      <div className="flex items-center">
        <GripVerticalIcon className="w-5 h-5 text-gray-500 cursor-grab mr-2" />
        <div className="flex items-center flex-grow">
          <input
            type="checkbox"
            checked={todo.status === TodoStatus.Completed}
            onChange={handleStatusChange}
            className={`w-5 h-5 rounded-sm appearance-none border-2 transition-all duration-200 cursor-pointer ${classes.checkbox} ${todo.status === TodoStatus.Completed ? 'checked:bg-green-500' : ''}`}
            style={{ 
              backgroundImage: todo.status === TodoStatus.Completed ? `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")` : 'none' 
            }}
          />
          <span className={`ml-3 flex-grow ${classes.text}`}>{todo.title}</span>
        </div>
        <div className="flex items-center space-x-2 ml-2">
            <div className="relative">
                <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="p-1.5 rounded-full hover:bg-gray-600 transition-colors"
                    aria-label="Redate task"
                >
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                </button>
                {showDatePicker && (
                    <div className="absolute right-0 top-full mt-2 p-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-20">
                        {/* Relative container for layering the fake and real inputs */}
                        <div className="relative">
                            {/* The visible, styled element that the user sees */}
                            <div className="bg-gray-800 text-white rounded-md px-3 py-2 border border-gray-600 pointer-events-none">
                                {formatDateISO(new Date(todo.date))}
                            </div>
                            {/* The invisible but functional date input on top */}
                            <input
                                type="date"
                                defaultValue={todo.date}
                                onChange={handleRedate}
                                onBlur={() => setShowDatePicker(false)}
                                autoFocus
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>
                )}
            </div>

          {todo.status === TodoStatus.Open && (
            <button onClick={handleAbandon} className="p-1.5 rounded-full hover:bg-gray-600 transition-colors" aria-label="Abandon task">
              <XCircleIcon className="w-5 h-5 text-yellow-400" />
            </button>
          )}
          <button onClick={handleDelete} className="p-1.5 rounded-full hover:bg-gray-600 transition-colors" aria-label="Delete task">
            <TrashIcon className="w-5 h-5 text-red-400" />
          </button>
          <button onClick={toggleExpand} className="p-1.5 rounded-full hover:bg-gray-600 transition-colors" aria-label={isExpanded ? "Collapse details" : "Expand details"}>
            <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
      {isExpanded && <TodoDetailsPanel todo={todo} onUpdate={onUpdateTodo} />}
    </li>
  );
};

interface TodoDetailsPanelProps {
  todo: Todo;
  onUpdate: (id: string, data: TodoUpdate) => void;
}

const TodoDetailsPanel: React.FC<TodoDetailsPanelProps> = ({ todo, onUpdate }) => {
  const [formData, setFormData] = useState({
    assignee: todo.assignee || '',
    difficulty: todo.difficulty || 0,
    nextAction: todo.nextAction || '',
    plan: todo.plan || '',
    project: todo.project || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const key = name as keyof typeof formData;
    let updateValue: string | number | undefined = value;

    if (key === 'difficulty') {
      updateValue = value ? parseInt(value, 10) : undefined;
      if (todo.difficulty === updateValue) return;
    } else {
       if (todo[key] === updateValue) return;
    }

    onUpdate(todo.id, { [name]: updateValue });
  };
  

  return (
    <div className="mt-4 pt-4 border-t border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div className="space-y-1">
        <label htmlFor={`assignee-${todo.id}`} className="block font-medium text-gray-400">Assignee</label>
        <input type="text" id={`assignee-${todo.id}`} name="assignee" value={formData.assignee} onChange={handleInputChange} onBlur={handleBlur} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="space-y-1">
        <label htmlFor={`project-${todo.id}`} className="block font-medium text-gray-400">Project</label>
        <input type="text" id={`project-${todo.id}`} name="project" value={formData.project} onChange={handleInputChange} onBlur={handleBlur} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="space-y-1">
        <label htmlFor={`difficulty-${todo.id}`} className="block font-medium text-gray-400">Difficulty (1-5)</label>
        <select id={`difficulty-${todo.id}`} name="difficulty" value={formData.difficulty} onChange={handleInputChange} onBlur={handleBlur} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="0">None</option>
          <option value="1">1 (Trivial)</option>
          <option value="2">2 (Easy)</option>
          <option value="3">3 (Medium)</option>
          <option value="4">4 (Hard)</option>
          <option value="5">5 (Expert)</option>
        </select>
      </div>
       <div className="space-y-1">
        <label htmlFor={`nextAction-${todo.id}`} className="block font-medium text-gray-400">Next Action</label>
        <input type="text" id={`nextAction-${todo.id}`} name="nextAction" value={formData.nextAction} onChange={handleInputChange} onBlur={handleBlur} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"/>
      </div>
      <div className="md:col-span-2 space-y-1">
        <label htmlFor={`plan-${todo.id}`} className="block font-medium text-gray-400">Plan</label>
        <textarea id={`plan-${todo.id}`} name="plan" value={formData.plan} onChange={handleInputChange} onBlur={handleBlur} rows={3} className="w-full bg-gray-600 border border-gray-500 rounded px-2 py-1 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
      </div>
    </div>
  );
};