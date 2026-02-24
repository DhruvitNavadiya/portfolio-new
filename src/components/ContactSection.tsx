"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    // Web3Forms requires the browser context to pass Cloudflare bot detection.
    // The access key is considered a public routing key, not a secret password.
    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "f076f953-b308-4a94-8c10-a73881584951");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        console.error("Form submission failed", data);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="relative bg-[#111111] py-24 md:py-32 border-t border-white/[0.05] overflow-hidden min-h-screen flex flex-col items-center justify-center">
      
      {/* ── Background & Decorations Wrapper ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Background Grid & Noise */}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
        }} />

        {/* Accent Corners */}
        <div className="absolute top-4 left-4 md:top-10 md:left-10 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-4 right-4 md:top-10 md:right-10 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-white/10" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center max-w-[100vw]">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-6 pointer-events-none">
          <motion.span
            className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            007 / Transmission
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/10">Contact</span>
          </motion.h2>
          
          <motion.p
            className="text-white/40 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Open a direct secure channel to my inbox. I typically respond within 12 hours.
          </motion.p>
        </div>

        {/* ── Terminal Form Container ── */}
        <motion.div 
          className="relative w-[95%] md:w-[80%] lg:w-[60%] max-w-[800px] mx-auto border border-white/[0.15] bg-[#050505] p-6 md:p-12 shadow-[inset_0_0_20px_rgba(255,255,255,0.01),0_10px_30px_rgba(0,0,0,0.5)] md:shadow-[inset_0_0_40px_rgba(255,255,255,0.02),0_20px_40px_rgba(0,0,0,0.5)] rounded-none"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.2] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          
          {/* ── Thematic Developer Decorations ── */}
          <div className="absolute top-0 left-0 w-4 h-4 md:w-8 md:h-8 border-t-2 border-l-2 border-white/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-4 h-4 md:w-8 md:h-8 border-t-2 border-r-2 border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-4 h-4 md:w-8 md:h-8 border-b-2 border-l-2 border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-4 h-4 md:w-8 md:h-8 border-b-2 border-r-2 border-white/20 pointer-events-none" />
          
          <div className="absolute top-4 left-4 md:left-6 text-white/30 font-mono text-[8px] md:text-[10px] uppercase tracking-widest pointer-events-none flex items-center gap-2">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            SECURE_CHANNEL_OPEN
          </div>

          {submitStatus === "success" ? (
            <motion.div 
              className="relative z-10 flex flex-col items-center justify-center min-h-[350px] font-mono text-center gap-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <motion.div 
                  className="w-16 h-16 rounded-full border border-green-500/50 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                  <motion.svg 
                    className="w-8 h-8 text-green-400" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </motion.svg>
                </motion.div>
                <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
              </div>

              <div>
                <motion.h3 
                  className="text-xl md:text-2xl font-bold text-white uppercase tracking-widest mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Message Sent
                </motion.h3>
                <motion.p 
                  className="text-white/40 text-sm md:text-base"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  Thank you for reaching out.
                  <br />
                  I'll get back to you shortly!
                </motion.p>
              </div>
              
              <motion.button
                onClick={() => setSubmitStatus("idle")}
                className="mt-4 text-[10px] text-white/30 uppercase tracking-widest hover:text-white/70 transition-colors"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                [ Send Another Message ]
              </motion.button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 mt-8 md:mt-12 flex flex-col gap-6 font-mono">
              {/* Hidden honeypot to prevent spam */}
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />

              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="name" className="text-[10px] text-white/40 uppercase tracking-widest">{">"} {">"} Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    id="name" 
                    required 
                    placeholder="John Doe"
                    disabled={isSubmitting}
                    className="bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/[0.02] transition-colors disabled:opacity-50"
                  />
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label htmlFor="email" className="text-[10px] text-white/40 uppercase tracking-widest">{">"} {">"} Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    required 
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    className="bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/[0.02] transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-[10px] text-white/40 uppercase tracking-widest">{">"} {">"} Payload (Message)</label>
                <textarea 
                  name="message" 
                  id="message" 
                  required 
                  rows={5}
                  placeholder="What are we building?"
                  disabled={isSubmitting}
                  className="bg-black/50 border border-white/10 rounded-none px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/[0.02] transition-colors resize-none disabled:opacity-50"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 relative group overflow-hidden bg-white text-black font-semibold text-sm uppercase tracking-widest py-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? "TRANSMITTING..." : "EXECUTE_SEND"}
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              </button>

              {submitStatus === "error" && (
                <p className="text-red-400 text-xs text-center mt-2 animate-pulse">{">"} {">"} Error sequence. Transmission failed.</p>
              )}
            </form>
          )}

        </motion.div>
      </div>
    </section>
  );
}
