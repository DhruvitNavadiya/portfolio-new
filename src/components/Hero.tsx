"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse follow effect for spotlight
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background text-foreground selection:bg-primary/20"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10">
        <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x)_var(--y),rgba(120,119,198,0.1),transparent_25%)]"
            style={{ 
                //@ts-ignore
                "--x": `${mousePosition.x}px`, 
                "--y": `${mousePosition.y}px` 
            }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center"
      >
        {/* Badge / Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/30 px-4 py-1.5 text-sm text-secondary-foreground backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Available for New Projects
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50"
        >
          Dhruvit Navadiya
        </motion.h1>

        {/* Subheading / Role */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light"
        >
          AI Automation Engineer & Agentic Systems Architect.
          <br className="hidden md:block" />
          Building intelligent systems that scale.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
           className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <button className="group relative px-8 py-3 rounded-full bg-foreground text-background font-medium overflow-hidden transition-all hover:scale-105">
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="px-8 py-3 rounded-full border border-border bg-background/50 backdrop-blur-sm hover:bg-secondary/50 transition-all hover:scale-105">
            Contact Me
          </button>
        </motion.div>

        {/* Social Links */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex gap-6 text-muted-foreground"
        >
            <a href="#" className="hover:text-foreground transition-colors"><Github className="w-6 h-6" /></a>
            <a href="#" className="hover:text-foreground transition-colors"><Linkedin className="w-6 h-6" /></a>
            <a href="mailto:navadiyadhruvit@gmail.com" className="hover:text-foreground transition-colors"><Mail className="w-6 h-6" /></a>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-6 h-6 text-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </div>
  );
};
