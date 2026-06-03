import React from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function Dashboard({ stats, isReindexing, onReindex }) {
  const isOnline = stats.status === "ok";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadeIn">
      {/* Stat Card 1: Documents */}
      <div className="glass p-6 bg-slate-900/40 relative overflow-hidden flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-400 font-medium text-sm">Ingested Documents</span>
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-white mt-2">
          {stats.documentCount !== undefined ? stats.documentCount : "--"}
        </div>
      </div>

      {/* Stat Card 2: Feedback Pairings */}
      <div className="glass p-6 bg-slate-900/40 relative overflow-hidden flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-400 font-medium text-sm">Adaptive Feedback Pairs</span>
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
        </div>
        <div className="text-3xl font-bold text-white mt-2">
          {stats.feedbackCount !== undefined ? stats.feedbackCount : "--"}
        </div>
      </div>

      {/* Stat Card 3: ChromaDB Status */}
      <div className="glass p-6 bg-slate-900/40 relative overflow-hidden flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-400 font-medium text-sm">ChromaDB Status</span>
          <div className={`p-2 rounded-lg ${isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
          <span className="text-lg font-semibold text-white">{isOnline ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      {/* Control Card: Re-index Button */}
      <div className="glass p-6 bg-slate-900/40 relative overflow-hidden flex flex-col justify-between h-32 hover:translate-y-[-2px] transition-transform duration-300">
        <div className="flex justify-between items-start">
          <span className="text-slate-400 font-medium text-sm">Database Sync</span>
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
            </svg>
          </div>
        </div>
        <button
          onClick={onReindex}
          disabled={isReindexing}
          className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 transition-all text-white font-medium text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10"
        >
          {isReindexing ? (
            <>
              <LoadingSpinner size="sm" className="border-white" />
              <span>Indexing...</span>
            </>
          ) : (
            <span>Re-index Documents</span>
          )}
        </button>
      </div>
    </div>
  );
}
