/**
 * Date utility helpers for college student deadlines
 */

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffset(days: number): string {
  const target = new Date();
  target.setDate(target.getDate() + days);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isTaskOverdue(dueDate: string, isCompleted: boolean): boolean {
  if (isCompleted || !dueDate) return false;
  const todayStr = getTodayDateString();
  return dueDate < todayStr;
}

export function isTaskDueToday(dueDate: string): boolean {
  return dueDate === getTodayDateString();
}

export function isTaskDueTomorrow(dueDate: string): boolean {
  return dueDate === getDateOffset(1);
}

export function formatReadableDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export interface DueStatus {
  label: string;
  isOverdue: boolean;
  isUrgent: boolean;
  badgeClass: string;
}

export function getDueStatus(dueDate: string, isCompleted: boolean): DueStatus {
  if (isCompleted) {
    return {
      label: 'Completed',
      isOverdue: false,
      isUrgent: false,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
  }

  if (!dueDate) {
    return {
      label: 'No deadline',
      isOverdue: false,
      isUrgent: false,
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200',
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [y, m, d] = dueDate.split('-').map(Number);
  const due = new Date(y, m - 1, d);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return {
      label: overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`,
      isOverdue: true,
      isUrgent: true,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200 font-medium',
    };
  }

  if (diffDays === 0) {
    return {
      label: 'Due Today',
      isOverdue: false,
      isUrgent: true,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-300 font-medium',
    };
  }

  if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      isOverdue: false,
      isUrgent: true,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    };
  }

  if (diffDays <= 7) {
    return {
      label: `Due in ${diffDays} days`,
      isOverdue: false,
      isUrgent: false,
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    };
  }

  return {
    label: formatReadableDate(dueDate),
    isOverdue: false,
    isUrgent: false,
    badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
  };
}
