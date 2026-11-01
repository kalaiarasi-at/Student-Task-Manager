import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  PlusCircle, 
  ListFilter, 
  CheckCircle2, 
  Clock, 
  Search, 
  Trash2, 
  Sparkles, 
  Calendar,
  AlertCircle,
  FileDown,
  BookOpen,
  ArrowRight,
  GraduationCap
} from 'lucide-react';

import { 
  Task, 
  StatusFilter, 
  PriorityFilter, 
  SortOption, 
  TaskCategory 
} from './types';
import { 
  loadTasksFromStorage, 
  saveTasksToStorage, 
  resetToDemoTasks, 
  clearAllTasksFromStorage 
} from './utils/storage';
import { isTaskOverdue } from './utils/dateUtils';

import { Navbar } from './components/Navbar';
import { DashboardStats } from './components/DashboardStats';
import { TaskFilterBar } from './components/TaskFilterBar';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ToastContainer, ToastMessage } from './components/Toast';

const ALL_CATEGORIES: TaskCategory[] = [
  'Assignment',
  'Homework',
  'Project',
  'Exam Prep',
  'Reading',
  'Lab Report',
  'General',
];

export default function App() {
  // Tasks state initialized from localStorage
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDateAsc');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Delete confirmation modal state
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'info' | 'warning', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync tasks to browser local storage whenever tasks state changes
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // Keyboard shortcut listener ('n' to add task, '/' to focus search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setTaskToEdit(null);
        setIsTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute Statistics for Dashboard
  const stats = useMemo(() => {
    const total = tasks.length;
    let pending = 0;
    let completed = 0;
    let overdue = 0;
    let high = 0;
    let medium = 0;
    let low = 0;

    tasks.forEach((t) => {
      if (t.completed) {
        completed++;
      } else {
        pending++;
        if (isTaskOverdue(t.dueDate, false)) {
          overdue++;
        }
      }

      if (t.priority === 'high') high++;
      else if (t.priority === 'medium') medium++;
      else if (t.priority === 'low') low++;
    });

    return {
      all: total,
      pending,
      completed,
      overdue,
      high,
      medium,
      low,
    };
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;
        if (statusFilter === 'overdue' && (task.completed || !isTaskOverdue(task.dueDate, false))) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Search query filter (matches title, course, description)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const titleMatch = task.title.toLowerCase().includes(q);
          const descMatch = (task.description || '').toLowerCase().includes(q);
          const courseMatch = (task.course || '').toLowerCase().includes(q);
          const categoryMatch = task.category.toLowerCase().includes(q);
          if (!titleMatch && !descMatch && !courseMatch && !categoryMatch) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDateAsc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'dueDateDesc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);
        }
        if (sortBy === 'priority') {
          const rank = { high: 1, medium: 2, low: 3 };
          return rank[a.priority] - rank[b.priority];
        }
        if (sortBy === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'createdAtDesc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [tasks, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy]);

  // Handlers for task actions
  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newCompleted = !t.completed;
          addToast(
            'success',
            newCompleted ? 'Task completed!' : 'Task reopened',
            newCompleted ? `"${t.title}" marked as finished.` : `"${t.title}" moved to pending.`
          );
          return {
            ...t,
            completed: newCompleted,
            completedAt: newCompleted ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleOpenAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt'>,
    editingId?: string
  ) => {
    if (editingId) {
      // Editing existing task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? { ...t, ...taskData }
            : t
        )
      );
      addToast('success', 'Task updated successfully', `"${taskData.title}" was saved.`);
    } else {
      // Creating new task
      const newTask: Task = {
        ...taskData,
        id: 'task-' + Date.now().toString() + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast('success', 'New academic task added', `"${newTask.title}" added to your to-do list.`);
    }
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  const handleOpenDelete = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    const deletedTitle = taskToDelete.title;
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
    addToast('info', 'Task deleted', `"${deletedTitle}" has been removed from your list.`);
  };

  const handleDuplicateTask = (task: Task) => {
    const duplicated: Task = {
      ...task,
      id: 'task-' + Date.now().toString() + Math.random().toString(36).substring(2, 6),
      title: `${task.title} (Copy)`,
      completed: false,
      completedAt: undefined,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [duplicated, ...prev]);
    addToast('info', 'Task duplicated', `Created a copy of "${task.title}".`);
  };

  const handleResetDemoData = () => {
    const freshTasks = resetToDemoTasks();
    setTasks(freshTasks);
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
    addToast('info', 'Demo data loaded', 'Sample college assignments and deadlines have been restored.');
  };

  const handleMarkAllCompleted = () => {
    if (stats.pending === 0) return;
    setTasks((prev) =>
      prev.map((t) => ({ ...t, completed: true, completedAt: new Date().toISOString() }))
    );
    addToast('success', 'All tasks completed!', 'Great job tackling your academic workload.');
  };

  const handleClearCompleted = () => {
    if (stats.completed === 0) return;
    setTasks((prev) => prev.filter((t) => !t.completed));
    addToast('info', 'Completed tasks cleared', 'Archived finished items from the view.');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCategoryFilter('all');
  };

  const isFiltered =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'all' ||
    priorityFilter !== 'all' ||
    categoryFilter !== 'all';

  // Export tasks as JSON or text file
  const handleExportTasks = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `student-tasks-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addToast('success', 'Tasks exported', 'JSON backup file downloaded to your device.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar 
        onOpenAddTask={handleOpenAddTask} 
        onResetDemoData={handleResetDemoData} 
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Project Title Header Banner */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Active Semester Tracker
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Student Task Manager – To-Do List Web Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Organize homework, lab reports, project milestones, and upcoming examination deadlines with ease.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleExportTasks}
              title="Export tasks as JSON file"
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-slate-600" />
              <span>Export</span>
            </button>

            <button
              onClick={handleOpenAddTask}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 rounded-xl transition flex items-center gap-1.5 shadow-sm hover:shadow cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Feature 1: Home Dashboard Stats */}
        <DashboardStats
          totalTasks={stats.all}
          pendingTasks={stats.pending}
          completedTasks={stats.completed}
          overdueTasks={stats.overdue}
          activeStatusFilter={statusFilter}
          onSelectStatusFilter={(st) => setStatusFilter(st)}
        />

        {/* Feature 4: Search and Filter Bar */}
        <TaskFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          categories={ALL_CATEGORIES}
          counts={stats}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Task List Header & Bulk Tools */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              {statusFilter === 'all' && 'All Academic Tasks'}
              {statusFilter === 'pending' && 'Pending Tasks'}
              {statusFilter === 'completed' && 'Completed Tasks'}
              {statusFilter === 'overdue' && 'Overdue Tasks'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
              {filteredTasks.length}
            </span>
          </div>

          {/* Quick Bulk Operations */}
          <div className="flex items-center gap-2">
            {stats.pending > 0 && (
              <button
                onClick={handleMarkAllCompleted}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mark All as Completed</span>
              </button>
            )}

            {stats.completed > 0 && (
              <button
                onClick={handleClearCompleted}
                className="text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear Completed</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature 3: Manage Tasks - Task List Display */}
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={handleOpenEditTask}
                onDelete={handleOpenDelete}
                onDuplicate={handleDuplicateTask}
              />
            ))}
          </div>
        ) : (
          /* Empty State Display */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              {isFiltered ? (
                <Search className="w-8 h-8 text-blue-500" />
              ) : (
                <GraduationCap className="w-8 h-8 text-blue-600" />
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-800">
              {isFiltered ? 'No matching tasks found' : 'Your academic task list is empty'}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {isFiltered
                ? 'Try adjusting your search query, priority filters, or status selection.'
                : 'Get started by creating your first homework, assignment, or exam deadline to stay ahead of your semester.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {isFiltered ? (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition cursor-pointer"
                >
                  Reset Active Filters
                </button>
              ) : null}

              <button
                onClick={handleOpenAddTask}
                className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm hover:shadow cursor-pointer flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Your First Task</span>
              </button>
            </div>
          </div>
        )}

        {/* College Productivity Tips Banner */}
        <div className="mt-10 bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50 rounded-2xl p-5 border border-blue-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-blue-900">
                Student Study Tip: The 2-Minute Rule
              </h4>
              <p className="text-xs text-blue-700/90 mt-0.5">
                If an assignment takes less than 2 minutes to submit or review, do it immediately to prevent backlog accumulation.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold text-blue-800 bg-white px-3 py-1.5 rounded-lg border border-blue-200 shadow-2xs whitespace-nowrap">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 font-mono text-[10px]">N</kbd> for quick task
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-medium text-slate-700">
            Student Task Manager &bull; To-Do List Web Application
          </p>
          <p className="text-slate-400">
            Data is securely saved in your browser's Local Storage. Tasks persist across page reloads.
          </p>
        </div>
      </footer>

      {/* Feature 2 & 3: Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        task={taskToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setTaskToDelete(null);
        }}
      />

      {/* Toast Feedback Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
