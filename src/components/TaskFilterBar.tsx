import React from 'react';
import { 
  Search, 
  X, 
  Filter, 
  ArrowUpDown, 
  Layers, 
  Flame,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { StatusFilter, PriorityFilter, SortOption, TaskCategory } from '../types';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (priority: PriorityFilter) => void;
  categoryFilter: string;
  onCategoryFilterChange: (cat: string) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  categories: TaskCategory[];
  counts: {
    all: number;
    pending: number;
    completed: number;
    overdue: number;
    high: number;
    medium: number;
    low: number;
  };
  onResetFilters: () => void;
  isFiltered: boolean;
}

export const TaskFilterBar: React.FC<TaskFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortByChange,
  categories,
  counts,
  onResetFilters,
  isFiltered,
}) => {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4 mb-6">
      {/* Top row: Search input + Sort dropdown */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title, course (e.g. CS 101), or description..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort by dropdown */}
        <div className="flex items-center gap-2 sm:w-auto">
          <div className="relative w-full sm:w-56">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOption)}
              aria-label="Sort tasks by"
              className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer appearance-none"
            >
              <option value="dueDateAsc">Due Date: Soonest First</option>
              <option value="dueDateDesc">Due Date: Furthest First</option>
              <option value="priority">Priority: High to Low</option>
              <option value="titleAsc">Title: Alphabetical (A-Z)</option>
              <option value="createdAtDesc">Recently Added First</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Second row: Filter Tabs & Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-slate-100">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            All Tasks
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              statusFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => onStatusFilterChange('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            <Clock className="w-3 h-3" />
            Pending
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              statusFilter === 'pending' ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.pending}
            </span>
          </button>

          <button
            onClick={() => onStatusFilterChange('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            Completed
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              statusFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.completed}
            </span>
          </button>

          <button
            onClick={() => onStatusFilterChange('overdue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'overdue'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            Overdue
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              statusFilter === 'overdue' ? 'bg-rose-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {counts.overdue}
            </span>
          </button>
        </div>

        {/* Priority & Category selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <span className="px-2 text-slate-500 font-medium hidden sm:inline flex items-center gap-1">
              <Flame className="w-3 h-3 text-slate-400" />
              Priority:
            </span>
            <button
              onClick={() => onPriorityFilterChange('all')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer ${
                priorityFilter === 'all'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onPriorityFilterChange('high')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'high'
                  ? 'bg-rose-100 text-rose-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              High
            </button>
            <button
              onClick={() => onPriorityFilterChange('medium')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'medium'
                  ? 'bg-amber-100 text-amber-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-amber-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Med
            </button>
            <button
              onClick={() => onPriorityFilterChange('low')}
              className={`px-2 py-1 rounded-md font-medium transition cursor-pointer flex items-center gap-1 ${
                priorityFilter === 'low'
                  ? 'bg-blue-100 text-blue-800 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Low
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryFilterChange(e.target.value)}
              aria-label="Filter tasks by category"
              className="py-1.5 pl-3 pr-7 text-xs font-medium bg-slate-100 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Reset Filters button if active */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition flex items-center gap-1 cursor-pointer"
              title="Reset all active filters"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
