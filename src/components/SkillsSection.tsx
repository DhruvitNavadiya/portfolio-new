"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit } from "lucide-react";

/* ================================================================== */
/*  STARFIELD COMPONENT                                                */
/* ================================================================== */
function Starfield() {
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate static random stars on mount to avoid hydration mismatch
    const generatedStars = Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5, // 0.5px to 2.5px
      delay: Math.random() * 5, // Random animation offset
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: star.size > 1.5 ? 0.3 : 0.1, // Larger stars are brighter
          }}
          animate={{
            opacity: [star.size > 1.5 ? 0.3 : 0.1, star.size > 1.5 ? 0.8 : 0.3, star.size > 1.5 ? 0.3 : 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  SKILLS DATA                                                        */
/* ================================================================== */
// Grouped by orbital distance (ring)
const ORBIT_DATA = [
  {
    ring: 1,
    radius: 120, // Mobile radius. Will scale up on desktop
    skills: ["Python", "TypeScript", "React"],
  },
  {
    ring: 2,
    radius: 220,
    skills: ["Next.js", "FastAPI", "TailwindCSS", "PostgreSQL"],
  },
  {
    ring: 3,
    radius: 340,
    skills: ["OpenAI", "LangChain", "ComfyUI", "Docker", "AWS"],
  },
];

/* ================================================================== */
/*  ORBITAL RING COMPONENT                                             */
/* ================================================================== */
function OrbitalRing({
  ringData,
  inView,
  baseScale = 1 
}: {
  ringData: typeof ORBIT_DATA[0];
  inView: boolean;
  baseScale?: number;
}) {
  const scaledRadius = ringData.radius * baseScale;
  const circumference = 2 * Math.PI * scaledRadius;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: ringData.ring * 0.2, duration: 1, ease: "easeOut" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10"
      style={{
        width: scaledRadius * 2,
        height: scaledRadius * 2,
        // Make the dashes look like subtle dots/flight paths
        borderWidth: "1px",
      }}
    >
      {/* ── Rotating Container for Nodes ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          // The larger the radius, the longer the duration (slower speed)
          // Adjust the multiplier '0.15' to speed up or slow down the entire system
          duration: ringData.radius * 0.15,
        }}
      >
        {ringData.skills.map((skill, index) => {
          // Calculate exact position on the circle (0 to 360 deg)
          const angle = (index / ringData.skills.length) * 360;
          // We apply the rotation to the wrapper, then counter-rotate the child so text stays upright
          
          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotate(${angle}deg) translateX(${scaledRadius}px) rotate(-${angle}deg)`,
                transformOrigin: "center center",
              }}
            >
              {/* Note: the counter-rotation here keeps it mostly upright relative to its angle, 
                  but because the whole parent is rotating infinitely, we actually need to counter 
                  that continuous rotation. framer-motion makes tracking that tricky without useTime.
                  Instead, a purely CSS approach for the counter rotation is cleaner if we want perfectly upright text,
                  but a slight spin creates a nice zero-gravity effect! Let's counter-rotate the parent's animation. */}
              
              <SkillNode skill={skill} radius={ringData.radius} delay={angle/360} />
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/* ================================================================== */
/*  SKILL NODE COMPONENT (Counter-rotates to stay upright)                 */
/* ================================================================== */
function SkillNode({ skill, radius, delay }: { skill: string, radius: number, delay: number }) {
  // We apply the exact OPPOSITE rotation of the parent ring so the text always remains readable and perfectly upright!
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center group cursor-pointer"
      animate={{ rotate: -360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: radius * 0.15, // Must exactly match parent duration
      }}
      whileHover={{ scale: 1.2, zIndex: 50 }}
    >
      <div className="relative flex items-center justify-center px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] rounded-full overflow-hidden transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/50 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        
        <span className="relative z-10 text-[11px] md:text-xs font-mono font-bold tracking-wider text-white/70 group-hover:text-white whitespace-nowrap transition-colors">
          {skill}
        </span>
      </div>
      
      {/* Small connection dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white/20 rounded-full -z-10 group-hover:bg-white/50 group-hover:shadow-[0_0_10px_2px_rgba(255,255,255,0.5)] transition-all" />
    </motion.div>
  );
}

/* ================================================================== */
/*  MAIN SERVICES COMPONENT                                             */
/* ================================================================== */
export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative bg-black py-24 md:py-32 border-t border-white/[0.05] overflow-hidden min-h-screen flex flex-col items-center justify-center">
      
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        
        {/* Dynamic Starfield */}
        <Starfield />

        {/* Deep background grid */}
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            backgroundPosition: 'center center'
          }}
        />
        {/* Base dark gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,black_100%)]" />
        
        {/* Massive core glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_60%)] blur-2xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_50%)] blur-xl" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
          <motion.span
            className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/30 block mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            006 / Arsenal
          </motion.span>

          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7 }}
          >
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/10">Architecture</span>
          </motion.h2>
          
          <motion.p
            className="text-white/40 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            An interconnected ecosystem of technologies I leverage to build scalable, agentic AI systems.
          </motion.p>
        </div>

        {/* ── Visual Orbital System ── */}
        <div className="relative w-full max-w-[800px] aspect-square flex items-center justify-center">
          
          {/* Orbital Rings. We pass baseScale 1 for desktop, could pass 0.7 for mobile via CSS media queries. 
              Here we just rely on CSS scaling of the parent container on smaller screens if needed, 
              but the absolute sizing fits nicely on desktop. For mobile, the max-w-[800px] scales down if we make it flex/relative.
              Actually, let's just make the container overflow-hidden on the section so it doesn't break mobile width! 
           */}
           <div className="absolute inset-0 scale-[0.6] sm:scale-75 md:scale-100 flex items-center justify-center pointer-events-auto">
              {ORBIT_DATA.map((data, i) => (
                <OrbitalRing key={i} ringData={data} inView={inView} />
              ))}

              {/* ── Central Core ── */}
              <motion.div
                className="absolute z-50 flex items-center justify-center w-28 h-28 rounded-full border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.15)] bg-black/50 backdrop-blur-2xl"
                initial={{ opacity: 0, scale: 0 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 1, type: "spring", bounce: 0.4 }}
              >
                {/* Core pulse rings */}
                <div className="absolute inset-0 rounded-full border border-white/20 animate-[ping_3s_ease-out_infinite]" />
                <div className="absolute inset-0 rounded-full border border-white/10 animate-[ping_4s_ease-out_infinite]" />
                <div className="absolute inset-0 rounded-full bg-white/5 animate-pulse" />
                
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#333] to-[#050505] flex items-center justify-center shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)] border border-white/10">
                  <BrainCircuit className="w-8 h-8 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </div>
              </motion.div>
           </div>
        </div>
      </div>
    </section>
  );
}
