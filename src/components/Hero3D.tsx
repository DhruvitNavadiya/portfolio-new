"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Braces,
  Server,
  Brain,
  Bot,
} from "lucide-react";
import { useLenis } from "lenis/react";

/* ================================================================== */
/*  REF-BASED TYPEWRITER (zero React re-renders)                       */
/* ================================================================== */
function Typewriter({
  texts,
  typingSpeed = 55,
  deletingSpeed = 30,
  pauseTime = 2400,
}: {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let textIndex = 0;
    let charIndex = 0;
    let phase: "typing" | "pausing" | "deleting" = "typing";
    let raf: number;
    let lastTick = 0;

    const tick = (now: number) => {
      const current = texts[textIndex];
      let delay = typingSpeed;
      if (phase === "pausing") delay = pauseTime;
      else if (phase === "deleting") delay = deletingSpeed;

      if (now - lastTick >= delay) {
        lastTick = now;
        if (phase === "typing") {
          charIndex++;
          if (spanRef.current) spanRef.current.textContent = current.slice(0, charIndex);
          if (charIndex >= current.length) phase = "pausing";
        } else if (phase === "pausing") {
          phase = "deleting";
        } else if (phase === "deleting") {
          charIndex--;
          if (spanRef.current) spanRef.current.textContent = current.slice(0, charIndex);
          if (charIndex <= 0) {
            textIndex = (textIndex + 1) % texts.length;
            phase = "typing";
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [texts, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <span className="text-sm md:text-base text-white/55 font-mono">
      <span ref={spanRef} />
      <span className="animate-pulse text-white/60">|</span>
    </span>
  );
}

/* ================================================================== */
/*  LIVE CLOCK                                                         */
/* ================================================================== */
function useLiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/* ================================================================== */
/*  GRID-COMPLEMENTARY BACKGROUND ANIMATIONS                           */
/*  - Pulsing dots at grid intersections                               */
/*  - Fading grid cells that glow and disappear                        */
/*  - Concentric rings from center                                     */
/* ================================================================== */

/* ================================================================== */
/*  SPOTLIGHT CURSOR (mix-blend-mode: difference)                      */
/* ================================================================== */
function SpotlightCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [active, setActive] = useState(false);

  const springX = useSpring(x, { damping: 25, stiffness: 200 });
  const springY = useSpring(y, { damping: 25, stiffness: 200 });

  useEffect(() => {
    const onToggle = (e: Event) => setActive((e as CustomEvent).detail);
    const onMove = (e: Event) => {
      const { x: mx, y: my } = (e as CustomEvent).detail;
      x.set(mx);
      y.set(my);
    };

    document.addEventListener("spotlight", onToggle);
    document.addEventListener("spotlight-move", onMove);
    return () => {
      document.removeEventListener("spotlight", onToggle);
      document.removeEventListener("spotlight-move", onMove);
    };
  }, [x, y]);

  return (
    <motion.div
      className="fixed pointer-events-none z-[50]"
      style={{
        left: springX,
        top: springY,
        x: "-50%",
        y: "-50%",
        width: 350,
        height: 350,
        borderRadius: "50%",
        background: "white",
        mixBlendMode: "difference",
      }}
      animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
    />
  );
}

const GRID_SIZE = 140; // bigger boxes

/** Dots that pulse at grid intersections */
const GRID_DOTS = [
  { col: 2, row: 1 }, { col: 4, row: 1 }, { col: 6, row: 1 },
  { col: 1, row: 2 }, { col: 3, row: 2 }, { col: 5, row: 3 },
  { col: 7, row: 2 }, { col: 2, row: 4 }, { col: 8, row: 3 },
  { col: 4, row: 4 }, { col: 6, row: 4 }, { col: 9, row: 1 },
  { col: 10, row: 3 }, { col: 3, row: 5 },
];

/** Grid cells that briefly glow */
const GLOW_CELLS = [
  { col: 2, row: 1, delay: 0 }, { col: 5, row: 3, delay: 3 },
  { col: 1, row: 3, delay: 6 }, { col: 7, row: 2, delay: 9 },
  { col: 3, row: 4, delay: 2 }, { col: 8, row: 1, delay: 5 },
  { col: 6, row: 4, delay: 8 }, { col: 4, row: 2, delay: 11 },
];

function GridAnimations() {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">

      {/* ── Pulsing intersection dots ─────────────────────────── */}
      {GRID_DOTS.map((dot, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: dot.col * GRID_SIZE,
            top: dot.row * GRID_SIZE,
          }}
          animate={{ opacity: [0, 0.35, 0], scale: [0.5, 1.8, 0.5] }}
          transition={{
            duration: 4 + (i % 3) * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}

      {/* ── Fading grid cell highlights ───────────────────────── */}
      {GLOW_CELLS.map((cell, i) => (
        <motion.div
          key={`cell-${i}`}
          className="absolute"
          style={{
            left: cell.col * GRID_SIZE,
            top: cell.row * GRID_SIZE,
            width: GRID_SIZE,
            height: GRID_SIZE,
          }}
          animate={{ opacity: [0, 0.08, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: cell.delay,
          }}
        >
          <div className="w-full h-full border border-white/[0.08] bg-white/[0.03]" />
        </motion.div>
      ))}

      {/* ── Concentric expanding rings (from center) ──────────── */}
      {[0, 2.5, 5].map((delay, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
          initial={{ width: 0, height: 0, opacity: 0.12 }}
          animate={{
            width: [0, 800],
            height: [0, 800],
            opacity: [0.12, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeOut",
            delay,
          }}
        />
      ))}

      {/* ── Corner bracket accents ────────────────────────────── */}
      <motion.svg className="absolute top-[18%] left-[10%]" width="40" height="40" viewBox="0 0 40 40"
        initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: 1, duration: 1 }}>
        <path d="M0 15 L0 0 L15 0" stroke="white" strokeWidth="1" fill="none" />
      </motion.svg>
      <motion.svg className="absolute bottom-[18%] right-[10%]" width="40" height="40" viewBox="0 0 40 40"
        initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ delay: 1.3, duration: 1 }}>
        <path d="M40 25 L40 40 L25 40" stroke="white" strokeWidth="1" fill="none" />
      </motion.svg>
      <motion.svg className="absolute top-[25%] right-[15%]" width="30" height="30" viewBox="0 0 30 30"
        initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ delay: 1.6, duration: 1 }}>
        <path d="M30 10 L30 0 L20 0" stroke="white" strokeWidth="1" fill="none" />
      </motion.svg>
      <motion.svg className="absolute bottom-[25%] left-[15%]" width="30" height="30" viewBox="0 0 30 30"
        initial={{ opacity: 0 }} animate={{ opacity: 0.08 }} transition={{ delay: 1.9, duration: 1 }}>
        <path d="M0 20 L0 30 L10 30" stroke="white" strokeWidth="1" fill="none" />
      </motion.svg>
    </div>
  );
}

/* ================================================================== */
/*  CROSSHAIRS                                                         */
/* ================================================================== */
const CROSS_POS = [
  { left: "8%", top: "15%" }, { left: "22%", top: "35%" },
  { left: "85%", top: "20%" }, { left: "72%", top: "65%" },
  { left: "15%", top: "78%" }, { left: "92%", top: "82%" },
  { left: "48%", top: "10%" }, { left: "55%", top: "88%" },
  { left: "35%", top: "55%" }, { left: "68%", top: "42%" },
];

function Crosshairs() {
  return (
    <>
      {CROSS_POS.map((pos, i) => (
        <motion.div key={i} className="absolute z-[2] pointer-events-none"
          style={{ left: pos.left, top: pos.top }}
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5 + i * 0.06, duration: 0.4 }}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <line x1="6" y1="1" x2="6" y2="11" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
            <line x1="1" y1="6" x2="11" y2="6" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          </svg>
        </motion.div>
      ))}
    </>
  );
}

