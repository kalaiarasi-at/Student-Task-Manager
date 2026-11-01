import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  AlertTriangle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { StatusFilter } from '../types';

interface DashboardStatsProps {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  activeStatusFilter: StatusFilter;
  onSelectStatusFilter: (status: StatusFilter) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalTasks,
  pendingTasks,
  completedTasks,
  overdueTasks,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className="space-y-4 mb-6">
      {/* Overview Banner for College Students */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-5 sm:p-6 text-white shadow-lg relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-36 -top-12 w-32 h-32 bg-blue-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/15 text-blue-100 backdrop-blur-sm border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Academic Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Student Task Dashboard
            </h2>
            <p className="text-sm text-blue-100 max-w-xl">
              Track your coursework deadlines, homework assignments, and exam preparations in one organized place.
            </p>
          </div>

          {/* Progress gauge card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 md:min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-medium text-blue-100 mb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
                Workload Completion
              </span>
              <span className="text-white font-bold text-sm">{completionPercentage}%</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-blue-950/40 rounded-full h-2.5 overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="mt-2 text-[11px] text-blue-200 flex justify-between">
              <span>{completedTasks} of {totalTasks} tasks completed</span>
              <span>{pendingTasks} remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Tasks Card */}
        <button
          onClick={() => onSelectStatusFilter('all')}
          className={`text-left p-4 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
            activeStatusFilter === 'all'
              ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-blue-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {totalTasks}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              All academic items
            </p>
          </div>
          {activeStatusFilter === 'all' && (
            <div className="absolute bottom-1 right-3 text-[10px] font-bold text-blue-600">
              Active view
            </div>
          )}
        </button>

        {/* Pending Tasks Card */}
        <button
          onClick={() => onSelectStatusFilter('pending')}
          className={`text-left p-4 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
            activeStatusFilter === 'pending'
              ? 'bg-amber-50/60 border-amber-400 ring-2 ring-amber-500/20 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-amber-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
              Pending Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {pendingTasks}
            </div>
            <p className="text-xs text-amber-700/80 mt-0.5">
              In-progress coursework
            </p>
          </div>
          {activeStatusFilter === 'pending' && (
            <div className="absolute bottom-1 right-3 text-[10px] font-bold text-amber-600">
              Active view
            </div>
          )}
        </button>

        {/* Completed Tasks Card */}
        <button
          onClick={() => onSelectStatusFilter('completed')}
          className={`text-left p-4 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
            activeStatusFilter === 'completed'
              ? 'bg-emerald-50/60 border-emerald-400 ring-2 ring-emerald-500/20 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-emerald-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              Completed Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">
              {completedTasks}
            </div>
            <p className="text-xs text-emerald-700/80 mt-0.5">
              Turned in &amp; finished
            </p>
          </div>
          {activeStatusFilter === 'completed' && (
            <div className="absolute bottom-1 right-3 text-[10px] font-bold text-emerald-600">
              Active view
            </div>
          )}
        </button>

        {/* Overdue Deadlines Card */}
        <button
          onClick={() => onSelectStatusFilter('overdue')}
          className={`text-left p-4 rounded-xl border transition-all duration-200 relative group cursor-pointer ${
            activeStatusFilter === 'overdue'
              ? 'bg-rose-50/70 border-rose-400 ring-2 ring-rose-500/20 shadow-md'
              : 'bg-white border-slate-200/80 hover:border-rose-300 hover:shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
              Overdue Tasks
            </span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
              overdueTasks > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className={`text-2xl sm:text-3xl font-extrabold ${overdueTasks > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
              {overdueTasks}
            </div>
            <p className="text-xs text-rose-600/80 mt-0.5">
              {overdueTasks > 0 ? 'Urgent attention needed' : 'All up to date!'}
            </p>
          </div>
          {activeStatusFilter === 'overdue' && (
            <div className="absolute bottom-1 right-3 text-[10px] font-bold text-rose-600">
              Active view
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
