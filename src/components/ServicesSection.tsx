"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Server, Workflow, Cpu, ArrowUpRight, ChevronRight } from "lucide-react";

/* ================================================================== */
/*  SERVICE DATA                                                       */
/* ================================================================== */
const SERVICES = [
  {
    icon: Bot,
    number: "01",
    title: "AI Automation",
    description: "End-to-end AI pipelines that replace manual workflows with intelligent agents.",
    tags: ["OpenAI", "Gemini", "ComfyUI"],
  },
  {
    icon: Workflow,
    number: "02",
    title: "Agentic Systems",
    description: "Multi-agent orchestration where AI agents collaborate and execute tasks autonomously.",
    tags: ["LangChain", "CrewAI", "Multi-Agent"],
  },
  {
    icon: Server,
    number: "03",
    title: "Backend Engineering",
    description: "Scalable APIs and microservices built for high throughput at production scale.",
    tags: ["Python", "FastAPI", "PostgreSQL"],
  },
  {
    icon: Cpu,
    number: "04",
    title: "AI Integration",
    description: "Embedding AI capabilities into existing products — LLMs to computer vision.",
    tags: ["APIs", "Webhooks", "Real-time"],
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

/* ================================================================== */
/*  SERVICE PANEL                                                      */
/* ================================================================== */
function ServicePanel({
  service,
  index,
  inView,
}: {
  service: (typeof SERVICES)[number];
  index: number;
  inView: boolean;
}) {
  const Icon = service.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative border-b border-white/[0.05] last:border-b-0 cursor-default"
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.7, ease }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Hover Cover */}
      <motion.div
        className="absolute inset-0 bg-[#1a1a1a] pointer-events-none origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.5, ease }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center py-8 md:py-10 px-4 md:px-8 gap-6 md:gap-12 transition-all duration-500">
        
        {/* Left: Number & Icon */}
        <div className="flex items-center gap-6 shrink-0 w-[180px]">
          <span className="text-xl font-mono text-white/20 group-hover:text-white/50 transition-colors duration-500">
            {service.number}
          </span>
          <div className="w-12 h-12 flex items-center justify-center border border-white/[0.08] bg-black group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all duration-500">
            <Icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors duration-500" />
          </div>
        </div>

        {/* Center: Title & Desc */}
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold text-white/80 group-hover:text-white transition-colors duration-300 tracking-tight mb-3">
            {service.title}
          </h3>
          <p className="text-[14px] md:text-[15px] text-white/40 group-hover:text-white/70 max-w-xl leading-relaxed transition-colors duration-500">
            {service.description}
          </p>
        </div>

        {/* Right: Tags & Arrow */}
        <div className="flex flex-col md:items-end shrink-0 gap-6 mt-4 md:mt-0">
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] font-mono uppercase tracking-wider text-white/50 px-3 py-1.5 bg-[#050505] border border-white/10 group-hover:border-white/30 group-hover:text-white transition-colors duration-500"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full border border-white/[0.08] group-hover:border-white/30 overflow-hidden transition-all duration-500">
            <motion.div
              initial={false}
              animate={{ x: isHovered ? 0 : -20, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ArrowUpRight className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  SERVICES SECTION                                                   */
/* ================================================================== */
export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="relative min-h-screen bg-[#111111] py-24 md:py-32">
      
      {/* ── Background & Decorations Wrapper (to prevent overflow breaking sticky) ── */}
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
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
        }} />

        {/* Accent Corners */}
        <div className="absolute top-4 left-4 md:top-10 md:left-10 w-4 h-4 md:w-6 md:h-6 border-t-2 border-l-2 border-white/10" />
        <div className="absolute top-4 right-4 md:top-10 md:right-10 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-white/10" />
        <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 w-4 h-4 md:w-6 md:h-6 border-b-2 border-l-2 border-white/10" />
        <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 w-4 h-4 md:w-6 md:h-6 border-b-2 border-r-2 border-white/10" />
      </div>


      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col xl:flex-row gap-16 xl:gap-24">
        
        {/* ── Left Column: Sticky Header ──────────────────────────── */}
        <div className="xl:w-[350px] shrink-0">
          <div className="sticky top-32">
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="w-12 h-px bg-white/20" />
              <span className="text-[11px] font-mono uppercase tracking-[0.4em] text-white/40">
                003 / Expertise
              </span>
            </motion.div>

            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/90 leading-[1.05] mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease }}
            >
              What I
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 via-white/40 to-white/10">
                Build.
              </span>
            </motion.h2>

            <motion.p
              className="text-white/40 text-sm md:text-base max-w-sm leading-relaxed mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Architecting complex, production-ready AI systems with a deep focus on
              agentic workflows, scalable backend architectures, and uncompromising 
              aesthetic implementation.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 1 }}
            >
              <button className="group flex items-center gap-4 text-white/50 hover:text-white transition-colors duration-300">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em]">View tech stack</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* ── Right Column: Stacked Panels ────────────────────────── */}
        <div className="flex-1 mt-8 xl:mt-0">
          <motion.div
            className="border-t border-white/[0.05]"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            {SERVICES.map((service, i) => (
              <ServicePanel key={i} service={service} index={i} inView={inView} />
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
}