/* ================================================================== */
/*  MARQUEE (pure CSS)                                                 */
/* ================================================================== */
const MARQUEE_ITEMS = [
  "PYTHON", "FASTAPI", "OPENAI", "GEMINI", "LANGCHAIN",
  "COMFYUI", "ASYNCIO", "REACT", "NEXT.JS", "THREE.JS",
  "POSTGRESQL", "REDIS", "WEBSOCKETS", "DOCKER", "AWS", "VERCEL",
];

function MarqueeTrack({ reverse = false }: { reverse?: boolean }) {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="inline-flex gap-10 whitespace-nowrap"
      style={{ animation: `${reverse ? "marqueeReverse" : "marqueeScroll"} 40s linear infinite`, willChange: "transform" }}>
      {items.map((item, i) => (
        <span key={i} className="text-[11px] tracking-[0.3em] text-white/40 font-mono flex items-center gap-4">
          {item}<span className="text-white/15">◆</span>
        </span>
      ))}
    </div>
  );
}

function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="relative w-full overflow-hidden py-3 border-y border-white/[0.06]" style={{ background: "rgba(0,0,0,0.95)" }}>
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #000, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #000, transparent)" }} />
      <MarqueeTrack reverse={reverse} />
    </div>
  );
}

/* ================================================================== */
/*  TECH BADGES                                                        */
/* ================================================================== */
const TECH_BADGES = [
  { label: "Python", icon: Braces, x: "8%", y: "30%" },
  { label: "AI/ML", icon: Brain, x: "88%", y: "35%" },
  { label: "Backend", icon: Server, x: "6%", y: "65%" },
  { label: "Agents", icon: Bot, x: "90%", y: "68%" },
];

