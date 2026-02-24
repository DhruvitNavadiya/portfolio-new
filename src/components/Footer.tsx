"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, Mail, Twitter, ChevronUp } from "lucide-react";
import { useLenis } from "lenis/react";

export function Footer() {
  const lenis = useLenis();

  return (
    <footer className="relative bg-black border-t border-white/[0.05] pt-32 pb-10 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Large corner accents */}
        <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-white/10 pointer-events-none" />
        <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-white/10 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
            
            {/* ── CTA Section ── */}
            <div className="text-center mb-24 flex flex-col items-center">
              {/* Animated badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 flex items-center justify-center gap-4"
              >
                <motion.div 
                  initial={{ width: 0 }} 
                  whileInView={{ width: 48 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-px bg-gradient-to-r from-transparent to-white/30" 
                />
                <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/40 flex items-center gap-2">
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="w-1.5 h-1.5 bg-white/30 rounded-full"
                  />
                  Initiate Sequence
                  <motion.span
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="w-1.5 h-1.5 bg-white/30 rounded-full"
                  />
                </span>
                <motion.div 
                  initial={{ width: 0 }} 
                  whileInView={{ width: 48 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="h-px bg-gradient-to-l from-transparent to-white/30" 
                />
              </motion.div>

              {/* Animated heading */}
              <motion.h2 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.9]"
              >
                Let&apos;s Build The <br />
                <motion.span 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 via-white/40 to-white/10"
                >
                  Future.
                </motion.span>
              </motion.h2>

              {/* Animated description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="text-white/40 max-w-lg mx-auto mb-12 font-mono text-xs md:text-sm leading-relaxed"
              >
                Agentic architecture, scalable Python backends, and multi-model AI orchestration. 
                My console is always open for new transmissions and challenging endeavors.
              </motion.p>

              {/* Animated CTA button with glow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="relative"
              >
                {/* Glow ring behind button */}
                <div className="absolute -inset-4 bg-white/[0.03] blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <button 
                  onClick={() => lenis?.scrollTo("#contact", { duration: 1.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
                  className="group relative px-12 py-5 bg-white text-black text-[11px] font-mono tracking-[0.25em] font-bold uppercase transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] flex items-center gap-4 overflow-hidden"
                >
                  {/* Sweep effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-black/[0.06] to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
                  
                  <span className="relative z-10">Start A Project</span>
                  <ArrowUpRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                  
                  {/* Bottom line accent */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-[2px] bg-black/20"
                    initial={{ width: "0%" }}
                    whileInView={{ width: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  />
                </button>
              </motion.div>
            </div>

            {/* Personal Details Grid */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-white/[0.08] mb-8 text-center md:text-left">
              <div>
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Location</h4>
                <p className="text-sm text-white/70">Surat, India</p>
                <p className="text-xs text-white/40 mt-1">Available for Remote Work</p>
              </div>
              <div>
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Contact</h4>
                <a href="mailto:navadiyadhruvit@gmail.com" className="block text-sm text-white/70 hover:text-white transition-colors">navadiyadhruvit@gmail.com</a>
                <a href="tel:+919099645594" className="block text-sm text-white/70 hover:text-white transition-colors mt-1">+91 9099645594</a>
              </div>
              <div className="md:text-right">
                <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-3">Upwork</h4>
                <a href="https://www.upwork.com/freelancers/~01c62dbeb138533025" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors group">
                  View Freelance Profile
                  <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Bottom Footer Details */}
            <div className="w-full flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.08] gap-6">
                
                {/* Left: Status */}
                <div className="flex items-center gap-3 text-white/30 text-[10px] font-mono uppercase tracking-widest">
                  <div className="relative flex items-center justify-center w-3 h-3">
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  </div>
                  <span>System Online // © {new Date().getFullYear()} Dhruvit Navadiya</span>
                </div>

                {/* Center: Socials */}
                <div className="flex items-center gap-8">
                  <a href="https://github.com/dhruvitnavadiya" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
                    <Github className="w-4 h-4" />
                    <span className="sr-only">GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/in/dhruvit-navadiya/" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors duration-300">
                    <Linkedin className="w-4 h-4" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                  <a href="mailto:navadiyadhruvit@gmail.com" className="text-white/30 hover:text-white transition-colors duration-300">
                    <Mail className="w-4 h-4" />
                    <span className="sr-only">Email</span>
                  </a>
                </div>

                {/* Right: Back to top */}
                <button 
                  onClick={() => lenis?.scrollTo(0, { duration: 3.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
                  className="group flex flex-col items-center text-white/30 hover:text-white transition-colors duration-300"
                >
                  <div className="w-8 h-8 border border-white/10 group-hover:border-white/30 flex items-center justify-center mb-2 transition-colors">
                    <ChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                  </div>
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
                    Top
                  </span>
                </button>

            </div>
        </div>
    </footer>
  );
}
