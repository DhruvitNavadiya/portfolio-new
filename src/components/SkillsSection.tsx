"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Matter from "matter-js";
import {
  SiPython, SiJavascript, SiTypescript, SiCplusplus, 
  SiFastapi, SiNodedotjs, 
  SiPostgresql, SiMongodb, SiRedis, SiPrisma,
  SiAmazon, SiVercel, SiDocker, SiCloudflare, 
  SiOpenai, SiLangchain, SiGooglecloud, 
  SiReact, SiNextdotjs, SiTailwindcss, SiGithub, SiGit, SiLinux
} from "react-icons/si";

const ICONS = [
  // Core Languages
  { icon: SiPython, color: "#3776AB", name: "Python" },
  { icon: SiJavascript, color: "#F7DF1E", name: "JavaScript" },
  { icon: SiTypescript, color: "#3178C6", name: "TypeScript" },
  { icon: SiCplusplus, color: "#00599C", name: "C++" },
  
  // Backend & APIs
  { icon: SiFastapi, color: "#009688", name: "FastAPI" },
  { icon: SiNodedotjs, color: "#339933", name: "Node.js" },
  
  // Databases
  { icon: SiPostgresql, color: "#4169E1", name: "PostgreSQL" },
  { icon: SiMongodb, color: "#47A248", name: "MongoDB" },
  { icon: SiRedis, color: "#DC382D", name: "Redis" },
  { icon: SiPrisma, color: "#2D3748", name: "Prisma" },
  
  // AI & LLMs
  { icon: SiOpenai, color: "#ffffff", name: "OpenAI API" },
  { icon: SiLangchain, color: "#ffffff", name: "LangChain" },
  { icon: SiGooglecloud, color: "#4285F4", name: "Vertex AI" },
  
  // Cloud & DevOps
  { icon: SiAmazon, color: "#FF9900", name: "AWS" },
  { icon: SiVercel, color: "#ffffff", name: "Vercel" },
  { icon: SiDocker, color: "#2496ED", name: "Docker" },
  { icon: SiCloudflare, color: "#F38020", name: "Cloudflare" },
  { icon: SiLinux, color: "#FCC624", name: "Linux" },
  { icon: SiGithub, color: "#ffffff", name: "GitHub" },
  { icon: SiGit, color: "#F05032", name: "Git" },
  
  // Frontend
  { icon: SiNextdotjs, color: "#ffffff", name: "Next.js" },
  { icon: SiReact, color: "#61DAFB", name: "React" },
  { icon: SiTailwindcss, color: "#06B6D4", name: "Tailwind" },
];

