
import React from 'react';
import { TodoStatus } from '../types';

interface StatusFilterProps {
  selectedFilter: TodoStatus | 'all';
  onFilterChange: (filter: TodoStatus | 'all') => void;
}

const filters: (TodoStatus | 'all')[] = ['all', TodoStatus.Open, TodoStatus.Completed, TodoStatus.Abandoned];

const filterStyles = {
  base: 'px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200',
  selected: 'bg-indigo-600 text-white',
  unselected: 'bg-gray-700 text-gray-300 hover:bg-gray-600',
};

export const StatusFilter: React.FC<StatusFilterProps> = ({ selectedFilter, onFilterChange }) => {
  return (
    <div className="flex items-center space-x-2 p-1 bg-gray-900 rounded-full">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`${filterStyles.base} ${selectedFilter === filter ? filterStyles.selected : filterStyles.unselected}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};
