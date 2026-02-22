"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { ArrowUpRight, Github, ExternalLink, X, ChevronUp, ChevronDown } from "lucide-react";

/* ================================================================== */
/*  PROJECT DATA                                                       */
/* ================================================================== */
const PROJECTS = [
  {
    id: "media-platform",
    title: "AI Media Platform",
    short: "Automated media generation system",
    description:
      "An end-to-end agentic AI media platform. Automates image, video, prompt, and document generation using async workflows, real-time WebSockets, and a scalable Python backend.",
    tags: ["Python", "AI Automation", "API Development", "WebSockets"],
    category: "AI Automation",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2016215245298167808",
    github: "#",
    gradient: "from-white/[0.08] via-white/[0.04] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.08)",
    images: [
      { src: "/Project1/Screenshot 2026-01-27 233805.png", label: "Infinite Gallery", desc: "An interactive infinite-scroll gallery displaying real-time generated AI media. Users can instantly execute one-click image generation right from the feed, integrated seamlessly with backend WebSockets." },
      { src: "/Project1/Screenshot 2026-01-27 233825.png", label: "History Directory", desc: "A comprehensive Firebase-powered history directory featuring dynamic thumbnails, cloud-hosted output links, and complete job tracking across all asynchronous AI workflows." },
      { src: "/Project1/Screenshot 2026-01-27 233907.png", label: "Prompt Lab", desc: "A dedicated prompt engineering interface allowing users to test, iterate, and fine-tune raw prompts across multiple LLM and image models, featuring complete control over seed, CFG scale, and safety parameters." },
      { src: "/Project1/Screenshot 2026-01-27 233956.png", label: "Intelligence Pipeline", desc: "A multi-stage prompt intelligence generator that retrieves proven templates from a vector database, synthesizes context, and tailors outputs to highly specific AI models." },
      { src: "/Project1/Screenshot 2026-01-27 234022.png", label: "Batch Convert", desc: "A high-performance media processing pipeline that batch converts images and videos across multiple formats, automatically uploading the final assets to Cloudflare R2 storage for persistent access." },
      { src: "/Project1/Screenshot 2026-01-27 234039.png", label: "Video Interpolation", desc: "Generates incredibly consistent, high-fidelity AI videos using user-specified starting and ending boundary frames, driven by async job polling for long-running compute tasks." },
      { src: "/Project1/Screenshot 2026-01-27 234055.png", label: "Frame Generation", desc: "A modular workflow interface for handling frame-by-frame video generation, translating direct user instructions into precise frame animation prompts via the Python backend." },
      { src: "/Project1/Screenshot 2026-01-27 234106.png", label: "Image Remix", desc: "Advanced computer vision integration that analyzes uploaded images or video frames to reverse-engineer detailed generative prompts, allowing users to effortlessly remix media into brand new AI variations." },
      { src: "/Project1/Screenshot 2026-01-27 234120.png", label: "Caption Engine", desc: "A concurrent generation engine that creates multiple caption styles in parallel for uploaded videos, integrating automatic media compression and optimization routines." },
      { src: "/Project1/Screenshot 2026-01-27 234132.png", label: "Transcript Analysis", desc: "Downloads remote media directly from URLs to generate high-accuracy AI transcripts, automatically extracting critical metadata such as titles, media durations, and fallback thumbnails." },
      { src: "/Project1/Screenshot 2026-01-27 234149.png", label: "Lipsync Studio", desc: "An automated lipsync generation tool that dynamically injects user audio and reference video into an external AI workflow engine, supporting background queuing and comprehensive tracking of job histories." },
      { src: "/Project1/Screenshot 2026-01-27 234206.png", label: "Workflow Orchestration", desc: "An agent-style operational dashboard displaying clear separation of concerns, tracking concurrent AI analyses, validations, and generation events running simultaneously across the platform." },
      { src: "/Project1/Screenshot 2026-01-27 234222.png", label: "Document Generator", desc: "A structured export utility that compiles user-generated images and written content into professionally formatted, stylized PDF documents, fully supporting dynamic multi-frame layouts." },
    ],
    colSpan: "md:col-span-2 lg:col-span-2",
    rowSpan: "md:row-span-2 lg:row-span-2",
  },
  {
    id: "autogenix",
    title: "AutoGenix Website AI",
    short: "Agentic AI Website Generator",
    description:
      "A fully agentic AI system that generates production-ready websites from natural language configs. Features multi-agent architecture to plan UI, write code, self-correct, and deploy live sites autonomously.",
    tags: ["Artificial Intelligence", "Python", "Automation", "Software Architecture"],
    category: "Full Stack AI",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2022718952231931904",
    github: "#",
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.06)",
    images: [
      { src: "/Project2/Screenshot 2026-01-31 234604.png", label: "Site Generator", desc: "The agentic generation engine processes user requests to build highly specific websites, ensuring the user retains absolute control over text copy, functional sections, and overall narrative structure." },
      { src: "/Project2/Screenshot 2026-02-20 212909.png", label: "Unique Designs", desc: "Powered by a dynamic UI planning module, the system creates unique, original theme-matched color palettes, typography systems, and layout combinations for every single website generation request." },
      { src: "/Project2/Screenshot 2026-02-20 213006.png", label: "Deployed Example", desc: "A live demonstration of the system's output: a fully functional, aesthetic website deployed instantly to production using seamless automated Vercel integrations and GitHub repository management." },
      { src: "/Project2/Screenshot 2026-02-20 213019.png", label: "Code Automation", desc: "The core coding agents at work—scaffolding the Next.js frontend, writing strict React functional components, resolving Tailwind CSS dependencies, and executing sequential implementation phases without human intervention." },
      { src: "/Project2/Screenshot 2026-02-20 213033.png", label: "Multi-Agent System", desc: "A transparent agent orchestration dashboard that tracks the entire software development lifecycle in real-time—from initial requirements planning and UI design to code generation and automated quality review." },
      { src: "/Project2/Screenshot 2026-02-20 214011.png", label: "Production Export", desc: "The final pipeline stage: the platform packages the verified Next.js/React codebase into a clean, structured repository, ensuring the generated assets are instantly ready for production environments." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "video-cloning",
    title: "AI Video Cloning",
    short: "Autonomous Video & Script Engine",
    description:
      "An autonomous AI video system capable of cloning existing videos or generating original content. Includes URL-based scene detection, structured prompt engineering, and Instagram auto-publishing.",
    tags: ["Video Automation", "Python", "Prompt Engineering"],
    category: "AI Media",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2017503603302031360",
    github: "#",
    gradient: "from-white/[0.07] via-white/[0.03] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.07)",
    images: [
      { src: "/Project3/Screenshot 2026-02-14 221200.png", label: "Clone Architecture", desc: "The comprehensive visual architecture of the video cloning engine, illustrating how it ingests URLs from Instagram or X, detects scene transitions, and reverse-engineers the creative workflow." },
      { src: "/Project3/Screenshot 2026-02-14 221343.png", label: "Script Pipeline", desc: "The architectural breakdown of the script-to-video automation system, highlighting the seamless progression from topic input and script generation to cinematic prompt creation and temporal scene stitching." },
      { src: "/Project3/Screenshot 2026-02-14 221357.png", label: "Discord Bot UI", desc: "A custom-built Discord bot serving as the primary control interface, allowing users to trigger generations, monitor real-time AI processing status, and receive final video outputs directly in chat." },
      { src: "/Project3/Screenshot 2026-02-14 221447.png", label: "Scene Planner", desc: "The intelligent scene planner operating via structured JSON, utilizing model duration-aware logic to segment long content into manageable chunks while maintaining consistent temporal pacing." },
      { src: "/Project3/gemini_3_pro_1_1771088347372.jpg", label: "Generated Scene", desc: "A pristine sequence of AI-generated images serving as the base frames for video synthesis, demonstrating the system's ability to maintain strict character and lighting consistency across multiple scenes." },
      { src: "/Project3/gemini_3_pro_1_1771088376224.jpg", label: "Pacing Engine", desc: "The internal pacing and sequencing engine at work, meticulously calculating frame transitions and temporal flow to ensure fluid, natural motion in the final rendered AI video." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "comfy-face",
    title: "ComfyUI Face-Blend",
    short: "Photorealistic Baby Generator",
    description:
      "A custom ComfyUI workflow generating ultra-realistic baby images by blending facial features from two parent photos. Uses IPAdapter FaceID, InsightFace, and CLIP Vision for identity preservation.",
    tags: ["ComfyUI", "AI Image Generation", "Image Processing"],
    category: "AI Workflow",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2017675634148597760",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "/Project4/Screenshot 2026-02-01 002158.png", label: "ComfyUI Graph", desc: "The complete, highly optimized ComfyUI graph architecture. This node-based pipeline intricately integrates IPAdapter FaceID, InsightFace, and CLIP Vision logic with SDXL to achieve flawless identity blending and photorealistic baby generation." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "pinterest-blog",
    title: "Pinterest Blog AI",
    short: "Content & Visual Automation",
    description:
      "A platform that generates lifestyle-focused content with a strict Pinterest/Reddit tone, pairing text with parallel-generated aesthetic images. Exports results as structured DOCX and JSON files.",
    tags: ["Python", "Automation", "Contextual Prompting"],
    category: "AI Content",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2018377454311133184",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "/Project5/Screenshot 2026-01-27 235602.png", label: "Blog Dashboard", desc: "The centralized web dashboard that empowers users to precisely configure the tone, topic, and aesthetic style for Pinterest-optimized lifestyle blogs, driving the AI generation parameters seamlessly." },
      { src: "/Project5/Screenshot 2026-01-28 000157.png", label: "Generated Output", desc: "The result of the dual-model parallel pipeline: engaging, strictly formatted Pinterest-style written content flawlessly paired with highly aesthetic, realistic AI photography generated simultaneously." },
      { src: "/Project5/Screenshot 2026-01-28 000207.png", label: "DOCX Export", desc: "The fully automated export system delivering professionally formatted Word (DOCX) documents, featuring structured headings, perfectly embedded aesthetic images, and JSON payloads ready for CMS publishing." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "comic-book",
    title: "Comic Book Generator",
    short: "Personalized Story Flipbook",
    description:
      "An AI-powered application transforming real photos into personalized children’s storybooks. Preserves facial features and art style across a 10-part story, delivering via an interactive flipbook UI.",
    tags: ["Multimodal AI", "Python", "UI Animation"],
    category: "AI Application",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2016219241819762688",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "/Project6/Screenshot 2026-02-02 224216.png", label: "Flipbook Viewer", desc: "An engaging, interactive HTML-based story viewer complete with smooth page-flip animations, offering a realistic digital book experience with dynamic day and night reading themes." },
      { src: "/Project6/Screenshot 2026-02-02 224414.png", label: "Character Consistency", desc: "Demonstration of the system's advanced multimodal character consistency, successfully preserving the identity, facial features, and chosen art style of the parents and child across every page." },
      { src: "/Project6/Screenshot 2026-02-02 230252.png", label: "Narrative Engine", desc: "The output of the AI narrative engine, which crafts wholesome, sequential, and age-appropriate 10-part children’s stories precisely matched to user-defined themes and character references." },
      { src: "/Project6/Screenshot 2026-02-02 230314.png", label: "JSON Output", desc: "The structured backend delivery format incorporating the full narrative text and base64-encoded chapter illustrations within a single, cohesive JSON payload, ensuring effortless frontend viewer integration." },
    ],
    colSpan: "md:col-span-2 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

/* ================================================================== */
/*  WHEEL CAROUSEL — large arc from right edge of screen               */
/* ================================================================== */
function WheelCarousel({
  images,
  activeIndex,
  onSelect,
}: {
  images: { src?: string; bg?: string; label: string; desc: string }[];
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  const IMG_W = 500;
  const IMG_H = 310;
  const RADIUS = 560;
  const ANGLE_STEP = 0.65;        // ~37° between images — spacious gap
  const total = images.length;
  const containerRef = useRef<HTMLDivElement>(null);

  /* Scroll to navigate */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let locked = false;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (locked) return;
      locked = true;
      setTimeout(() => { locked = false; }, 800);
      if (e.deltaY > 0) onSelect(Math.max(0, activeIndex - 1));
      else onSelect(Math.min(total - 1, activeIndex + 1));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [activeIndex, onSelect, total]);

  /*
   * Wheel center is placed to the RIGHT of the container.
   * Active image sits at angle π (9 o'clock = leftmost point of the arc).
   * This means its center-x = wheelCenterX + cos(π) * R = wheelCenterX - R
   *
   * We want the active image to appear mostly inside the container,
   * with its right edge near the container right edge.
   *
   * So: wheelCenterX - R + IMG_W/2 ≈ containerWidth * 0.5
   *     wheelCenterX ≈ containerWidth * 0.5 + R - IMG_W/2
   *
   * We use percentages so it's responsive. Practically for 25-35% of
   * viewport ~= 350px container: center ≈ 350*0.5 + 520 - 210 = 485px from left.
   */

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ zIndex: 20 }}
    >
      {images.map((img, i) => {
        const offset = i - activeIndex;
        const angle = Math.PI + offset * ANGLE_STEP;
        const absDist = Math.abs(offset);

        const cx = Math.cos(angle) * RADIUS;
        const cy = Math.sin(angle) * RADIUS;

        const scale = Math.max(1 - absDist * 0.1, 0.55);
        // Fade to 0 if the image is too far away to prevent background clutter
        const opacity = absDist > 3 ? 0 : Math.max(1 - absDist * 0.25, 0.15);
        const pointerEvents = absDist > 3 ? "none" : "auto";
        const zIndex = 10 - absDist;
        const rotate = offset * (ANGLE_STEP * 180 / Math.PI);

        return (
          <motion.div
            key={i}
            className="absolute cursor-pointer"
            style={{
              width: IMG_W,
              height: IMG_H,
              /* Anchor at right edge of screen, vertically centered */
              right: 0,
              top: "50%",
              marginTop: -IMG_H / 2,
              zIndex,
              pointerEvents,
            }}
            animate={{
              x: cx + RADIUS - 70,   // active image fully visible with 70px right margin
              y: cy,
              scale,
              opacity,
              rotate,
            }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            onClick={() => onSelect(i)}
          >
             {/* Image card */}
            <div className="absolute inset-0 flex items-center justify-center group">
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.label}
                  className={`max-w-full max-h-full object-contain rounded-xl transition-all duration-700 ${
                    i === activeIndex 
                      ? "opacity-100 scale-[1.05]" 
                      : "opacity-40 hover:opacity-75"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 rounded-2xl flex items-center justify-center" style={{ background: img.bg }}>
                  <div className="text-center relative z-10">
                    <div className="w-12 h-12 mx-auto border border-white/20 rounded-xl flex items-center justify-center mb-2">
                      <div className="w-6 h-6 border border-white/30 rounded-lg" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                      {img.label}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

    </div>
  );
}

/* ================================================================== */
/*  FULL SCREEN PROJECT VIEW                                           */
/* ================================================================== */
function ProjectFullView({
  project,
  onClose,
}: {
  project: (typeof PROJECTS)[number];
  onClose: () => void;
}) {
  const [activeImage, setActiveImage] = useState(0);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* keyboard navigation */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowUp" || e.key === "ArrowLeft")
      setActiveImage((p) => Math.max(0, p - 1));
    if (e.key === "ArrowDown" || e.key === "ArrowRight")
      setActiveImage((p) => Math.min(project.images.length - 1, p + 1));
  }, [onClose, project.images.length]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed lg:absolute top-4 right-4 lg:top-6 lg:left-6 z-50 w-10 h-10 border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center hover:border-white/25 hover:bg-white/[0.05] transition-all"
      >
        <X className="w-4 h-4 text-white/50" />
      </button>

      {/* ============================================ */}
      {/* MOBILE IMAGE GALLERY (Visible only < lg)     */}
      {/* ============================================ */}
      <div className="lg:hidden w-full h-[40vh] min-h-[300px] shrink-0 relative border-b border-white/10 bg-black">
        {/* Horizontal Snapping Scroll */}
        <div 
          className="flex h-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(e) => {
            // Very basic scroll spy to update active image index on mobile
            const target = e.target as HTMLDivElement;
            const index = Math.round(target.scrollLeft / target.clientWidth);
            if (index !== activeImage) setActiveImage(index);
          }}
        >
          {project.images.map((img, i) => (
            <div key={i} className="w-full h-full shrink-0 snap-center p-6 flex flex-col items-center justify-center relative">
               {img.src ? (
                <img
                  src={img.src}
                  alt={img.label}
                  className="max-w-full max-h-full object-contain rounded-lg border border-white/[0.05]"
                />
              ) : (
                <div className="w-full h-full max-w-sm rounded-lg flex items-center justify-center border border-white/[0.05]" style={{ background: (img as any).bg || 'rgba(255,255,255,0.02)' }}>
                  <span className="text-xs font-mono uppercase tracking-widest text-white/30">{img.label}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Mobile slide indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {project.images.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${i === activeImage ? 'w-4 bg-white/70' : 'w-1 bg-white/20'}`} 
            />
          ))}
        </div>
      </div>

      <div className="flex-1 lg:h-full flex flex-col lg:flex-row relative">
        {/* ============================================ */}
        {/* LEFT PANEL — Project details                 */}
        {/* ============================================ */}
        <motion.div
          className="w-full lg:w-[62%] h-full flex flex-col justify-between pt-10 lg:pt-20 pb-10 px-6 md:px-14 lg:px-16 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
        >
          {/* Top section — Category + Title + Skills */}
          <div>
            <motion.span
              className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/20 block mb-3 lg:mb-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {project.category} · {project.year}
            </motion.span>

            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-5 lg:mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease }}
            >
              {project.title}
            </motion.h2>

            {/* Skills / Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-6 lg:mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {project.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] lg:text-[11px] font-mono uppercase tracking-wider text-white/40 px-3 py-1.5 lg:px-4 lg:py-2 border border-white/[0.1] bg-white/[0.02]"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Divider */}
            <motion.div
              className="h-px bg-white/[0.08] mb-6 lg:mb-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.35, duration: 0.8, ease }}
              style={{ transformOrigin: "left" }}
            />

            {/* Image description — changes with active image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30 block mb-2 lg:mb-3">
                  {project.images[activeImage].label}
                </span>
                <p className="text-sm md:text-base lg:text-lg text-white/45 leading-relaxed">
                  {project.images[activeImage].desc}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom — Description + Links + counter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-10 lg:mt-auto"
          >
            {/* Project description */}
            <p className="text-[14px] lg:text-[15px] text-white/30 leading-relaxed mb-6">
              {project.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
              <a
                href={project.github}
                className="group flex justify-center items-center gap-2 px-5 py-3 border border-white/[0.1] hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300"
              >
                <Github className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-colors">
                  Source
                </span>
              </a>
              <a
                href={project.link}
                className="group flex justify-center items-center gap-2 px-5 py-3 border border-white/[0.1] hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300"
              >
                <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-colors">
                  Live
                </span>
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-4 text-[10px] font-mono text-white/15 uppercase tracking-wider">
              <span>Image {activeImage + 1} of {project.images.length}</span>
              <span>·</span>
              <span>↑↓ Arrow keys · Scroll to navigate</span>
              <span>·</span>
              <span>ESC Close</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ============================================ */}
      {/* DESKTOP WHEEL CAROUSEL — absolute overlay   */}
      {/* ============================================ */}
      <motion.div
        className="hidden lg:block absolute inset-0 pointer-events-none z-30"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease }}
      >
        <div className="pointer-events-auto absolute right-0 top-0 bottom-0 w-[40%] h-full">
          <WheelCarousel
            images={project.images}
            activeIndex={activeImage}
            onSelect={setActiveImage}
          />
        </div>
      </motion.div>

      {/* Corner brackets (Desktop only to save space on mobile) */}
      <div className="hidden lg:block absolute top-3 left-3 w-5 h-5 border-t border-l border-white/[0.06] pointer-events-none" />
      <div className="hidden lg:block absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/[0.06] pointer-events-none" />
      <div className="hidden lg:block absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/[0.06] pointer-events-none" />
    </motion.div>
  );
}