export function SkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const nodesRef = useRef<(HTMLDivElement | null)[]>([]);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!inView || !containerRef.current) return;

    // Initialize Matter.js Engine with optimized settings for performance
    const engine = Matter.Engine.create({
      enableSleeping: true, // Allow bodies to sleep when not interacting to save CPU
      positionIterations: 4, // Lower from default 6 for better performance
      velocityIterations: 4, // Lower from default 4
    });
    
    engine.gravity.y = 0; // Zero gravity initially
    engine.gravity.x = 0;
    engineRef.current = engine;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Invisible Boundaries (Made significantly thicker to prevent tunneling without high CPU cost)
    const wallOptions = { 
      isStatic: true, 
      render: { visible: false }, 
      friction: 0.1, 
      restitution: 0.8,
    };
    
    // 500px thick walls so we don't have to calculate precise high-velocity boundary tunneling
    const ground = Matter.Bodies.rectangle(width / 2, height + 250, width * 2, 500, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, -250, width * 2, 500, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-250, height / 2, 500, height * 2, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + 250, height / 2, 500, height * 2, wallOptions);

    Matter.World.add(engine.world, [ground, ceiling, leftWall, rightWall]);

    // Create Bodies for each icon
    const isDesktop = window.innerWidth >= 768;
    const radius = isDesktop ? 45 : 30; // Matches exact pixel sizing in CSS w-[90px] and w-[60px]
    
    const bodies = ICONS.map((_, i) => {
      // Keep initial spawn closer to center to avoid spawning inside walls on weird aspect ratios
      const x = (Math.random() * (width * 0.6)) + (width * 0.2);
      const y = (Math.random() * (height * 0.6)) + (height * 0.2);
      
      const body = Matter.Bodies.circle(x, y, radius, {
        restitution: 0.9, // Bouncy
        friction: 0.01,
        frictionAir: 0.02,
        density: 0.001, // Lighter bodies require less effort to move
        slop: 0.05, // Allow slightly more overlap for better performance
      });

      // Random initial velocity
      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 6,
        y: (Math.random() - 0.5) * 6
      });
      // Give them a slightly random rotation to start so they tumble nicely
      Matter.Body.setAngle(body, Math.random() * Math.PI * 2);

      return body;
    });

    Matter.World.add(engine.world, bodies);

    // Add Mouse Interaction
    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2, // Slightly stiffer to feel more solid when dragging blocks
        render: { visible: false }
      }
    });

    // Don't capture scroll wheel, only drag events
    mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    Matter.World.add(engine.world, mouseConstraint);

    // ── CREATIVE ENHANCEMENTS ──
    
    // Gravity Well Effect
    Matter.Events.on(engine, 'beforeUpdate', () => {
      if (mouse.position.x !== 0 && mouse.position.y !== 0) {
        bodies.forEach((body) => {
          const dx = mouse.position.x - body.position.x;
          const dy = mouse.position.y - body.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 500 && distance > 50) { 
            const forceMagnitude = 0.000015; // Gentle pull
            Matter.Body.applyForce(body, body.position, {
              x: (dx / distance) * forceMagnitude,
              y: (dy / distance) * forceMagnitude,
            });
          }
        });
      }
    });


    // Start Engine
    const runner = Matter.Runner.create();
    (runner as any).isFixed = true; 
    Matter.Runner.run(runner, engine);
    runnerRef.current = runner;

    // React Transform Loop - Optimized with WillChange
    let animationFrameId: number;
    
    const renderLoop = () => {
      if (nodesRef.current.length === bodies.length) {
        bodies.forEach((body, i) => {
          const node = nodesRef.current[i];
          if (node) {
            // Apply coordinates. We subtract radius because DOM origin is top-left, physics origin is center
            node.style.transform = `translate3d(${body.position.x - radius}px, ${body.position.y - radius}px, 0) rotate(${body.angle}rad)`;
          }
        });
      }
      // Rely solely on native rAF pacing for perfect alignment with monitor refresh rate, preventing jitter
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Handle Window Resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!containerRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        
        Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 250 });
        Matter.Body.setPosition(ceiling, { x: newWidth / 2, y: -250 });
        Matter.Body.setPosition(leftWall, { x: -250, y: newHeight / 2 });
        Matter.Body.setPosition(rightWall, { x: newWidth + 250, y: newHeight / 2 });
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
    };
  }, [inView]);

  return (
    <section ref={ref} className="relative bg-black py-24 md:py-32 border-t border-white/[0.05] overflow-hidden min-h-screen flex flex-col items-center justify-center">
      
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,black_100%)]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center max-w-[100vw]">
        
        {/* Header */}
        <div className="text-center mb-8 md:mb-12 px-6 pointer-events-none">
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
            Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/70 to-white/10">Technologies</span>
          </motion.h2>
          
          <motion.p
            className="text-white/40 text-sm md:text-base max-w-lg mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Interact with the physics environment below. Drag, throw, and sort the stack!
          </motion.p>
        </div>

        {/* ── Premium Bento Box Physics Container ── */}
        <motion.div 
          ref={containerRef}
          className="relative w-[95%] md:w-[90%] max-w-[1200px] h-[450px] md:h-[550px] lg:h-[700px] mx-auto border border-white/[0.15] bg-[#050505] overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.01),0_10px_30px_rgba(0,0,0,0.5)] md:shadow-[inset_0_0_40px_rgba(255,255,255,0.02),0_20px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl rounded-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ cursor: "grab" }}
        >
          {/* Subtle Grid Background inside the box */}
          <div 
            className="absolute inset-0 opacity-[0.2] md:opacity-[0.4] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          {/* Inner glowing shadows for depth */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] md:shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
          
          {/* ── Thematic Developer Decorations ── */}
          {/* Corner brackets - shrink on mobile */}
          <div className="absolute top-0 left-0 w-6 h-6 md:w-16 md:h-16 border-t-2 border-l-2 border-white/20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-6 h-6 md:w-16 md:h-16 border-t-2 border-r-2 border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-6 h-6 md:w-16 md:h-16 border-b-2 border-l-2 border-white/20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-6 h-6 md:w-16 md:h-16 border-b-2 border-r-2 border-white/20 pointer-events-none" />
          
          {/* Vertical text on the sides - hide on extremely small screens */}
          <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 left-2 md:left-4 text-white/20 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em] pointer-events-none rotate-180" style={{ writingMode: 'vertical-rl' }}>
            SYS.CORE.ACTIVE // 006
          </div>
          <div className="hidden sm:block absolute top-1/2 -translate-y-1/2 right-2 md:right-4 text-white/20 font-mono text-[8px] md:text-[10px] uppercase tracking-[0.3em] pointer-events-none" style={{ writingMode: 'vertical-rl' }}>
            ENG.SIMULATION_RUNNING
          </div>

          {/* Top-left label decoration */}
          <div className="absolute top-4 md:top-6 left-4 md:left-8 text-white/30 font-mono text-[8px] md:text-[10px] uppercase tracking-widest pointer-events-none flex items-center gap-2 md:gap-3">
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            Interactive Sandbox
          </div>

          {/* Render the icon nodes that will follow matter.js bodies */}
          {ICONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                ref={(el) => {
                  nodesRef.current[idx] = el;
                }}
                className="absolute top-0 left-0 w-[60px] h-[60px] md:w-[90px] md:h-[90px] rounded-full bg-[#0a0a0a] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:border-white/30 hover:bg-white/5 transition-colors group"
                style={{
                  userSelect: 'none',
                  touchAction: 'none',
                  willChange: 'transform',
                  backfaceVisibility: 'hidden',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                {/* Subtle core glow based on icon color */}
                <div 
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"
                  style={{ backgroundColor: item.color }}
                />
                
                {/* Tooltip Label - Kept as a pure sibling to prevent filter clipping */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <span className="relative flex items-center justify-center bg-[#111] border border-white/10 text-white text-xs font-mono px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                    {item.name}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#111] border-b border-r border-white/10 rotate-45" />
                  </span>
                </div>

                {/* The Icon itself */}
                <div className="relative z-10 w-8 h-8 md:w-12 md:h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-full h-full" style={{ color: item.color || '#ffffff' }} />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
