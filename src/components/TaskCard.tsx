import React, { useState } from 'react';
import { 
  Check, 
  Calendar, 
  Edit3, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Task } from '../types';
import { getDueStatus } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onDuplicate: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const dueStatus = getDueStatus(task.dueDate, task.completed);

  // Priority color styling
  const priorityStyles = {
    high: {
      border: 'border-l-rose-500',
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      label: 'High Priority',
    },
    medium: {
      border: 'border-l-amber-500',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Medium Priority',
    },
    low: {
      border: 'border-l-blue-400',
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-400',
      label: 'Low Priority',
    },
  }[task.priority];

  // Category styling
  const categoryBadge = {
    Assignment: 'bg-sky-50 text-sky-800 border-sky-200',
    Homework: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    Project: 'bg-purple-50 text-purple-800 border-purple-200',
    'Exam Prep': 'bg-amber-50 text-amber-800 border-amber-200',
    Reading: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    'Lab Report': 'bg-cyan-50 text-cyan-800 border-cyan-200',
    General: 'bg-slate-100 text-slate-700 border-slate-200',
  }[task.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200/90 shadow-sm transition-all duration-200 border-l-4 ${priorityStyles.border} ${
        task.completed 
          ? 'bg-slate-50/70 opacity-80' 
          : 'hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Custom Styled Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
            className={`mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer flex-shrink-0 ${
              task.completed
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/50'
            }`}
          >
            {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
          </button>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top row: tags, course & priority */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Course code if provided */}
              {task.course && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-blue-900 text-white tracking-wide">
                  <BookOpen className="w-3 h-3 text-blue-200" />
                  {task.course}
                </span>
              )}

              {/* Academic Category */}
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${categoryBadge}`}>
                {task.category}
              </span>

              {/* Priority badge */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${priorityStyles.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles.dot}`} />
                {priorityStyles.label}
              </span>

              {/* Due Date Status */}
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs border ml-auto ${dueStatus.badgeClass}`}>
                {dueStatus.isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                ) : (
                  <Calendar className="w-3 h-3 text-slate-500" />
                )}
                <span>{dueStatus.label}</span>
              </span>
            </div>

            {/* Title */}
            <h3
              onClick={() => onToggleComplete(task.id)}
              className={`text-base font-semibold leading-snug cursor-pointer select-none transition-colors ${
                task.completed
                  ? 'line-through text-slate-400 font-normal'
                  : 'text-slate-800 hover:text-blue-700'
              }`}
            >
              {task.title}
            </h3>

            {/* Description (collapsible or preview) */}
            {task.description && (
              <div className="mt-2 text-xs sm:text-sm text-slate-600">
                <p className={isExpanded ? 'whitespace-pre-line text-slate-700' : 'line-clamp-2'}>
                  {task.description}
                </p>
                {task.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-1 text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show less</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>Show full instructions</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Added {new Date(task.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {/* Duplicate */}
                <button
                  type="button"
                  onClick={() => onDuplicate(task)}
                  title="Duplicate task"
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Duplicate</span>
                </button>

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => onEdit(task)}
                  title="Edit task"
                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => onDelete(task)}
                  title="Delete task"
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