/* ================================================================== */
/*  BENTO CARD                                                         */
/* ================================================================== */
function BentoCard({
  project,
  index,
  inView,
  onClick,
}: {
  project: (typeof PROJECTS)[number];
  index: number;
  inView: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      className={`group relative ${project.colSpan} ${project.rowSpan} border border-white/[0.06] hover:border-white/[0.14] bg-white/[0.01] cursor-pointer overflow-hidden transition-colors duration-500`}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.8, ease }}
      onClick={onClick}
      whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
    >
      {/* Gradient bg swatch */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-7 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60 group-hover:text-white/90 transition-colors duration-500">
            {project.category}
          </span>
          <motion.div
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.2 }}
          >
            <ArrowUpRight className="w-5 h-5 text-white/80" />
          </motion.div>
        </div>

        <div className="my-auto py-2">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-white group-hover:text-white transition-colors duration-300 tracking-tight leading-tight shadow-black/50 drop-shadow-lg">
            {project.title}
          </h3>
          <p className="text-[14px] text-white/70 group-hover:text-white mt-3 transition-colors duration-500 max-w-sm">
            {project.short}
          </p>
          <motion.div
            className="h-px bg-white/30 mt-5"
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ delay: 0.5 + index * 0.12, duration: 0.6, ease }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {project.tags.map((tag, i) => (
            <motion.span
              key={i}
              className="text-[10px] font-mono uppercase tracking-wider text-white/80 px-3 py-1.5 border border-white/20 bg-white/[0.03] group-hover:bg-white/[0.08] group-hover:border-white/40 group-hover:text-white rounded-md transition-all duration-500"
              initial={{ opacity: 0, y: 8 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.12 + i * 0.06, duration: 0.4 }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
      <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/[0.06] group-hover:border-white/15 transition-colors duration-500" />
      <div className="absolute bottom-3 right-4 text-[8px] font-mono text-white/0 group-hover:text-white/20 transition-colors duration-500">
        click to explore →
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  PROJECTS SECTION                                                   */
/* ================================================================== */
export function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<(typeof PROJECTS)[number] | null>(null);

  return (
    <>
      <section id="projects" ref={ref} className="relative min-h-screen bg-black overflow-hidden flex flex-col justify-center py-20 md:py-28">
        {/* Dot pattern bg */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.05) 1.5px, transparent 1.5px)`,
            backgroundSize: "32px 32px",
          }}
        />

        {/* Subtle lighting overlay */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.015)_0%,transparent_75%)]" />
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-b from-transparent via-transparent to-black" />

        {/* --- CREATIVE ANIMATED BACKGROUND ELEMENTS --- */}
        {/* Deep Animated Auroras */}
        <motion.div 
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.005] blur-[100px] pointer-events-none z-0"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-white/[0.003] blur-[120px] pointer-events-none z-0"
          animate={{ x: [0, -40, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Slow moving wireframe accent rings */}
        <motion.div 
          className="absolute top-[15%] right-[25%] w-[400px] h-[400px] border-[0.5px] border-white/[0.015] rounded-full pointer-events-none z-0 hidden md:block"
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute top-[18%] right-[26%] w-[350px] h-[350px] border-[0.5px] border-white/[0.01] border-dashed rounded-full pointer-events-none z-0 hidden md:block"
          animate={{ rotate: -360, scale: [1, 1.05, 1] }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />

        {/* Noise */}
        <div className="absolute inset-0 z-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
        }} />

        {/* Edge decorations */}
        <motion.div
          className="absolute top-8 left-8 z-10 pointer-events-none"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <span className="text-[10px] font-mono text-white/15 block">x: 004</span>
          <span className="text-[10px] font-mono text-white/15 block">section: projects</span>
          <div className="w-4 h-4 border-t border-l border-white/10 mt-2" />
        </motion.div>

        <motion.div
          className="absolute top-8 right-8 z-10 text-right pointer-events-none"
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="text-[10px] font-mono text-white/15 block">layout: bento</span>
          <div className="w-4 h-4 border-t border-r border-white/10 mt-2 ml-auto" />
        </motion.div>

        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <div>
              <motion.span
                className="text-[10px] font-mono uppercase tracking-[0.4em] text-white/25 block mb-3"
                initial={{ opacity: 0, y: 15 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                004 / Work
              </motion.span>

              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05]"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.7, ease }}
              >
                Selected
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-white/80 via-white/50 to-white/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.8, ease }}
                >
                  {" "}Projects
                </motion.span>
              </motion.h2>
            </div>

            <motion.p
              className="text-white/30 text-sm max-w-xs leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Click any project to explore its details,
              tech stack, and preview images.
            </motion.p>
          </div>

          {/* Divider */}
          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-0"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 1, ease }}
          />

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[300px] gap-px bg-white/[0.03]">
            {PROJECTS.map((project, i) => (
              <BentoCard
                key={project.id}
                project={project}
                index={i}
                inView={inView}
                onClick={() => setSelected(project)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.06]"
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <span className="text-[10px] font-mono text-white/20 uppercase tracking-wider">
              More projects on GitHub
            </span>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2.5 border border-white/[0.1] hover:border-white/25 hover:bg-white/[0.03] transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
              <span className="font-mono text-xs tracking-wider uppercase text-white/50 group-hover:text-white/80 transition-colors">
                View All
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Full-screen project view */}
      <AnimatePresence>
        {selected && (
          <ProjectFullView
            project={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
