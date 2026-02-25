// @ts-nocheck
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2 } from "lucide-react";
import { useLenis } from "lenis/react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ── Contact Form UI (fallback if agent shows form) ── */
function ContactFormUI({ sendMessage }: { sendMessage: (msg: { text: string }) => void }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  if (step === 0) {
    return (
      <div className="border border-white/10 p-4 bg-white/[0.03] flex flex-col gap-3 my-3 w-full backdrop-blur-sm">
        <p className="font-bold text-white/90 text-sm uppercase tracking-wider">Need to get in touch with Dhruvit?</p>
        <p className="text-[13px] font-medium text-white/50 leading-normal">I can relay your inquiry directly to his inbox.</p>
        <div className="flex gap-2.5 mt-1">
          <button onClick={() => setStep(1)} className="bg-white text-black px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-white/80 transition-all">Yes, Connect Me</button>
          <button onClick={() => setStep(2)} className="bg-transparent border border-white/20 text-white/60 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">No, Maybe Later</button>
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
          <p className="font-bold text-white/90 text-sm uppercase tracking-wider">Contact Request</p>
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest">Collecting details for Dhruvit</p>
        </div>
        <div className="flex flex-col gap-2.5 mt-1">
          <input required value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" className="border border-white/10 bg-white/[0.05] p-3 text-sm focus:outline-none placeholder:text-white/25 font-medium text-white focus:border-white/25 transition-colors" />
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="border border-white/10 bg-white/[0.05] p-3 text-sm focus:outline-none placeholder:text-white/25 font-medium text-white focus:border-white/25 transition-colors" />
        </div>
        <button type="submit" className="bg-white text-black px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:bg-white/80 transition-all mt-1">Submit To Agent</button>
      </form>
    );
  }
  if (step === 3) {
    return (
      <div className="border border-emerald-500/20 p-4 bg-emerald-500/[0.05] flex flex-col gap-2 my-3 w-full">
        <p className="font-bold text-emerald-400 text-sm uppercase tracking-wider">Submission Received ✓</p>
        <p className="text-[13px] font-medium text-emerald-300/70 leading-relaxed">Summarizing our chat and notifying Dhruvit...</p>
      </div>
    );
  }
  return null;
}