function TechBadges() {
  return (
    <>
      {TECH_BADGES.map((badge, i) => (
        <motion.div key={i}
          className="absolute z-[3] pointer-events-none hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02]"
          style={{ left: badge.x, top: badge.y }}
          initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2 + i * 0.15, duration: 0.5 }}>
          <badge.icon className="w-3 h-3 text-white/40" />
          <span className="text-[10px] tracking-widest uppercase text-white/35 font-mono">{badge.label}</span>
        </motion.div>
      ))}
    </>
  );
}

/* ================================================================== */
/*  STATS ROW                                                          */
/* ================================================================== */
const STATS = [
  { label: "Projects", value: "15+" },
  { label: "Experience", value: "3 yrs" },
  { label: "AI Models", value: "10+" },
  { label: "Uptime", value: "99.9%" },
];

function StatsRow() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.7 }} className="flex gap-8 md:gap-12 mt-10">
      {STATS.map((stat, i) => (
        <div key={i} className="text-center group">
          <div className="text-lg font-bold text-white/80 tracking-tight group-hover:text-white transition-colors">{stat.value}</div>
          <div className="text-[9px] uppercase tracking-[0.25em] text-white/30 font-mono mt-1">{stat.label}</div>
          <div className="h-px w-0 group-hover:w-full bg-white/30 mt-1.5 transition-all duration-300 mx-auto" />
        </div>
      ))}
    </motion.div>
  );
}

/* ================================================================== */
/*  FRAMER VARIANTS                                                    */
/* ================================================================== */
const ease = [0.16, 1, 0.3, 1] as const;
const slideUp = (delay: number) => ({ initial: { y: "110%" }, animate: { y: "0%" }, transition: { duration: 1, delay, ease } });
const fadeIn = (delay: number) => ({ initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, delay, ease } });

