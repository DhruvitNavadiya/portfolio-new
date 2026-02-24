// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, Send, Loader2, ExternalLink } from "lucide-react";
import { useLenis } from "lenis/react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ContactFormUI({ sendMessage }: { sendMessage: (msg: { text: string }) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (step === 0) {
    return (
      <div className="border border-white/10 p-4 bg-white/[0.03] flex flex-col gap-3 my-3 w-full backdrop-blur-sm">
        <p className="font-bold text-white/90 text-xs uppercase tracking-wider">Need to get in touch with Dhruvit?</p>
        <p className="text-[11px] font-medium text-white/50 leading-normal">I can relay your inquiry directly to his inbox.</p>
        <div className="flex gap-2.5 mt-1">
          <button onClick={() => setStep(1)} className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/80 transition-all">Yes, Connect Me</button>
          <button onClick={() => setStep(2)} className="bg-transparent border border-white/20 text-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">No, Maybe Later</button>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        sendMessage({ text: `[SYSTEM: USER SUBMITTED CONTACT FORM]\nName: ${name}\nEmail: ${email}\n\nINSTRUCTION: Please provide a professional summary of our entire conversation and then use the 'submit_contact_inquiry' tool to send this inquiry to Dhruvit.` });
        setStep(3);
      }} className="border border-white/10 p-4 bg-white/[0.03] flex flex-col gap-3 my-3 w-full backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-white/90 text-xs uppercase tracking-wider">Contact Request</p>
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-widest">Collecting details for Dhruvit</p>
        </div>
        <div className="flex flex-col gap-2.5 mt-1">
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="border border-white/10 bg-white/[0.05] p-2.5 text-xs focus:outline-none placeholder:text-white/25 font-medium text-white focus:border-white/25 transition-colors" />
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="border border-white/10 bg-white/[0.05] p-2.5 text-xs focus:outline-none placeholder:text-white/25 font-medium text-white focus:border-white/25 transition-colors" />
        </div>
        <button type="submit" className="bg-white text-black px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-white/80 transition-all mt-1">Submit To Agent</button>
      </form>
    );
  }
  if (step === 3) {
    return (
      <div className="border border-emerald-500/20 p-4 bg-emerald-500/[0.05] flex flex-col gap-2 my-3 w-full">
        <p className="font-bold text-emerald-400 text-xs uppercase tracking-wider">Submission Received ✓</p>
        <p className="text-[11px] font-medium text-emerald-300/70 leading-relaxed">Summarizing our chat and notifying Dhruvit...</p>
      </div>
    );
  }
  return null;
}

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const lenis = useLenis();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Global fetch interceptor — watches /api/chat responses for tool calls
  useEffect(() => {
    const origFetch = window.fetch;
    const processedKeys = new Set<string>();
    
    window.fetch = async function(...args: Parameters<typeof fetch>) {
      const response = await origFetch.apply(window, args);
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
      if (url.includes('/api/chat')) {
        const clone = response.clone();
        clone.text().then(text => {
          try {
            // Handle navigate_to_section
            if (text.includes('navigate_to_section')) {
              const match = text.match(/"target"\s*:\s*"([a-zA-Z_-]+)"/);
              if (match) {
                const key = `nav-${match[1]}-${text.length}`;
                if (!processedKeys.has(key)) {
                  processedKeys.add(key);
                  const target = match[1];
                  setTimeout(() => {
                    const el = document.getElementById(target);
                    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
                  }, 500);
                }
              }
            }
            // Handle open_project
            if (text.includes('open_project')) {
              const pidMatch = text.match(/"projectId"\s*:\s*"([a-zA-Z_-]+)"/);
              if (pidMatch) {
                const key = `proj-${pidMatch[1]}-${text.length}`;
                if (!processedKeys.has(key)) {
                  processedKeys.add(key);
                  const projectId = pidMatch[1];
                  setTimeout(() => {
                    const el = document.getElementById('projects');
                    if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
                  }, 300);
                  setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('select-project', { detail: { projectId } }));
                  }, 800);
                }
              }
            }
          } catch (e) { /* ignore parsing errors */ }
        }).catch(() => { /* ignore read errors */ });
      }
      return response;
    };
    return () => { window.fetch = origFetch; };
  }, []);

  const { messages, status, sendMessage } = useChat({
    api: '/api/chat',
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  const isLoading = status !== 'ready' && status !== 'error';

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  // Greeting bubble auto-dismiss
  const [showGreeting, setShowGreeting] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowGreeting(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── Floating Action Button + Greeting Bubble ── */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isOpen && showGreeting && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] px-4 py-2.5 max-w-[220px] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            >
              <p className="text-[11px] font-medium text-white/80 leading-snug">
                👋 Ask me anything about <span className="text-white font-bold">Dhruvit!</span>
              </p>
              {/* Arrow */}
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white/[0.08] border-r border-b border-white/[0.12] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setIsOpen(true); setShowGreeting(false); }}
              className="group relative flex items-center justify-center w-14 h-14 md:w-[60px] md:h-[60px] bg-[#111] border border-white/[0.1] hover:border-white/[0.2] transition-all duration-300"
              style={{ boxShadow: "0 0 25px rgba(255,255,255,0.04), 0 0 60px rgba(6,182,212,0.08)" }}
            >
              {/* Custom bot/sparkle icon */}
              <svg className="w-6 h-6 text-white/80 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.4 12.4l-.7-.7M5.6 18.4l.7-.7m12.4-12.4l-.7.7" />
                <circle cx="12" cy="12" r="4" />
                <path d="M12 8v8M8 12h8" />
              </svg>
              {/* Cyan pulse dot */}
              <div className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-50"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </div>
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
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-[calc(100vw-48px)] md:w-[420px] h-[650px] max-h-[85vh] z-[110] flex flex-col overflow-hidden font-sans border border-white/[0.08]"
            style={{ 
              background: 'linear-gradient(180deg, rgba(17,17,17,0.98) 0%, rgba(10,10,10,0.99) 100%)',
              boxShadow: "0 0 60px rgba(0,0,0,0.5), 0 0 120px rgba(6,182,212,0.03)" 
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {/* Bot icon in header */}
                <div className="flex items-center justify-center w-8 h-8 bg-white/[0.05] border border-white/[0.08]">
                  <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.4 12.4l-.7-.7M5.6 18.4l.7-.7m12.4-12.4l-.7.7" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </div>
                <div className="flex flex-col leading-none">
                  <span className="text-[13px] font-bold text-white/90 tracking-tight">
                    Dhruvit's Agent
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-cyan-400/60 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full inline-block" />
                    Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white hover:bg-white/[0.06] transition-all p-1.5 border border-transparent hover:border-white/[0.1]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <div data-lenis-prevent style={{ overscrollBehavior: 'contain', scrollBehavior: 'smooth' }} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 font-sans text-sm custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center my-auto px-6 space-y-4">
                  <div className="w-12 h-12 mx-auto border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
                    <svg className="w-6 h-6 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v1m0 16v1m-8-9H3m18 0h-1M5.6 5.6l.7.7m12.4 12.4l-.7-.7M5.6 18.4l.7-.7m12.4-12.4l-.7.7" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white/70 tracking-tight">How can I help?</h3>
                  <p className="text-[13px] font-normal text-white/30 leading-relaxed">
                    Ask about Dhruvit's projects, skills, experience, or get in touch directly.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {['Show me projects', 'Who is Dhruvit?', 'Skills & Tech'].map((q) => (
                      <button
                        key={q}
                        onClick={() => { sendMessage({ text: q }); }}
                        className="text-[10px] font-mono uppercase tracking-wider text-white/40 border border-white/[0.08] px-3 py-1.5 hover:bg-white/[0.05] hover:text-white/60 hover:border-white/[0.15] transition-all"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {messages.map((m) => {
                const isUser = m.role === 'user';
                
                // Generate fallback text for messages that only have hidden tool invocations
                let fallbackText = '';
                if (!isUser && m.parts && m.parts.length > 0) {
                  const hasText = m.parts.some((part: any) => part.type === 'text' && part.text?.trim());
                  if (!hasText) {
                    // Check which hidden tool was called to generate contextual fallback
                    const toolPart = m.parts.find((part: any) => part.type === 'tool-invocation');
                    if (toolPart) {
                      const tn = toolPart.toolInvocation?.toolName;
                      const target = toolPart.toolInvocation?.args?.target || toolPart.toolInvocation?.args?.projectId;
                      if (tn === 'navigate_to_section') {
                        fallbackText = `Scrolling to the **${target || 'section'}** for you! 🚀`;
                      } else if (tn === 'open_project') {
                        fallbackText = `Opening the **${target || 'project'}** showcase! ✨`;
                      } else if (tn === 'request_contact_approval') {
                        // Contact form renders itself, no fallback needed
                      } else {
                        fallbackText = `Done! ✓`;
                      }
                    }
                  }
                }
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={m.id} 
                    className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'} relative`}
                  >
                    <span className={`text-[9px] font-mono uppercase tracking-[0.15em] mb-1.5 px-0.5 ${isUser ? 'text-white/25' : 'text-cyan-400/50'}`}>
                      {isUser ? 'You' : 'Agent'}
                    </span>
                    
                    <div className={`p-3.5 text-[13px] leading-relaxed break-words ${
                      isUser 
                        ? 'bg-white text-black rounded-none border border-white/80' 
                        : 'bg-white/[0.04] text-white/85 border border-white/[0.06] backdrop-blur-sm'
                    }`}>
                      {/* AI SDK v6: Render from m.parts */}
                      {m.parts && m.parts.length > 0 ? (
                        <>
                          {m.parts.map((part: any, idx: number) => {
                            // Text parts
                            if (part.type === 'text' && part.text) {
                              return (
                                <div key={idx} className={`prose prose-sm max-w-none ${isUser ? 'prose-p:text-black' : 'prose-invert prose-p:text-white/85'} prose-p:leading-relaxed prose-a:font-bold prose-a:text-cyan-400 prose-ul:my-2 prose-li:my-0.5 prose-strong:text-white`}>
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {part.text}
                                  </ReactMarkdown>
                                </div>
                              );
                            }
                            // Tool invocation parts
                            if (part.type === 'tool-invocation') {
                              const toolInvoc = part.toolInvocation;
                              if (toolInvoc.toolName === 'request_contact_approval') {
                                return <ContactFormUI key={toolInvoc.toolCallId} sendMessage={sendMessage} />;
                              }
                              // Navigate & open_project tools — handled by fetch interceptor, hide from chat
                              if (toolInvoc.toolName === 'navigate_to_section' || toolInvoc.toolName === 'open_project') {
                                return null;
                              }
                              // Other tools — show status badge
                              return (
                                <div key={toolInvoc.toolCallId} className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider px-2.5 py-1.5 border border-white/[0.08] bg-white/[0.03] mb-2 text-white/50">
                                  {toolInvoc.state === 'result' ? (
                                    <span className="flex items-center gap-1.5 text-cyan-400/70">✓ {toolInvoc.toolName}</span>
                                  ) : (
                                    <span className="flex items-center gap-1.5">
                                      <Loader2 className="w-3 h-3 animate-spin text-white/30" />
                                      {toolInvoc.toolName}
                                    </span>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                          {/* Fallback text when model only sent a tool call without text */}
                          {fallbackText && (
                            <div className="prose prose-sm max-w-none prose-invert prose-p:text-white/85 prose-strong:text-white">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fallbackText}</ReactMarkdown>
                            </div>
                          )}
                        </>
                      ) : (
                        !isUser && <span className="opacity-30 text-white/50 animate-pulse text-xs">Thinking...</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {isLoading && status !== 'submitted' && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="self-start flex gap-1.5 items-center px-4 h-8 border border-white/[0.06] bg-white/[0.03]"
                 >
                   <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.3s]" />
                   <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:-0.15s]" />
                   <div className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" />
                 </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleLocalSubmit} className="p-3.5 border-t border-white/[0.06] bg-white/[0.02]">
              <div className="relative flex items-center bg-white/[0.04] border border-white/[0.08] focus-within:border-white/[0.15] transition-all focus-within:shadow-[0_0_20px_rgba(6,182,212,0.05)]">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-transparent text-white/90 text-sm font-normal focus:outline-none py-3 px-4 placeholder:text-white/20"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="mr-1.5 p-2 bg-white/[0.08] text-white/60 hover:bg-white/[0.15] hover:text-white transition-all disabled:opacity-20 disabled:hover:bg-transparent flex items-center justify-center shrink-0 border border-transparent hover:border-white/[0.1]"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