/* ── Contact Submitter (browser-side Web3Forms call) ── */
function ContactSubmitter({ data }: { data: any }) {
  const [status, setStatus] = useState<'sending' | 'success' | 'error'>('sending');

  useEffect(() => {
    if (!data?.name || !data?.email) { setStatus('error'); return; }
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        access_key: "f076f953-b308-4a94-8c10-a73881584951",
        name: data.name,
        email: data.email,
        message: data.message || "Contact request via AI Assistant",
        subject: data.subject || `[AI Assistant] Inquiry from ${data.name}`,
      }),
    })
      .then(r => r.json())
      .then(res => setStatus(res.success ? 'success' : 'error'))
      .catch(() => setStatus('error'));
  }, []);

  if (status === 'sending') {
    return (
      <div className="flex items-center gap-2.5 text-[12px] font-mono uppercase text-white/40 py-2 my-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Sending to Dhruvit...
      </div>
    );
  }
  return (
    <div className={`border p-4 my-2 ${status === 'success' ? 'border-emerald-500/20 bg-emerald-500/[0.05]' : 'border-red-500/20 bg-red-500/[0.05]'}`}>
      <p className={`text-sm font-bold uppercase tracking-wider ${status === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
        {status === 'success' ? '✓ Message Sent to Dhruvit!' : '✗ Failed to Send'}
      </p>
      <p className={`text-[13px] mt-1.5 ${status === 'success' ? 'text-emerald-300/60' : 'text-red-300/60'}`}>
        {status === 'success' ? "He'll get back to you soon." : 'Please try again later.'}
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
/*                   MAIN COMPONENT                    */
/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const lenis = useLenis();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /* ── Fetch interceptor — watches SSE for tool actions ── */
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
                  const sectionId = match[1];
                  if (lenis) {
                    const el = document.getElementById(sectionId);
                    if (el) {
                      setTimeout(() => lenis.scrollTo(el, { offset: -80, duration: 1.2 }), 300);
                    }
                  } else {
                    const el = document.getElementById(sectionId);
                    if (el) setTimeout(() => window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' }), 300);
                  }
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
            // Handle submit_contact — browser-side Web3Forms call
            if (text.includes('"action":"submit_contact"') || text.includes('"action": "submit_contact"')) {
              const nameMatch = text.match(/"name"\s*:\s*"([^"]+)"/);
              const emailMatch = text.match(/"email"\s*:\s*"([^"]+)"/);
              const msgMatch = text.match(/"message"\s*:\s*"([^"]+)"/);
              const subjMatch = text.match(/"subject"\s*:\s*"([^"]+)"/);
              if (nameMatch && emailMatch) {
                const key = `contact-${emailMatch[1]}-${text.length}`;
                if (!processedKeys.has(key)) {
                  processedKeys.add(key);
                  console.log('[CONTACT] Submitting from browser:', nameMatch[1], emailMatch[1]);
                  origFetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "Accept": "application/json" },
                    body: JSON.stringify({
                      access_key: "f076f953-b308-4a94-8c10-a73881584951",
                      name: nameMatch[1],
                      email: emailMatch[1],
                      message: msgMatch?.[1] || "Contact request via AI Assistant",
                      subject: subjMatch?.[1] || `[AI Assistant] Inquiry from ${nameMatch[1]}`,
                    }),
                  })
                    .then(r => r.json())
                    .then(res => {
                      console.log('[CONTACT] Web3Forms result:', res);
                      if (res.success) {
                        window.dispatchEvent(new CustomEvent('agent-contact-submitted', {
                          detail: { name: nameMatch[1], email: emailMatch[1], message: msgMatch?.[1] || '' }
                        }));
                        setTimeout(() => {
                          const el = document.getElementById('contact');
                          if (el) window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
                        }, 500);
                      }
                    })
                    .catch(err => console.error('[CONTACT] Browser fetch failed:', err));
                }
              }
            }
          } catch (e) { /* ignore parsing errors */ }
        }).catch(() => { /* ignore read errors */ });
      }
      return response;
    };

    return () => { window.fetch = origFetch; };
  }, [lenis]);

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

  /* ━━━━━━━━━━━━━━━ RENDER ━━━━━━━━━━━━━━━ */
  return (
    <>
      {/* ── Floating Action Button + Greeting ── */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] flex flex-col items-end gap-3">
        <AnimatePresence>
          {!isOpen && showGreeting && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative bg-[#1a1a1a]/90 backdrop-blur-xl border border-white/[0.12] px-5 py-3 max-w-[240px] shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
            >
              <p className="text-[13px] font-medium text-white/80 leading-snug">
                👋 Ask me anything about <span className="text-white font-bold">Dhruvit!</span>
              </p>
              <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-[#1a1a1a]/90 border-r border-b border-white/[0.12] rotate-45" />
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
              whileTap={{ scale: 0.93 }}
              onClick={() => { setIsOpen(true); setShowGreeting(false); }}
              className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-[#0d0d0d] border border-white/[0.12] hover:border-white/25 transition-all duration-300"
              style={{ boxShadow: "0 0 30px rgba(6,182,212,0.08), 0 0 60px rgba(6,182,212,0.04)" }}
            >
              <svg className="w-7 h-7 text-white/70 group-hover:text-cyan-400 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.4" />
              </svg>
              <div className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Chat Console Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-[calc(100vw-48px)] md:w-[460px] h-[700px] max-h-[85vh] z-[110] flex flex-col overflow-hidden font-sans border border-white/[0.1]"
            style={{ 
              background: 'linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(8,8,8,0.99) 100%)',
              boxShadow: "0 0 80px rgba(0,0,0,0.5), 0 0 120px rgba(6,182,212,0.04), inset 0 1px 0 rgba(255,255,255,0.04)" 
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-gradient-to-r from-white/[0.02] to-transparent">
              <div className="flex items-center gap-3.5">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-white/[0.06] to-transparent border border-white/[0.1]">
                  <svg className="w-5 h-5 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-white/90 tracking-tight">
                    NEXUS
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
                    Online
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white hover:bg-white/[0.08] transition-all p-2 border border-transparent hover:border-white/[0.1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ── Messages Area ── */}
            <div data-lenis-prevent style={{ overscrollBehavior: 'contain', scrollBehavior: 'smooth' }} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 text-sm custom-scrollbar">
              {/* Empty State */}
              {messages.length === 0 && (
                <div className="text-center my-auto px-4 space-y-5">
                  <div className="w-14 h-14 mx-auto border border-white/[0.08] bg-gradient-to-br from-white/[0.04] to-transparent flex items-center justify-center">
                    <svg className="w-7 h-7 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white/80 tracking-tight">How can I help?</h3>
                    <p className="text-sm text-white/35 leading-relaxed mt-1.5">
                      Ask about Dhruvit&apos;s projects, skills, experience, or get in touch directly.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {['Show me projects', 'Who is Dhruvit?', 'Skills & Tech'].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage({ text: q })}
                        className="text-[11px] font-mono uppercase tracking-wider text-white/40 border border-white/[0.08] px-4 py-2 hover:bg-white/[0.06] hover:text-white/70 hover:border-white/[0.2] transition-all duration-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* ── Message Bubbles ── */}
              {messages.map((m) => {
                const isUser = m.role === 'user';
                
                // Fallback text for tool-only messages
                let fallbackText = '';
                if (!isUser && m.parts && m.parts.length > 0) {
                  const hasText = m.parts.some((part: any) => part.type === 'text' && part.text?.trim());
                  if (!hasText) {
                    const toolPart = m.parts.find((part: any) => part.type === 'tool-invocation');
                    if (toolPart) {
                      const tn = toolPart.toolInvocation?.toolName;
                      const target = toolPart.toolInvocation?.args?.target || toolPart.toolInvocation?.args?.projectId;
                      if (tn === 'navigate_to_section') fallbackText = `Scrolling to the **${target || 'section'}** for you! 🚀`;
                      else if (tn === 'open_project') fallbackText = `Opening the **${target || 'project'}** showcase! ✨`;
                      else if (tn !== 'request_contact_approval') fallbackText = `Done! ✓`;
                    }
                  }
                }
                
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={m.id} 
                    className={`flex flex-col max-w-[85%] ${isUser ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    <span className={`text-[11px] font-mono uppercase tracking-[0.15em] mb-2 px-0.5 ${isUser ? 'text-white/25' : 'text-white/35'}`}>
                      {isUser ? 'You' : 'Agent'}
                    </span>
                    
                    <div className={`px-4 py-3 text-[14px] leading-relaxed break-words ${
                      isUser 
                        ? 'bg-white text-black border border-white/80' 
                        : 'bg-white/[0.04] text-white/90 border border-white/[0.08] backdrop-blur-sm'
                    }`}>
                      {m.parts && m.parts.length > 0 ? (
                        <>
                          {m.parts.map((part: any, idx: number) => {
                            if (part.type === 'text' && part.text) {
                              return (
                                <div key={idx} className={`prose prose-sm max-w-none ${isUser ? 'prose-p:text-black' : 'prose-invert prose-p:text-white/90'} prose-p:leading-relaxed prose-p:text-[14px] prose-a:font-bold prose-a:text-white prose-ul:my-2 prose-li:my-0.5 prose-strong:text-white prose-headings:text-white/90`}>
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {part.text}
                                  </ReactMarkdown>
                                </div>
                              );
                            }
                            if (part.type === 'tool-invocation') {
                              const toolInvoc = part.toolInvocation;
                              if (toolInvoc.toolName === 'request_contact_approval') {
                                return <ContactFormUI key={toolInvoc.toolCallId} sendMessage={sendMessage} />;
                              }
                              if (toolInvoc.toolName === 'submit_contact_inquiry' && toolInvoc.state === 'result') {
                                return <ContactSubmitter key={toolInvoc.toolCallId} data={toolInvoc.result} />;
                              }
                              if (toolInvoc.toolName === 'submit_contact_inquiry') {
                                return (
                                  <div key={toolInvoc.toolCallId} className="flex items-center gap-2.5 text-[12px] font-mono uppercase text-white/40 py-2">
                                    <Loader2 className="w-4 h-4 animate-spin" /> Preparing...
                                  </div>
                                );
                              }
                              if (toolInvoc.toolName === 'navigate_to_section' || toolInvoc.toolName === 'open_project') return null;
                              // Other tools — status badge
                              return (
                                <div key={toolInvoc.toolCallId} className="flex items-center gap-2.5 text-[11px] font-mono uppercase tracking-wider px-3 py-2 border border-white/[0.08] bg-white/[0.03] mb-2 text-white/50">
                                  {toolInvoc.state === 'result' ? (
                                    <span className="flex items-center gap-2 text-white/60">✓ {toolInvoc.toolName}</span>
                                  ) : (
                                    <span className="flex items-center gap-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-white/30" />{toolInvoc.toolName}</span>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                          {fallbackText && (
                            <div className="prose prose-sm max-w-none prose-invert prose-p:text-white/90 prose-p:text-[14px] prose-strong:text-white">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fallbackText}</ReactMarkdown>
                            </div>
                          )}
                        </>
                      ) : (
                        !isUser && <span className="text-white/40 animate-pulse text-[13px]">Thinking...</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Typing indicator — shown from submit until response completes */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="self-start"
                >
                  <span className="text-[11px] font-mono uppercase tracking-[0.15em] mb-2 px-0.5 text-white/35 block">Agent</span>
                  <div className="flex gap-1.5 items-center px-4 py-3 border border-white/[0.08] bg-white/[0.03]">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                    <span className="text-[11px] font-mono text-white/20 ml-2 uppercase tracking-wider">Thinking</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* ── Input Area ── */}
            <form onSubmit={handleLocalSubmit} className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
              <div className="relative flex items-center bg-white/[0.04] border border-white/[0.1] focus-within:border-white/[0.25] transition-all duration-300 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.06)]">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full bg-transparent text-white/90 text-[14px] font-normal focus:outline-none py-3.5 px-4 placeholder:text-white/25"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="mr-2 p-2.5 bg-white/[0.08] text-white/60 hover:bg-cyan-400/[0.2] hover:text-cyan-400 transition-all duration-200 disabled:opacity-20 disabled:hover:bg-transparent flex items-center justify-center shrink-0 border border-white/[0.1] hover:border-white/[0.25]"
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
