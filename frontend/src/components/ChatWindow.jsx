import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function ChatWindow({ messages, onSendMessage, isSending, onSendFeedback }) {
  const [input, setInput] = useState("");
  const [feedbackTargetMessage, setFeedbackTargetMessage] = useState(null); // Message object that user wants to correct
  const [correctedText, setCorrectedText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState({}); // messageIndex -> status (e.g. 'liked', 'disliked', 'submitted')
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleRating = async (index, msg, rating) => {
    if (rating === 5) {
      // Direct post positive feedback
      setFeedbackStatus(prev => ({ ...prev, [index]: 'liked' }));
      await onSendFeedback({
        question: msg.question,
        answer: msg.answer,
        rating: 5
      });
    } else {
      // Disliked: Open correction input
      setFeedbackTargetMessage({ index, ...msg });
      setCorrectedText(msg.answer); // preload with original answer for editing
    }
  };

  const submitCorrection = async () => {
    if (!feedbackTargetMessage) return;
    const { index, question, answer } = feedbackTargetMessage;
    setFeedbackStatus(prev => ({ ...prev, [index]: 'corrected' }));
    await onSendFeedback({
      question,
      answer,
      rating: 1,
      correctedAnswer: correctedText.trim()
    });
    setFeedbackTargetMessage(null);
    setCorrectedText("");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/20 relative">
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm font-medium">Ask questions grounded in your document library.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="space-y-4 animate-fadeIn">
              {/* User message */}
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl px-5 py-3 bg-primary text-white shadow-lg shadow-primary/10">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>

              {/* Bot response */}
              {msg.answer && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-2xl px-6 py-4 glass bg-slate-900/40 border border-slate-800 shadow-md">
                    {/* Badge row */}
                    {msg.feedback_optimized && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                        <span>Feedback Loops Adapted</span>
                      </span>
                    )}

                    {/* Answer text */}
                    <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">{msg.answer}</p>

                    {/* Citations block */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-800/80">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Sources</span>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((cit, cIdx) => (
                            <div key={cIdx} className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
                              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="font-medium max-w-[120px] truncate">{cit.file_name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Feedback and rating actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs text-slate-500">
                      <span>Was this helpful?</span>
                      <div className="flex items-center space-x-2">
                        {feedbackStatus[idx] === 'liked' ? (
                          <span className="text-emerald-400 font-medium flex items-center space-x-1">
                            <span>👍 Liked</span>
                          </span>
                        ) : feedbackStatus[idx] === 'corrected' ? (
                          <span className="text-purple-400 font-medium flex items-center space-x-1">
                            <span>✍️ Correction Submitted</span>
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleRating(idx, msg, 5)}
                              className="p-1 rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors"
                              title="Yes, accurate and helpful"
                            >
                              👍
                            </button>
                            <button
                              onClick={() => handleRating(idx, msg, 1)}
                              className="p-1 rounded hover:bg-slate-800 hover:text-rose-400 transition-colors"
                              title="No, needs correction"
                            >
                              👎
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex justify-start animate-pulse">
            <div className="rounded-2xl px-6 py-4 glass bg-slate-900/30 border border-slate-800/50 flex items-center space-x-3">
              <LoadingSpinner size="sm" />
              <span className="text-xs text-slate-400">Recall-GPT is synthesizing context...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <form onSubmit={handleSubmit} className="p-6 border-t border-slate-800 bg-slate-900/40">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isSending ? "Synthesizing answer..." : "Ask about your document library..."}
            disabled={isSending}
            className="w-full pl-6 pr-16 py-4 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder-slate-500 text-sm disabled:opacity-65"
          />
          <button
            type="submit"
            disabled={!input.trim() || isSending}
            className="absolute right-3.5 p-2.5 rounded-lg bg-primary hover:bg-opacity-90 active:scale-95 text-white disabled:opacity-40 disabled:scale-100 transition-all shadow-md shadow-primary/25"
          >
            <svg className="w-5 h-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>

      {/* Adaptive ICL Loop / Correction Modal */}
      {feedbackTargetMessage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass bg-slate-900 p-6 rounded-2xl w-full max-w-lg border border-slate-800 shadow-2xl space-y-4 animate-scaleUp">
            <div>
              <h3 className="text-base font-bold text-white">Correct Response Memory</h3>
              <p className="text-xs text-slate-400">Help Recall-GPT adapt. Correct this response to store it in feedback loop memory.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Question</label>
              <div className="p-3 bg-slate-950/65 rounded-xl border border-slate-800 text-xs text-slate-300">
                {feedbackTargetMessage.question}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Provide Correct Answer</label>
              <textarea
                value={correctedText}
                onChange={(e) => setCorrectedText(e.target.value)}
                rows={5}
                className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-purple-500 focus:outline-none text-xs text-slate-200"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setFeedbackTargetMessage(null)}
                className="px-4 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-xs font-medium text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={submitCorrection}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-xs font-medium text-white shadow-lg shadow-purple-600/10"
              >
                Save to Loop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
