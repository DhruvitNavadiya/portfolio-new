"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLenis } from "lenis/react";

const LINKS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const easeOut = (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

/* ================================================================== */
/*  SITE NAV — slides in once the hero is scrolled past                */
/* ================================================================== */
export function SiteNav() {
  const lenis = useLenis();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  /* Show the bar after most of the hero has scrolled away; the hero has its own marquee up top */
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the section that crosses the middle of the viewport */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    if (lenis) lenis.scrollTo(`#${id}`, { duration: 1.6, easing: easeOut });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            className="fixed top-4 inset-x-0 z-[90] flex justify-center px-4 pointer-events-none"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav
              aria-label="Primary"
              className="pointer-events-auto flex items-center gap-1 w-full max-w-4xl pl-4 pr-1.5 py-1.5 border border-white/[0.1] bg-black/70 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            >
              <button
                onClick={() => (lenis ? lenis.scrollTo(0, { duration: 1.6, easing: easeOut }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
                className="mr-auto text-sm font-bold tracking-tight text-white/90 hover:text-white transition-colors"
                aria-label="Back to top"
              >
                Dhruvit<span className="text-white/35">.</span>
              </button>

              {/* Desktop links */}
              <ul className="hidden md:flex items-center gap-0.5">
                {LINKS.map((l) => (
                  <li key={l.id}>
                    <button
                      onClick={() => go(l.id)}
                      aria-current={active === l.id ? "true" : undefined}
                      className={`relative px-3 py-2 text-[11px] font-mono uppercase tracking-[0.15em] transition-colors ${
                        active === l.id ? "text-white" : "text-white/45 hover:text-white/80"
                      }`}
                    >
                      {l.label}
                      {active === l.id && (
                        <motion.span layoutId="nav-active" className="absolute left-3 right-3 -bottom-0.5 h-px bg-white/70" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => go("contact")}
                className="hidden sm:flex items-center gap-1.5 ml-2 px-4 py-2 bg-white text-black text-[11px] font-semibold uppercase tracking-[0.12em] hover:bg-white/85 transition-colors"
              >
                Hire Me <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setOpen((o) => !o)}
                className="md:hidden ml-1 w-9 h-9 flex items-center justify-center text-white/80 hover:text-white"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-nav"
              >
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </nav>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {open && visible && (
          <motion.div
            id="mobile-nav"
            className="fixed inset-x-4 top-[4.5rem] z-[89] md:hidden border border-white/[0.1] bg-[#050505]/[0.97] backdrop-blur-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="py-2">
              {LINKS.map((l, i) => (
                <li key={l.id}>
                  <button
                    onClick={() => go(l.id)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 text-left text-sm font-mono uppercase tracking-[0.15em] ${
                      active === l.id ? "text-white" : "text-white/55"
                    }`}
                  >
                    <span>
                      <span className="text-white/25 mr-3">{String(i + 1).padStart(2, "0")}</span>
                      {l.label}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-white/30" />
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
