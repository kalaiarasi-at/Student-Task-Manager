import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Task } from '../types';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 id="delete-dialog-title" className="text-base sm:text-lg font-bold text-slate-900">
                Delete Academic Task?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>

              {/* Task Preview Card */}
              <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                {task.course && (
                  <span className="inline-block px-1.5 py-0.5 rounded bg-blue-900 text-white font-bold text-[10px] mr-1.5">
                    {task.course}
                  </span>
                )}
                <span className="font-semibold text-slate-800">{task.title}</span>
                <div className="mt-1 text-[11px] text-slate-500">
                  Due: {task.dueDate || 'No date'} &bull; {task.priority.toUpperCase()} Priority
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Yes, Delete Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
