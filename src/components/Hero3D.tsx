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

/* ================================================================== */
/*  STARFIELD — 3 parallax depth layers of drifting particles          */
/* ================================================================== */

/* Seeded pseudo-random for stable layouts between renders */
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/* Generate star positions for a single depth layer */
function generateStars(count: number, seed: number) {
  return Array.from({ length: count }, (_, i) => ({
    x: Number((seededRandom(seed + i * 1.3) * 100).toFixed(2)),
    y: Number((seededRandom(seed + i * 2.7 + 50) * 100).toFixed(2)),
    size: Number((1 + seededRandom(seed + i * 3.1 + 100) * 2).toFixed(2)),
    opacity: Number((0.2 + seededRandom(seed + i * 4.9 + 200) * 0.6).toFixed(2)),
    twinkleDelay: Number((seededRandom(seed + i * 5.3 + 300) * 8).toFixed(2)),
    twinkleDuration: Number((3 + seededRandom(seed + i * 6.7 + 400) * 5).toFixed(2)),
  }));
}

/* 3 depth layers: far (small/slow), mid (medium), near (few/large/fast) */
const STARS_FAR  = generateStars(30, 1);
const STARS_MID  = generateStars(15, 100);
const STARS_NEAR = generateStars(6, 200);

function StarfieldBg({ mx, my }: { mx: number; my: number }) {
  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">

      {/* ── Far layer ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${mx * 3}px, ${my * 3}px)`,
          transition: 'transform 0.6s ease-out',
          willChange: 'transform',
        }}
      >
        {STARS_FAR.map((star, i) => (
          <div
            key={`far-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity * 0.8,
              animation: `flicker${i % 3 + 1} ${4 + (star.twinkleDuration % 3) * 2}s ease-in-out ${star.twinkleDelay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Mid layer ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${mx * 8}px, ${my * 8}px)`,
          transition: 'transform 0.4s ease-out',
          willChange: 'transform',
        }}
      >
        {STARS_MID.map((star, i) => (
          <div
            key={`mid-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 1.3,
              height: star.size * 1.3,
              opacity: star.opacity * 0.9,
              animation: `flicker${i % 3 + 1} ${3.5 + (star.twinkleDuration % 2) * 1.5}s ease-in-out ${star.twinkleDelay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Near layer ────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${mx * 15}px, ${my * 15}px)`,
          transition: 'transform 0.25s ease-out',
          willChange: 'transform',
        }}
      >
        {STARS_NEAR.map((star, i) => (
          <div
            key={`near-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size * 1.8,
              height: star.size * 1.8,
              opacity: star.opacity,
              boxShadow: `0 0 ${star.size * 3}px ${star.size}px rgba(200,220,255,${star.opacity * 0.3})`,
              animation: `flicker${i % 3 + 1} ${3 + (star.twinkleDuration % 2) * 1}s ease-in-out ${star.twinkleDelay}s infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Vignette — soft edge darkening ──────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 50%, rgba(0,0,0,0.15) 100%)',
      }} />

      {/* ── Center glow ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 40% 35% at 50% 50%, rgba(255,255,255,0.03), transparent 70%)',
      }} />

      {/* ── Corner bracket accents ──────────────────────────────── */}
      <svg className="absolute top-[12%] left-[6%] opacity-[0.08]" width="36" height="36" viewBox="0 0 36 36">
        <path d="M0 12 L0 0 L12 0" stroke="white" strokeWidth="0.5" fill="none" />
      </svg>
      <svg className="absolute bottom-[12%] right-[6%] opacity-[0.08]" width="36" height="36" viewBox="0 0 36 36">
        <path d="M36 24 L36 36 L24 36" stroke="white" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
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
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const cx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1 to 1
    const cy = (e.clientY / window.innerHeight - 0.5) * 2;
    setMouse({ x: cx, y: cy });
  }, []);

  const texts = useMemo(() => [
    "Agentic AI Systems & Multi-Agent Orchestration",
    "Scalable Python Backend Architecture",
    "ComfyUI Workflow Engineering",
    "Production-Grade AI Platforms",
  ], []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden select-none" onMouseMove={handleMouseMove} style={{ backgroundColor: "#0e0e0eff" }}>

      {/* ── CSS keyframes ──────────────────────────────────────── */}
      <style>{`
        @keyframes marqueeScroll  { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marqueeReverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes flicker1 { 0% { opacity: 0.8; } 10% { opacity: 0.2; } 20% { opacity: 0.9; } 30% { opacity: 0.4; } 40% { opacity: 1; } 50% { opacity: 0.3; } 60% { opacity: 0.85; } 70% { opacity: 0.15; } 80% { opacity: 0.95; } 90% { opacity: 0.5; } 100% { opacity: 0.8; } }
        @keyframes flicker2 { 0% { opacity: 0.6; } 8% { opacity: 1; } 18% { opacity: 0.2; } 28% { opacity: 0.7; } 42% { opacity: 0.15; } 55% { opacity: 0.9; } 65% { opacity: 0.35; } 75% { opacity: 0.85; } 85% { opacity: 0.25; } 95% { opacity: 0.7; } 100% { opacity: 0.6; } }
        @keyframes flicker3 { 0% { opacity: 0.5; } 12% { opacity: 0.95; } 22% { opacity: 0.3; } 35% { opacity: 0.8; } 45% { opacity: 0.1; } 58% { opacity: 0.75; } 68% { opacity: 0.4; } 78% { opacity: 1; } 88% { opacity: 0.2; } 100% { opacity: 0.5; } }
        @keyframes driftSlow { 0% { transform: translate(0, 0); } 25% { transform: translate(15px, -10px); } 50% { transform: translate(-6px, 15px); } 75% { transform: translate(-15px, -6px); } 100% { transform: translate(0, 0); } }
        @keyframes driftMid  { 0% { transform: translate(0, 0); } 25% { transform: translate(-20px, 15px); } 50% { transform: translate(12px, -18px); } 75% { transform: translate(20px, 10px); } 100% { transform: translate(0, 0); } }
        @keyframes driftFast { 0% { transform: translate(0, 0); } 25% { transform: translate(28px, -22px); } 50% { transform: translate(-18px, 25px); } 75% { transform: translate(-28px, -15px); } 100% { transform: translate(0, 0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Subtle dot texture ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
        backgroundSize: '3px 3px',
      }} />

      {/* ── Subtle grid lines ──────────────────────────────────── */}
      <div className="absolute inset-0 z-[0] pointer-events-none opacity-[0.025]" style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)
        `,
        backgroundSize: '160px 160px',
      }} />

      {/* ── Parallax starfield ──────────────────────────────────── */}
      <StarfieldBg mx={mouse.x} my={mouse.y} />

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

      {/* ── Center radial glow ──────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_60%)]" />

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
