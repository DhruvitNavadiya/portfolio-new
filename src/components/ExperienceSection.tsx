"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, Building2, Terminal } from "lucide-react";

/* ================================================================== */
/*  EXPERIENCE DATA                                                    */
/* ================================================================== */
const EXPERIENCES = [
  {
    company: "Nextbase Solutions",
    role: "AI Automation Engineer",
    date: "May 2025 — Present",
    location: "Surat, India",
    icon: Terminal,
    description:
      "Leading design and implementation of agentic AI platforms for media automation, website generation, and workflow orchestration. Built asynchronous Python backends managing long-running AI jobs and integrated multi-provider LLMs.",
    skills: ["AsyncIO", "WebSockets", "Multi-Agent Systems", "AWS S3 / R2"],
  },
  {
    company: "Stypix",
    role: "Virtual AI Engineering Intern",
    date: "Jan 2025 — May 2025",
    location: "Remote",
    icon: Building2,
    description:
      "Focused on LLM API experimentation, RAG, and structured prompt engineering. Designed prototype AI agents for task execution flows and validated complex output schemas for reliability.",
    skills: ["RAG Systems", "Vector DBs", "Structured Prompts", "LLM APIs"],
  },
  {
    company: "Coderbabu Infotech",
    role: "AI & Backend Developer",
    date: "Jan 2023 — Apr 2025",
    location: "Surat, India",
    icon: Briefcase,
    description:
      "Backend developer focused on automation systems and API infrastructure. Developed REST APIs, designed modular architectures, and integrated PostgreSQL/Redis to improve internal workflow efficiency.",
    skills: ["FastAPI", "Flask", "PostgreSQL", "Redis", "CI/CD"],
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function ExperienceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-[#111111] py-20 md:py-24 border-t border-white/[0.05]">
      
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
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
        }} />

        {/* Accent Corners */}
        <div className="absolute top-4 left-4 md:top-10 md:left-10 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-4 right-4 md:top-10 md:right-10 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-white/10" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12">
        
        {/* ── Section Header (Matching Projects Layout) ─────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <motion.span
              className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/25 block mb-3"
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              005 / Logbook
            </motion.span>

            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease }}
            >
              Professional
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 via-white/50 to-white/20"
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.8, ease }}
              >
                {" "}Experience
              </motion.span>
            </motion.h2>
          </div>

          <motion.p
            className="text-white/30 text-sm max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            A scrollable ledger of my architectural roles and engineering history.
          </motion.p>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-16"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.2, duration: 1, ease }}
        />

        {/* ── Stacking Cards Container ──────────────────────────────── */}
        <div className="relative pb-32 max-w-5xl mx-auto">
          
          {/* Side Accents (Hidden on mobile) */}
          <div className="absolute top-0 bottom-0 -left-12 lg:-left-24 w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent hidden md:block" />
          <div className="absolute top-0 bottom-0 -right-12 lg:-right-24 w-px bg-gradient-to-b from-transparent via-white/[0.05] to-transparent hidden md:block" />
          
          <div className="absolute top-1/4 -left-16 lg:-left-32 hidden md:block">
            <span className="text-[10px] font-mono text-white/10 tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Execution
            </span>
            <div className="w-px h-16 bg-white/10 mx-auto mt-4" />
          </div>

          <div className="absolute top-2/4 -right-16 lg:-right-32 hidden md:block">
            <div className="w-px h-16 bg-white/10 mx-auto mb-4" />
            <span className="text-[10px] font-mono text-white/10 tracking-[0.3em] uppercase" style={{ writingMode: 'vertical-rl' }}>
              Historical
            </span>
          </div>

          {EXPERIENCES.map((exp, i) => {
            const isLast = i === EXPERIENCES.length - 1;
            
            return (
              <React.Fragment key={i}>
                <div 
                  className="sticky w-full"
                  style={{ 
                    // Higher index cards stick lower to create a layered tab effect.
                    // 40px ensures the tighter header is completely visible!
                    top: `calc(15vh + ${i * 40}px)`, 
                    zIndex: i + 10
                  }}
                >
                  <motion.div 
                  className="w-full bg-[#020202] border-t border-x border-white/[0.05] overflow-hidden"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.7, ease }}
                >
                  
                  {/* Card Terminal Header */}
                  <div className="px-5 py-2.5 border-b border-white/[0.03] flex items-center justify-between bg-white/[0.005]" style={{ height: '40px' }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/10" />
                      <div className="w-2 h-2 rounded-full bg-white/5" />
                      <div className="w-2 h-2 rounded-full bg-white/[0.02]" />
                    </div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-white/20">
                      SYS.LOG // {i + 1}
                    </span>
                  </div>

                  {/* Card Body - Tightened Paddings */}
                  <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12">
                    
                    {/* Left Info */}
                    <div className="md:w-[28%] shrink-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-white/30 tracking-wider mb-1.5 block">
                          {exp.date}
                        </span>
                        <h4 className="text-lg md:text-xl font-bold text-white/70 mb-1">
                          {exp.company}
                        </h4>
                        <span className="text-xs font-mono text-white/20 uppercase tracking-widest flex items-center gap-2 mt-3">
                          <exp.icon className="w-3.5 h-3.5" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-bold text-white/90 mb-4 tracking-tight">
                        {exp.role}
                      </h3>
                      <p className="text-white/30 text-[14px] leading-relaxed mb-6 max-w-2xl">
                        {exp.description}
                      </p>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {exp.skills.map((skill, sdx) => (
                          <span 
                            key={sdx} 
                            className="text-[9px] font-mono uppercase tracking-wider text-white/30 px-2.5 py-1 bg-white/[0.015] border border-white/[0.05] rounded-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </motion.div>
              </div>

              {/* ── Gap between cards ── */}
              {!isLast && <div className="h-[50vh] w-full pointer-events-none" />}
            </React.Fragment>
            );
          })}

          {/* ── Final Card Scroll Runway ── */}
          {/* Provides just enough physical page height for the 3rd card to finish stacking without a massive empty scroll gap. */}
          <div className="h-[20vh] w-full pointer-events-none" />
        </div>
      </div>

    </section>
  );
}
