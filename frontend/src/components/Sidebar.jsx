import React from 'react';

export default function Sidebar({ sessions, activeSessionId, onSelectSession, onCreateSession, onDeleteSession }) {
  return (
    <div className="w-80 glass border-r border-slate-800 flex flex-col h-full bg-slate-900/60">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-tight">Recall-GPT</h1>
          <span className="text-xs text-slate-400 font-medium">Memory-Grounded RAG</span>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4">
        <button
          onClick={onCreateSession}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary hover:bg-opacity-90 active:scale-95 transition-all text-white font-medium shadow-lg shadow-primary/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2">
        {sessions.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">No sessions yet. Click "New Chat" to begin.</div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${
                activeSessionId === session.id
                  ? 'bg-slate-800 text-white font-medium border border-slate-700 shadow-inner'
                  : 'hover:bg-slate-800/40 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <svg className="w-5 h-5 flex-shrink-0 text-slate-500 group-hover:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="truncate text-sm">{session.title}</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-opacity p-1 rounded-lg hover:bg-slate-700/50"
                title="Delete Chat"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* System Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/40 text-xs text-slate-500 flex items-center justify-between">
        <span>Vercel Stateless Mode</span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-slate-400">Online</span>
        </span>
      </div>
    </div>
  );
}
