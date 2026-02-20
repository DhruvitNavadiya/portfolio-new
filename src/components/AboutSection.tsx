"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Image from "next/image";

/* ================================================================== */
/*  TRAITS — left and right                                            */
/* ================================================================== */
const LEFT_TRAITS = [
  { label: "22 years old", sub: "Born in 2002, Gujarat" },
  { label: "☕ Coffee Addict", sub: "Fueled by espresso shots" },
  { label: "🌙 Night Owl", sub: "Best code after midnight" },
];

const RIGHT_TRAITS = [
  { label: "📍 Surat, India", sub: "Building from home" },
  { label: "♟️ Chess Player", sub: "Strategic thinker at heart" },
  { label: "📚 Bookworm", sub: "Always learning something new" },
];

const ease = [0.16, 1, 0.3, 1] as const;

/* ================================================================== */
/*  ABOUT SECTION                                                      */
/* ================================================================== */
export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  /* parallax: image shifts up slower than scroll */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  /* clip-path reveal: wipes open from center as section enters */
  const clipInset = useTransform(scrollYProgress, [0, 0.35], [50, 0]);
  const clipPath = useTransform(clipInset, (v) => `inset(${v}% 0% ${v}% 0%)`);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen bg-black overflow-hidden flex items-center"
    >
      {/* ── Subtle dot pattern (distinct from hero grid) ────── */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.4]" style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
      }} />

      {/* ── Edge decorations (fills empty corners) ───────────── */}
      {/* Top-left */}
      <motion.div
        className="absolute top-8 left-8 z-10 pointer-events-none"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <span className="text-[10px] font-mono text-white/15 block">x: 002</span>
        <span className="text-[10px] font-mono text-white/15 block">section: about</span>
        <div className="w-4 h-4 border-t border-l border-white/10 mt-2" />
      </motion.div>

      {/* Top-right */}
      <motion.div
        className="absolute top-8 right-8 z-10 text-right pointer-events-none"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <span className="text-[10px] font-mono text-white/15 block">scroll: 0.00</span>
        <span className="text-[10px] font-mono text-white/15 block">parallax: active</span>
        <div className="w-4 h-4 border-t border-r border-white/10 mt-2 ml-auto" />
      </motion.div>

      {/* Bottom-left */}
      <motion.div
        className="absolute bottom-8 left-8 z-10 pointer-events-none"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <div className="w-4 h-4 border-b border-l border-white/10 mb-2" />
        <span className="text-[10px] font-mono text-white/15 block">© 2024</span>
      </motion.div>

      {/* Bottom-right */}
      <motion.div
        className="absolute bottom-8 right-8 z-10 text-right pointer-events-none"
        initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="w-4 h-4 border-b border-r border-white/10 mb-2 ml-auto" />
        <span className="text-[10px] font-mono text-white/15 block">surat, in</span>
      </motion.div>

      {/* ── Vertical side text (left) ────────────────────────── */}
      <motion.div
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 hidden xl:block pointer-events-none"
        initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="writing-vertical text-[10px] font-mono tracking-[0.4em] text-white/10 uppercase"
          style={{ writingMode: "vertical-lr", letterSpacing: "0.4em" }}>
          ABOUT — DHRUVIT NAVADIYA
        </div>
      </motion.div>

      {/* ── Vertical side text (right) ───────────────────────── */}
      <motion.div
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 hidden xl:block pointer-events-none"
        initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <div className="text-[10px] font-mono tracking-[0.4em] text-white/10 uppercase"
          style={{ writingMode: "vertical-rl", letterSpacing: "0.4em" }}>
          AI AUTOMATION ENGINEER
        </div>
      </motion.div>

      {/* ── MAIN LAYOUT ──────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center">

          {/* LEFT TRAITS */}
          <div className="hidden lg:flex flex-col items-end gap-8 pr-10 xl:pr-16 flex-1">
            {LEFT_TRAITS.map((t, i) => (
              <motion.div
                key={i}
                className="text-right group cursor-default"
                initial={{ opacity: 0, x: -40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.7, ease }}
              >
                <div className="flex items-center justify-end gap-3">
                  <div>
                    <div className="text-sm font-medium text-white/55 group-hover:text-white/90 transition-colors duration-300">
                      {t.label}
                    </div>
                    <div className="text-[10px] font-mono text-white/20 mt-0.5">{t.sub}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-10 h-px bg-white/10 group-hover:bg-white/30 group-hover:w-14 transition-all duration-300" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-white/50 transition-colors duration-300" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CENTER — Portrait + heading + quote stacked */}
          <div className="flex flex-col items-center shrink-0">
            {/* Section heading */}
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white/80 tracking-tight text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease }}
            >
              Who I Am
            </motion.h2>

            {/* Portrait with parallax */}
            <motion.div
              className="relative"
              style={{ y: imgY }}
            >
              {/* Corner brackets */}
              <div className="absolute -top-3 -left-3 w-5 h-5 border-t border-l border-white/15 z-20" />
              <div className="absolute -top-3 -right-3 w-5 h-5 border-t border-r border-white/15 z-20" />
              <div className="absolute -bottom-3 -left-3 w-5 h-5 border-b border-l border-white/15 z-20" />
              <div className="absolute -bottom-3 -right-3 w-5 h-5 border-b border-r border-white/15 z-20" />

              <motion.div
                className="relative w-[340px] h-[430px] md:w-[440px] md:h-[540px] overflow-hidden"
                style={{ clipPath }}
              >
                <Image
                  src="/portrait.png"
                  alt="Dhruvit Navadiya"
                  fill
                  className="object-cover object-top"
                  priority
                />
                {/* Bottom fade */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </motion.div>
            </motion.div>

            {/* Name + role under image */}
            <motion.div
              className="text-center mt-4"
              style={{ y: textY }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="text-base md:text-lg font-semibold text-white/70 tracking-tight">
                Dhruvit Navadiya
              </div>
              <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/25 mt-1">
                AI Automation Engineer · Agentic Systems
              </div>
            </motion.div>

            {/* Quote */}
            <motion.p
              className="text-center text-white/30 text-xs md:text-sm leading-relaxed font-light italic max-w-sm mt-4"
              style={{ y: textY }}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              "Building intelligent systems that think, adapt, and scale —
              one agent at a time."
            </motion.p>
          </div>

          {/* RIGHT TRAITS */}
          <div className="hidden lg:flex flex-col items-start gap-8 pl-10 xl:pl-16 flex-1">
            {RIGHT_TRAITS.map((t, i) => (
              <motion.div
                key={i}
                className="text-left group cursor-default"
                initial={{ opacity: 0, x: 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.6 + i * 0.12, duration: 0.7, ease }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/15 group-hover:bg-white/50 transition-colors duration-300" />
                    <div className="w-10 h-px bg-white/10 group-hover:bg-white/30 group-hover:w-14 transition-all duration-300" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white/55 group-hover:text-white/90 transition-colors duration-300">
                      {t.label}
                    </div>
                    <div className="text-[10px] font-mono text-white/20 mt-0.5">{t.sub}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* MOBILE TRAITS */}
        <div className="lg:hidden flex flex-wrap justify-center gap-2 mt-6">
          {[...LEFT_TRAITS, ...RIGHT_TRAITS].map((t, i) => (
            <motion.span
              key={i}
              className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-white/35 border border-white/[0.08] rounded-full"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
            >
              {t.label}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
