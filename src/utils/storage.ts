import { Task } from '../types';
import { getDateOffset } from './dateUtils';

const STORAGE_KEY = 'student_task_manager_tasks_v1';

export const INITIAL_STUDENT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Computer Science: Algorithms Homework 4',
    description: 'Implement Dijkstra and Bellman-Ford shortest path algorithms in Python with unit test cases.',
    dueDate: getDateOffset(0), // Today
    priority: 'high',
    category: 'Homework',
    course: 'CS 301',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Physics Lab Report: Rotational Dynamics',
    description: 'Calculate moment of inertia from experimental pendulum data and plot angular acceleration curves.',
    dueDate: getDateOffset(1), // Tomorrow
    priority: 'high',
    category: 'Lab Report',
    course: 'PHYS 210',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Calculus III Problem Set: Multivariable Integration',
    description: 'Complete textbook exercises 14.3 through 14.6 on double integrals in polar coordinates.',
    dueDate: getDateOffset(3), // In 3 days
    priority: 'medium',
    category: 'Assignment',
    course: 'MATH 220',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Software Engineering Term Project: Wireframes & Sprint 1',
    description: 'Draft UI wireframes in Figma and prepare Jira backlog tasks for team review meeting.',
    dueDate: getDateOffset(6), // In 6 days
    priority: 'medium',
    category: 'Project',
    course: 'CS 380',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'task-5',
    title: 'Midterm Examination Review: Operating Systems',
    description: 'Review memory management, virtual paging, TLB caching, and thread concurrency synchronization.',
    dueDate: getDateOffset(8),
    priority: 'high',
    category: 'Exam Prep',
    course: 'CS 350',
    completed: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
  {
    id: 'task-6',
    title: 'Academic Writing: Research Essay First Draft',
    description: 'Draft 1,500 words analyzing modern ethical challenges in generative artificial intelligence.',
    dueDate: getDateOffset(-2), // Completed overdue or completed in the past
    priority: 'medium',
    category: 'Assignment',
    course: 'ENG 102',
    completed: true,
    completedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'task-7',
    title: 'Economics Chapter 7 Reading: Monetary Policy',
    description: 'Read pages 180-215 and summarize Federal Reserve open market operations before seminar.',
    dueDate: getDateOffset(4),
    priority: 'low',
    category: 'Reading',
    course: 'ECON 101',
    completed: true,
    completedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export function loadTasksFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First visit: save initial tasks and return them
      saveTasksToStorage(INITIAL_STUDENT_TASKS);
      return INITIAL_STUDENT_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_STUDENT_TASKS;
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return INITIAL_STUDENT_TASKS;
  }
}

export function saveTasksToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
}

export function resetToDemoTasks(): Task[] {
  saveTasksToStorage(INITIAL_STUDENT_TASKS);
  return INITIAL_STUDENT_TASKS;
}

export function clearAllTasksFromStorage(): Task[] {
  saveTasksToStorage([]);
  return [];
}
