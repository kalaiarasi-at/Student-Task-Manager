export type Priority = 'high' | 'medium' | 'low';

export type TaskCategory =
  | 'Assignment'
  | 'Homework'
  | 'Project'
  | 'Exam Prep'
  | 'Reading'
  | 'Lab Report'
  | 'General';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:MM optional
  priority: Priority;
  category: TaskCategory;
  course?: string; // e.g. "CS 101", "MATH 201"
  completed: boolean;
  completedAt?: string;
  createdAt: string;
}

export type StatusFilter = 'all' | 'pending' | 'completed' | 'overdue';

export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

export type SortOption =
  | 'dueDateAsc'
  | 'dueDateDesc'
  | 'priority'
  | 'titleAsc'
  | 'createdAtDesc';
