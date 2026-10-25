import React from 'react';
import { Activity, Calendar, Archive } from 'lucide-react';

export default function Header({ selectedDate, setSelectedDate, onOpenArchive }) {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Live status */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">CSE Market Agent</h1>
            <p className="text-xs text-slate-400">Colombo Stock Exchange Intelligence</p>
          </div>
        </div>

        {/* Controls: Date Picker & Archive button */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={onOpenArchive}
            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-1.5 rounded-lg text-sm font-medium border border-slate-700 transition-colors"
          >
            <Archive className="w-4 h-4 text-amber-400" />
            <span>Brief Archive</span>
          </button>
        </div>

      </div>
    </header>
  );
}