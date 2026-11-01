import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Flame, 
  BookOpen, 
  AlignLeft, 
  CheckCircle, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Task, Priority, TaskCategory } from '../types';
import { getTodayDateString, getDateOffset } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Omit<Task, 'id' | 'createdAt'>, editingId?: string) => void;
  taskToEdit?: Task | null;
}

const CATEGORIES: TaskCategory[] = [
  'Assignment',
  'Homework',
  'Project',
  'Exam Prep',
  'Reading',
  'Lab Report',
  'General',
];

const COMMON_COURSES = [
  'CS 101',
  'CS 301',
  'MATH 220',
  'PHYS 210',
  'CHEM 101',
  'ENG 102',
  'ECON 101',
  'BIO 110',
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Assignment');
  const [course, setCourse] = useState('');
  
  // Validation errors
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>({});

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate || getTodayDateString());
      setPriority(taskToEdit.priority);
      setCategory(taskToEdit.category);
      setCourse(taskToEdit.course || '');
    } else {
      // Default new task values
      setTitle('');
      setDescription('');
      setDueDate(getDateOffset(1)); // Default tomorrow for college tasks
      setPriority('medium');
      setCategory('Assignment');
      setCourse('');
    }
    setErrors({});
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; dueDate?: string } = {};
    if (!title.trim()) {
      newErrors.title = 'Please enter a task title.';
    } else if (title.trim().length < 2) {
      newErrors.title = 'Task title must be at least 2 characters long.';
    }

    if (!dueDate) {
      newErrors.dueDate = 'Please select a due date.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave(
      {
        title: title.trim(),
        description: description.trim(),
        dueDate,
        priority,
        category,
        course: course.trim().toUpperCase() || undefined,
        completed: taskToEdit ? taskToEdit.completed : false,
      },
      taskToEdit?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-700/60 border border-blue-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-200" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold">
                {taskToEdit ? 'Edit Academic Task' : 'Add New Academic Task'}
              </h2>
              <p className="text-xs text-blue-200">
                {taskToEdit ? 'Update assignment parameters and deadline' : 'Add a new homework, project, or exam item'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Algorithms Problem Set 3 or Physics Midterm Prep"
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                errors.title 
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400' 
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.title}
              </p>
            )}
          </div>

          {/* Course & Category in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Course Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Course / Subject Code
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. CS 301, MATH 220"
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-normal"
              />
              {/* Quick Course Suggestions */}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {COMMON_COURSES.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCourse(c)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 transition"
                  >
                    +{c}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-blue-600" />
              Priority Level <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'high'
                    ? 'bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-rose-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                High Priority
              </button>

              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'medium'
                    ? 'bg-amber-50 border-amber-500 text-amber-800 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium
              </button>

              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  priority === 'low'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-500/20 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Low Priority
              </button>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Due Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => {
                setDueDate(e.target.value);
                if (errors.dueDate) setErrors((prev) => ({ ...prev, dueDate: undefined }));
              }}
              className={`w-full px-3.5 py-2 text-sm rounded-xl border transition focus:outline-none focus:ring-2 ${
                errors.dueDate
                  ? 'border-rose-400 bg-rose-50/30 focus:ring-rose-400'
                  : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500 bg-white'
              }`}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                {errors.dueDate}
              </p>
            )}

            {/* Quick date presets */}
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[11px] font-medium text-slate-400">Quick set:</span>
              <button
                type="button"
                onClick={() => setDueDate(getTodayDateString())}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] transition"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDueDate(getDateOffset(1))}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] transition"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setDueDate(getDateOffset(3))}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] transition"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => setDueDate(getDateOffset(7))}
                className="px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] transition"
              >
                In 1 Week
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1">
              <AlignLeft className="w-3.5 h-3.5 text-blue-600" />
              Task Description &amp; Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add assignment details, textbook page numbers, project requirements, or links..."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
