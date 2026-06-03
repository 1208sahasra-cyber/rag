import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [stats, setStats] = useState({ documentCount: 0, feedbackCount: 0, status: "ok" });
  const [isReindexing, setIsReindexing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // 1. Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard');
      setStats({
        documentCount: res.data.documentCount ?? 0,
        feedbackCount: res.data.feedbackCount ?? 0,
        status: res.data.status ?? "ok"
      });
    } catch (err) {
      console.error("Failed to fetch dashboard statistics:", err);
      setStats(prev => ({ ...prev, status: "error" }));
    }
  };

  // 2. Load sessions from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('recall_gpt_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) {
          setActiveSessionId(parsed[0].id);
        }
      } catch (_) {}
    }
    fetchStats();
  }, []);

  // 3. Save sessions to LocalStorage on changes
  useEffect(() => {
    localStorage.setItem('recall_gpt_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Session handlers
  const handleCreateSession = () => {
    const newSession = {
      id: crypto.randomUUID(),
      title: `Session ${sessions.length + 1}`,
      messages: []
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const handleSelectSession = (id) => {
    setActiveSessionId(id);
  };

  // 4. Send query to chat API
  const handleSendMessage = async (text) => {
    if (!activeSessionId) return;
    setIsSending(true);

    // Add immediate user bubble
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [...s.messages, { text }]
        };
      }
      return s;
    });
    setSessions(updatedSessions);

    // Build simple history (excluding citations/feedback helper details)
    const activeSession = sessions.find(s => s.id === activeSessionId);
    const history = (activeSession?.messages || []).map(m => ({
      role: m.answer ? "assistant" : "user",
      content: m.answer || m.text
    }));

    try {
      const res = await axios.post('/api/chat', {
        message: text,
        history
      });

      // Update session with model response
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          // Set session title dynamically to first query if it was default title
          const title = s.title.startsWith("Session ") && s.messages.length === 0
            ? (text.length > 30 ? text.substring(0, 27) + "..." : text)
            : s.title;

          return {
            ...s,
            title,
            messages: s.messages.map((m, idx) => {
              // Append answer to the last user message
              if (idx === s.messages.length - 1) {
                return {
                  ...m,
                  question: text,
                  answer: res.data.answer,
                  citations: res.data.citations,
                  feedback_optimized: res.data.feedback_optimized
                };
              }
              return m;
            })
          };
        }
        return s;
      }));
    } catch (err) {
      console.error("Chat error:", err);
      // Append error message block
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map((m, idx) => {
              if (idx === s.messages.length - 1) {
                return {
                  ...m,
                  answer: "Could not retrieve answer. Check if backend and Chroma DB are online.",
                  citations: []
                };
              }
              return m;
            })
          };
        }
        return s;
      }));
    } finally {
      setIsSending(false);
    }
  };

  // 5. Send rating/feedback to logFeedback API
  const handleSendFeedback = async ({ question, answer, rating, correctedAnswer }) => {
    try {
      await axios.post('/api/feedback', {
        question,
        answer,
        rating,
        correctedAnswer
      });
      fetchStats(); // Update feedback loop count on dashboard
    } catch (err) {
      console.error("Failed to post feedback:", err);
    }
  };

  // 6. Ingest documents and refresh indices
  const handleReindex = async () => {
    setIsReindexing(true);
    try {
      await axios.post('/api/reindex');
      await fetchStats();
    } catch (err) {
      console.error("Re-indexing failed:", err);
    } finally {
      setIsReindexing(false);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 font-sans">
      {/* Sidebar (Stateful Sessions) */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onCreateSession={handleCreateSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full p-8 overflow-hidden">
        {/* Dashboard Status Summary */}
        <Dashboard
          stats={stats}
          isReindexing={isReindexing}
          onReindex={handleReindex}
        />

        {/* Chat window viewport */}
        <div className="flex-1 min-h-0 bg-slate-900/20 glass border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
          {activeSessionId ? (
            <ChatWindow
              messages={activeSession?.messages || []}
              onSendMessage={handleSendMessage}
              isSending={isSending}
              onSendFeedback={handleSendFeedback}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 animate-pulse">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-300">Select or Start a Conversation</h2>
              <p className="text-xs text-slate-500 max-w-sm text-center leading-relaxed">
                Choose a session from the sidebar or click "New Chat" to begin questioning your files.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
