import React from 'react';
import { 
  GraduationCap, 
  PlusCircle, 
  Calendar, 
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface NavbarProps {
  onOpenAddTask: () => void;
  onResetDemoData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddTask, onResetDemoData }) => {
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-md sticky top-0 z-30 border-b border-blue-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Logo & Application Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-600/60 border border-blue-400/40 flex items-center justify-center text-white shadow-inner shadow-blue-400/20">
              <GraduationCap className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Student Task Manager
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-500/30 text-blue-100 border border-blue-400/30">
                  College Academic Edition
                </span>
              </div>
              <p className="text-xs text-blue-200/90 font-normal hidden sm:block">
                To-Do List Web Application &bull; Deadlines, Assignments &amp; Projects
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Today's date pill */}
            <div className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-950/50 border border-blue-700/60 text-blue-200 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-blue-300" />
              <span>{todayFormatted}</span>
            </div>

            {/* Reset to demo tasks */}
            <button
              onClick={onResetDemoData}
              title="Reset to sample student tasks"
              className="p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-medium bg-blue-800/80 hover:bg-blue-700 text-blue-100 border border-blue-600/50 transition-colors flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">Reset Demo Tasks</span>
            </button>

            {/* Add Task Primary Action */}
            <button
              onClick={onOpenAddTask}
              className="inline-flex items-center space-x-2 px-3.5 sm:px-4 py-2 rounded-lg bg-white text-blue-900 font-semibold text-xs sm:text-sm hover:bg-blue-50 active:scale-98 transition shadow-sm hover:shadow"
            >
              <PlusCircle className="w-4 h-4 text-blue-700" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
