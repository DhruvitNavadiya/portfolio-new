// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, Send, Loader2 } from "lucide-react";
import { useLenis } from "lenis/react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const lenis = useLenis();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, status, sendMessage } = useChat({
    api: '/api/chat',
    onToolCall({ toolCall }) {
      // Intercept tool calls on the frontend to execute visual/local actions
      if (toolCall.toolName === 'navigate_to_section') {
        const { target } = toolCall.args as { target: string };
        lenis?.scrollTo(`#${target}`, { duration: 2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    },
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  console.log("MESSAGES STATE:", messages);

  const isLoading = status !== 'ready' && status !== 'error';

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ role: 'user', content: input });
    setInput('');
  };

  return (
    <>
      {/* ── Trigger Button ── */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100]">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-black border border-white/20 rounded-none shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300 overflow-hidden"
            >
              {/* Spinning background rings */}
              <div className="absolute inset-0 border border-white/5 group-hover:border-emerald-500/20 rounded-full scale-150 animate-[spin_10s_linear_infinite]" />
              <div className="absolute inset-0 border border-white/5 group-hover:border-emerald-500/20 rounded-full scale-110 animate-[spin_7s_linear_infinite_reverse]" />
              
              <Terminal className="w-6 h-6 text-white/70 group-hover:text-emerald-400 transition-colors relative z-10" />
              
              {/* Online Pulse */}
              <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping opacity-50 z-20" />
              <div className="absolute top-3 right-3 w-1 h-1 bg-emerald-400 rounded-full z-20" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat Console Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-[calc(100vw-48px)] md:w-[400px] h-[600px] max-h-[85vh] z-[110] flex flex-col bg-black/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-2 h-2">
                  <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40" />
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/70">
                  System.AI // Active
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1 bg-white/5 hover:bg-red-500/20 rounded-none border border-transparent hover:border-red-500/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div data-lenis-prevent style={{ overscrollBehavior: 'contain', scrollBehavior: 'smooth' }} className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar font-mono text-sm">
              {messages.length === 0 && (
                <div className="text-center my-auto px-6 text-white/30 space-y-4">
                  <Terminal className="w-8 h-8 opacity-20 mx-auto" />
                  <p>Initializing secure channel to standard user...</p>
                  <p className="text-xs">Ask me about Dhruvit's work, schedule a meeting, or send him a message directly.</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex flex-col max-w-[90%] ${m.role === 'user' ? 'self-end items-end' : 'self-start items-start'} relative`}
                >
                  <span className={`text-[9px] uppercase tracking-widest mb-1 opacity-40 ${m.role === 'user' ? 'text-right' : 'text-emerald-400'}`}>
                    {m.role === 'user' ? 'Guest_User' : 'Agent.exe'}
                  </span>
                  
                  <div className={`p-3 border leading-relaxed break-words relative overflow-hidden ${
                    m.role === 'user' 
                      ? 'bg-white/5 border-white/10 text-white/90 rounded-l-lg rounded-tr-lg' 
                      : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300 rounded-r-lg rounded-bl-lg'
                  }`}>
                    {m.role !== 'user' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50" />}
                    
                    {/* Tool Invocation UI */}
                    {m.toolInvocations && m.toolInvocations.map((toolInvoc) => (
                      <div key={toolInvoc.toolCallId} className="flex items-center gap-2 text-[10px] text-emerald-500/60 bg-black/40 px-2 py-1.5 border border-emerald-500/10 mb-2">
                        {toolInvoc.state === 'result' ? (
                           <span className="text-emerald-400">✓ Executed: {toolInvoc.toolName}</span>
                        ) : (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Executing sequence: {toolInvoc.toolName}...</span>
                          </>
                        )}
                      </div>
                    ))}
                    
                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-snug prose-ul:my-1 prose-li:my-0">
                      {(() => {
                        // Prefer m.parts (updates live during streaming) over m.content (only set after completion)
                        const partsText = m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
                        const displayText = partsText || m.content || '';
                        
                        if (displayText) {
                          return (
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {displayText}
                            </ReactMarkdown>
                          );
                        }
                        return <span className="opacity-50 italic">Receiving transmission...</span>;
                      })()}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="self-start flex gap-1 items-center px-4 h-8">
                   <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-bounce" />
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleLocalSubmit} className="p-4 border-t border-white/10 bg-black relative">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
              <div className="relative flex items-center bg-white/[0.03] border border-white/10 focus-within:border-emerald-500/50 focus-within:bg-emerald-950/10 transition-colors p-1 pl-3 font-mono">
                <span className="text-emerald-500/50 mr-2">{'>'}</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command..."
                  className="w-full bg-transparent text-white/90 text-sm focus:outline-none py-2 placeholder:text-white/20"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="p-2.5 bg-white/5 text-white/50 hover:bg-emerald-500 hover:text-black transition-colors disabled:opacity-50 disabled:hover:bg-white/5 disabled:hover:text-white/50 ml-2"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