/* ================================================================== */
/*  HERO — MAIN EXPORT                                                 */
/* ================================================================== */
export function Hero3D() {
  const lenis = useLenis();
  const clock = useLiveClock();

  const texts = useMemo(() => [
    "Agentic AI Systems & Multi-Agent Orchestration",
    "Scalable Python Backend Architecture",
    "ComfyUI Workflow Engineering",
    "Production-Grade AI Platforms",
  ], []);

  return (
    <section className="relative h-screen w-full overflow-hidden select-none" style={{ backgroundColor: "#0e0e0eff" }}>

      {/* ── CSS keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes marqueeScroll  { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
      `}</style>

      {/* ── Subtle noise texture on pure black ─────────────────── */}
      <div className="absolute inset-0 z-0 opacity-[0.025]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "150px 150px",
      }} />

      {/* ── CSS grid overlay — larger boxes with subtle crosses ── */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px),
          radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)
        `,
        backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px, ${GRID_SIZE}px ${GRID_SIZE}px, ${GRID_SIZE}px ${GRID_SIZE}px`,
        backgroundPosition: `0 0, 0 0, ${GRID_SIZE/2}px ${GRID_SIZE/2}px`,
      }} />

      {/* ── Grid-aware animations (dots, cell glows, rings) ──── */}
      <GridAnimations />

      {/* ── Crosshairs ─────────────────────────────────────────── */}
      <Crosshairs />

      {/* ── Tech badges ────────────────────────────────────────── */}
      <TechBadges />

      {/* ── Top marquee ────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute top-0 left-0 right-0 z-[5] pointer-events-none">
        <Marquee />
      </motion.div>

      {/* ── Bottom marquee ─────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.8 }}
        className="absolute bottom-0 left-0 right-0 z-[5] pointer-events-none">
        <Marquee reverse />
      </motion.div>

      {/* ── Overlay content ────────────────────────────────────── */}
      <div className="relative z-[3] h-full flex flex-col items-center justify-center px-6">

        {/* ── Spotlight cursor (mix-blend-mode: difference) ────── */}
        <SpotlightCursor />

        <div
          className="name-hover-zone relative cursor-default"
          onMouseEnter={() => document.dispatchEvent(new CustomEvent('spotlight', { detail: true }))}
          onMouseLeave={() => document.dispatchEvent(new CustomEvent('spotlight', { detail: false }))}
          onMouseMove={(e) => document.dispatchEvent(new CustomEvent('spotlight-move', { detail: { x: e.clientX, y: e.clientY } }))}
        >
          <div className="overflow-hidden">
            <motion.h1 {...slideUp(0.5)}
              className="text-[clamp(3.5rem,13vw,11rem)] font-bold leading-[0.92] tracking-tighter text-white text-center">
              Dhruvit
            </motion.h1>
          </div>

          <div className="overflow-hidden">
            <motion.h1 {...slideUp(0.65)}
              className="text-[clamp(3.5rem,13vw,11rem)] font-bold leading-[0.92] tracking-tighter text-white text-center">
              Navadiya
            </motion.h1>
          </div>
        </div>

        <motion.div {...fadeIn(1)}
          className="mt-6 px-4 py-1.5 rounded-full border border-white/[0.1] bg-white/[0.03]">
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/45 font-mono">
            AI Automation Engineer · Agentic Systems Architect
          </span>
        </motion.div>

        <motion.div {...fadeIn(1.2)} className="mt-6 h-6 text-center max-w-lg">
          <Typewriter texts={texts} />
        </motion.div>

        <motion.div {...fadeIn(1.5)} className="mt-8 flex gap-4">
          <button 
            onClick={() => lenis?.scrollTo("#projects", { duration: 2.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
            className="group relative px-8 py-3.5 border border-white/20 text-white text-sm tracking-wide hover:border-white/60 hover:bg-white/10 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </button>
          <button 
            onClick={() => lenis?.scrollTo("#contact", { duration: 3.5, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })}
            className="group px-8 py-3.5 bg-white text-black text-sm font-semibold tracking-wide hover:bg-white/85 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
          >
            Contact Me
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>

        <StatsRow />
      </div>

      {/* ── Social links ───────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-[3] hidden md:flex flex-col gap-5">
        <a href="https://github.com" target="_blank" rel="noopener" className="text-white/50 hover:text-white transition-colors duration-300"><Github className="w-5 h-5" /></a>
        <a href="https://linkedin.com" target="_blank" rel="noopener" className="text-white/50 hover:text-white transition-colors duration-300"><Linkedin className="w-5 h-5" /></a>
        <a href="mailto:navadiyadhruvit@gmail.com" className="text-white/50 hover:text-white transition-colors duration-300"><Mail className="w-5 h-5" /></a>
        <div className="w-px h-8 bg-white/20 mx-auto" />
      </motion.div>

      {/* ── Corner decorations ─────────────────────────────────── */}
      <motion.span {...fadeIn(2)} className="absolute top-14 left-6 z-[4] text-[10px] text-white/20 font-mono leading-relaxed pointer-events-none">
        x:0, y:0<br />fps: 60 | ms: 16.7
      </motion.span>
      <motion.span {...fadeIn(2)} className="absolute top-14 right-6 z-[4] text-[10px] text-white/20 font-mono text-right pointer-events-none">
        v:1.0.0
      </motion.span>
      <motion.span {...fadeIn(2)} className="absolute bottom-14 left-6 z-[4] text-[10px] text-white/20 font-mono pointer-events-none">
        {clock}
      </motion.span>
      <motion.span {...fadeIn(2)} className="absolute bottom-14 right-6 z-[4] text-[10px] text-white/20 font-mono text-right pointer-events-none">
        surat, india
      </motion.span>
    </section>
  );
}
