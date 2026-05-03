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
    short: "End-to-end agentic AI platform automating image, video & document generation with async workflows and real-time WebSockets",
    description: "An end-to-end agentic AI media platform that automates image, video, prompt, and document generation using async workflows, real-time WebSockets, and a scalable Python backend. Features include infinite-scroll media galleries, batch format conversion with Cloudflare R2 storage, frame-by-frame video interpolation, AI lipsync generation, transcript analysis, and a multi-stage prompt intelligence pipeline powered by vector database retrieval. Built for a client on Upwork, designed to handle concurrent AI workloads at scale.",
    tags: ["Python", "FastAPI", "WebSockets", "Firebase", "Cloudflare R2", "ComfyUI", "FFmpeg", "LLM Orchestration"],
    stats: [{ label: "Automation Rate", value: "94%" }, { label: "Faster Delivery", value: "3x" }, { label: "Concurrent Jobs", value: "50+" }],
    category: "AI Automation",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2016215245298167808",
    github: "#",
    gradient: "from-white/[0.08] via-white/[0.04] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.08)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799073/portfolio/jnbslu9eechdakwvmkcj.webp", label: "Infinite Gallery", desc: "An interactive infinite-scroll gallery displaying real-time generated AI media. Users can instantly execute one-click image generation right from the feed, integrated seamlessly with backend WebSockets." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799074/portfolio/oxjjgyua07ikpmvbbsxy.webp", label: "History Directory", desc: "A comprehensive Firebase-powered history directory featuring dynamic thumbnails, cloud-hosted output links, and complete job tracking across all asynchronous AI workflows." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799077/portfolio/wsscpk7dztyw1pfkcj6i.webp", label: "Prompt Lab", desc: "A dedicated prompt engineering interface allowing users to test, iterate, and fine-tune raw prompts across multiple LLM and image models, featuring complete control over seed, CFG scale, and safety parameters." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799078/portfolio/fg8lzrlbxaqruip3zul3.webp", label: "Intelligence Pipeline", desc: "A multi-stage prompt intelligence generator that retrieves proven templates from a vector database, synthesizes context, and tailors outputs to highly specific AI models." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799081/portfolio/aeagvkms3xuusvlpngpc.webp", label: "Batch Convert", desc: "A high-performance media processing pipeline that batch converts images and videos across multiple formats, automatically uploading the final assets to Cloudflare R2 storage for persistent access." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799083/portfolio/r6hrlkgubkapryvqhbdc.webp", label: "Video Interpolation", desc: "Generates incredibly consistent, high-fidelity AI videos using user-specified starting and ending boundary frames, driven by async job polling for long-running compute tasks." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799084/portfolio/igwegkpoziqyh3dnzf9j.webp", label: "Frame Generation", desc: "A modular workflow interface for handling frame-by-frame video generation, translating direct user instructions into precise frame animation prompts via the Python backend." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799086/portfolio/bfkxmmgapyvxbidlrzbr.webp", label: "Image Remix", desc: "Advanced computer vision integration that analyzes uploaded images or video frames to reverse-engineer detailed generative prompts, allowing users to effortlessly remix media into brand new AI variations." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799087/portfolio/ow3eabpkhtjoe6sgnmmo.webp", label: "Caption Engine", desc: "A concurrent generation engine that creates multiple caption styles in parallel for uploaded videos, integrating automatic media compression and optimization routines." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799088/portfolio/ek3wlkr0jbzjcablqbva.webp", label: "Transcript Analysis", desc: "Downloads remote media directly from URLs to generate high-accuracy AI transcripts, automatically extracting critical metadata such as titles, media durations, and fallback thumbnails." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799091/portfolio/wcd1ns0zhyucsixv27cf.webp", label: "Lipsync Studio", desc: "An automated lipsync generation tool that dynamically injects user audio and reference video into an external AI workflow engine, supporting background queuing and comprehensive tracking of job histories." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799092/portfolio/g2heshjc6tlj3nb37vrk.webp", label: "Workflow Orchestration", desc: "An agent-style operational dashboard displaying clear separation of concerns, tracking concurrent AI analyses, validations, and generation events running simultaneously across the platform." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799094/portfolio/akde3ufk2ka2ydgeogu9.webp", label: "Document Generator", desc: "A structured export utility that compiles user-generated images and written content into professionally formatted, stylized PDF documents, fully supporting dynamic multi-frame layouts." },
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
    tags: ["Python", "Next.js", "React", "Tailwind CSS", "Multi-Agent", "Vercel", "GitHub API"],
    stats: [{ label: "Code Accuracy", value: "92%" }, { label: "Deploy Time", value: "<2min" }, { label: "Zero Manual", value: "100%" }],
    category: "Full Stack AI",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2022718952231931904",
    github: "#",
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.06)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799095/portfolio/ndn6dom5ycayxrjolcd3.webp", label: "Site Generator", desc: "The agentic generation engine processes user requests to build highly specific websites, ensuring the user retains absolute control over text copy, functional sections, and overall narrative structure." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799099/portfolio/eaqvlngmjerpwfigkz5s.webp", label: "Unique Designs", desc: "Powered by a dynamic UI planning module, the system creates unique, original theme-matched color palettes, typography systems, and layout combinations for every single website generation request." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799101/portfolio/qumhr99rowhjifrkdbqt.webp", label: "Deployed Example", desc: "A live demonstration of the system's output: a fully functional, aesthetic website deployed instantly to production using seamless automated Vercel integrations and GitHub repository management." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799103/portfolio/aocomnke0rskqie1menx.webp", label: "Code Automation", desc: "The core coding agents at work—scaffolding the Next.js frontend, writing strict React functional components, resolving Tailwind CSS dependencies, and executing sequential implementation phases without human intervention." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799107/portfolio/wawxho2tjpqfnh1j3rvp.webp", label: "Multi-Agent System", desc: "A transparent agent orchestration dashboard that tracks the entire software development lifecycle in real-time—from initial requirements planning and UI design to code generation and automated quality review." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799109/portfolio/hqi7goagdogkhxuqjnhi.webp", label: "Production Export", desc: "The final pipeline stage: the platform packages the verified Next.js/React codebase into a clean, structured repository, ensuring the generated assets are instantly ready for production environments." },
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
    tags: ["Python", "FFmpeg", "Discord.py", "Scene Detection", "Prompt Engineering", "Instagram API"],
    stats: [{ label: "Scene Accuracy", value: "89%" }, { label: "Production Speed", value: "5x" }],
    category: "AI Media",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2017503603302031360",
    github: "#",
    gradient: "from-white/[0.07] via-white/[0.03] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.07)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799110/portfolio/cmua8neuyou961uymq9g.webp", label: "Clone Architecture", desc: "The comprehensive visual architecture of the video cloning engine, illustrating how it ingests URLs from Instagram or X, detects scene transitions, and reverse-engineers the creative workflow." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799111/portfolio/rdrtdjw9p64ds7h12y4x.webp", label: "Script Pipeline", desc: "The architectural breakdown of the script-to-video automation system, highlighting the seamless progression from topic input and script generation to cinematic prompt creation and temporal scene stitching." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799112/portfolio/zom0jmahgqtwsre1zuev.webp", label: "Discord Bot UI", desc: "A custom-built Discord bot serving as the primary control interface, allowing users to trigger generations, monitor real-time AI processing status, and receive final video outputs directly in chat." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799114/portfolio/jhlvlpj0c5i3geaqjwqb.webp", label: "Scene Planner", desc: "The intelligent scene planner operating via structured JSON, utilizing model duration-aware logic to segment long content into manageable chunks while maintaining consistent temporal pacing." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799116/portfolio/ih5ml1woc1kenylbjqwo.webp", label: "Generated Scene", desc: "A pristine sequence of AI-generated images serving as the base frames for video synthesis, demonstrating the system's ability to maintain strict character and lighting consistency across multiple scenes." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799119/portfolio/gryzyxao8z8bwoqhwefq.webp", label: "Pacing Engine", desc: "The internal pacing and sequencing engine at work, meticulously calculating frame transitions and temporal flow to ensure fluid, natural motion in the final rendered AI video." },
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
    tags: ["ComfyUI", "SDXL", "IPAdapter", "InsightFace", "CLIP Vision", "Image Processing"],
    stats: [{ label: "Identity Match", value: "97%" }, { label: "Realism Score", value: "95%" }],
    category: "AI Workflow",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2017675634148597760",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799121/portfolio/dztzgqece2xu0gyv7lbe.webp", label: "ComfyUI Graph", desc: "The complete, highly optimized ComfyUI graph architecture. This node-based pipeline intricately integrates IPAdapter FaceID, InsightFace, and CLIP Vision logic with SDXL to achieve flawless identity blending and photorealistic baby generation." },
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
    tags: ["Python", "OpenAI", "DALL·E", "DOCX Export", "JSON", "Pinterest SEO"],
    stats: [{ label: "Content Output", value: "10x" }, { label: "Style Match", value: "93%" }],
    category: "AI Content",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2018377454311133184",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799122/portfolio/b1cdyarh0ppdyykiwr1w.webp", label: "Blog Dashboard", desc: "The centralized web dashboard that empowers users to precisely configure the tone, topic, and aesthetic style for Pinterest-optimized lifestyle blogs, driving the AI generation parameters seamlessly." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799125/portfolio/n99szgengsnx7uveqduj.webp", label: "Generated Output", desc: "The result of the dual-model parallel pipeline: engaging, strictly formatted Pinterest-style written content flawlessly paired with highly aesthetic, realistic AI photography generated simultaneously." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799129/portfolio/pgxffjm4t3aoduuckg1b.webp", label: "DOCX Export", desc: "The fully automated export system delivering professionally formatted Word (DOCX) documents, featuring structured headings, perfectly embedded aesthetic images, and JSON payloads ready for CMS publishing." },
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
    tags: ["Python", "Multimodal AI", "HTML5 Canvas", "CSS Animations", "JSON", "PDF Export"],
    stats: [{ label: "Face Consistency", value: "96%" }, { label: "Story Coherence", value: "98%" }],
    category: "AI Application",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025?p=2016219241819762688",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799132/portfolio/qjqtpuwzsiqa8mbbeit2.webp", label: "Flipbook Viewer", desc: "An engaging, interactive HTML-based story viewer complete with smooth page-flip animations, offering a realistic digital book experience with dynamic day and night reading themes." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799136/portfolio/wlsyykrklwj5rdfqfv1r.webp", label: "Character Consistency", desc: "Demonstration of the system's advanced multimodal character consistency, successfully preserving the identity, facial features, and chosen art style of the parents and child across every page." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799138/portfolio/ylj61bzzdtyzm3uunyoz.webp", label: "Narrative Engine", desc: "The output of the AI narrative engine, which crafts wholesome, sequential, and age-appropriate 10-part children’s stories precisely matched to user-defined themes and character references." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799142/portfolio/d1c9a3kr0soxk4zpmq6t.webp", label: "JSON Output", desc: "The structured backend delivery format incorporating the full narrative text and base64-encoded chapter illustrations within a single, cohesive JSON payload, ensuring effortless frontend viewer integration." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "linktrap",
    title: "LinkTrap Traffic Analytics",
    short: "Social Media Traffic Tracker & Link Generator",
    description:
      "A specialized traffic tracking application that monitors user activity originating from social media posts. It generates custom tracking links and leverages Google BigQuery for comprehensive data analytics and overall user journey tracking.",
    tags: ["React", "Analytics", "Google BigQuery", "REST API", "Database", "Dashboard"],
    stats: [{ label: "Data Pipeline", value: "Real-time" }, { label: "Tracking Detail", value: "High" }],
    category: "Data Analytics",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799144/portfolio/gm62jz9koinfkvhz1dab.webp", label: "Dashboard", desc: "Main analytics dashboard providing high-level overviews of social traffic." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799146/portfolio/hkmbs8mkyd75ikobf87l.webp", label: "Link Generation", desc: "Interface for creating specialized tracking links for social campaigns." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799149/portfolio/suv0cbnsukeqgo4mlmze.webp", label: "Data Visualization", desc: "Detailed breakdown of traffic sources and user engagement metrics." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799152/portfolio/tq7xvksi2zfz98nyg2dz.webp", label: "BigQuery Integration", desc: "Underlying data structure synced with Google BigQuery for scalable analysis." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "seo-automation",
    title: "SEO Automation Platform",
    short: "Full-Stack App Automating SEO Content Creation",
    description:
      "A comprehensive 6-step workflow platform for generating highly optimized SEO websites. Automates keyword research, SERP scraping, metadata generation, and content creation using Gemini AI. Features exact match domain (EMD) management, multi-language translation, and direct GitHub publishing.",
    tags: ["Next.js", "TypeScript", "FastAPI", "Gemini AI", "Firebase", "Web Scraping", "GitHub API"],
    stats: [{ label: "Content Scale", value: "100x" }, { label: "SEO Score", value: "98%" }],
    category: "Full Stack AI",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
    github: "#",
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.06)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799154/portfolio/ncnx250yzjfvywctiifl.webp", label: "Workflow Manager", desc: "Central hub for orchestrating the 6-step SEO automation pipeline." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799156/portfolio/rkupkjszliavq6xuixk2.webp", label: "Keyword Engine", desc: "Automated keyword research and SERP scraping interface." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799158/portfolio/uqhweysoqfv2ztbl1knt.webp", label: "AI Content Generator", desc: "Gemini AI integration for generating optimized section content and metadata." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799160/portfolio/idknbuflw2d7wy29xxxd.webp", label: "Domain Management", desc: "Exact match domain (EMD) management and site configuration." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799164/portfolio/mlyar4sdaxsdxnvswweo.webp", label: "JSON Publishing", desc: "Automated pipeline converting JSON structures to multi-language websites via GitHub." },
    ],
    colSpan: "md:col-span-2 lg:col-span-2",
    rowSpan: "md:row-span-2 lg:row-span-2",
  },
  {
    id: "resume-dashboard",
    title: "Agency Resume Dashboard",
    short: "Automated Notion Resume Sync & Deduplication",
    description:
      "A centralized dashboard platform allowing multiple recruitment agencies to upload candidate resumes. It automatically syncs documents to a master Notion database and utilizes AI to detect and reject duplicate submissions, saving costs and maintaining a clean, single-source-of-truth database.",
    tags: ["Next.js", "TypeScript", "Node.js", "OpenAI API", "Notion API"],
    stats: [{ label: "Duplicate Rejection", value: "100%" }, { label: "Data Sync", value: "Real-time" }],
    category: "SaaS Automation",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
    github: "#",
    gradient: "from-white/[0.04] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.04)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799166/portfolio/jbsgwv1j1agczry5yiba.webp", label: "Agency Dashboard", desc: "Main management interface for agencies to upload and track candidate resumes." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799168/portfolio/tbf1eh6chb4scecwbcle.webp", label: "Upload Portal", desc: "Drag-and-drop resume upload portal connected to backend parsing pipelines." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799171/portfolio/pmnhghzw8w1dkuyok17g.webp", label: "Duplicate Detection", desc: "Automated alert system notifying agencies when a candidate is already in the database." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799173/portfolio/sqbagau88gsqum7xsmyy.webp", label: "Notion Database", desc: "The centralized master database in Notion, synced in real-time with the web platform." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "ampere-chatbot",
    title: "Ampere Chatbot & Ticketing",
    short: "Tri-Service AI Chat & Support Operations Platform",
    description:
      "A comprehensive AI-driven customer support system built on a tri-service architecture. Features an embeddable smart chat widget with multi-session recovery, a powerful Node.js/SQLite RAG backend to prevent AI hallucinations, and a Next.js support dashboard for live high-volume ticket management and agent takeover.",
    tags: ["Next.js", "React", "Node.js", "Socket.IO", "Firebase", "SQLite", "OpenAI"],
    stats: [{ label: "AI Resolution", value: "High" }, { label: "Real-time Sync", value: "<1s" }],
    category: "AI SaaS",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
    github: "#",
    gradient: "from-white/[0.06] via-white/[0.03] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.06)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799174/portfolio/pjhybnuxfm2x8fbem3c1.webp", label: "Smart Widget", desc: "Embeddable customer-facing chat widget featuring smart route filtering, live typing indicators, and persistent multi-session recovery via WebSockets." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799175/portfolio/uhyqvmnyhyjyrulxfhah.webp", label: "RAG AI Engine", desc: "Backend RAG pipeline loading knowledge base files to answer questions dynamically without hallucination, supporting auto-escalation when the AI cannot resolve the query." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799176/portfolio/lqmpjfrl7xrigy1miccl.webp", label: "Agent Dashboard", desc: "High-volume ticket table allowing human agents to filter live active and closed tickets, with URL state persistence for easy sharing among managers." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799177/portfolio/jmt6zmnm0ogvhmjwuqnn.webp", label: "Workspace View", desc: "Three-panel detail workspace showing ticket metadata, live chat window with agent-takeover capabilities, and synced Firebase customer data context." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799179/portfolio/m23jmplrhjfkoq0lxt1q.webp", label: "Knowledge Gaps", desc: "Unanswered questions view highlighting cases where the AI triggered auto-escalation, providing a clear feedback loop for administrators to update the knowledge base." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799181/portfolio/b3bovbwrgqzxr6tyh3mt.webp", label: "System Health", desc: "Global network health monitoring with live ApiHealthBadge and ConnectionBadge components to alert staff if WebSockets or APIs go offline." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799182/portfolio/ofu8d1dp5vauj0zhrtsr.webp", label: "Discord Alerts", desc: "Real-time Discord webhooks sending critical event notifications directly to the support team, ensuring instant visibility on escalations." },
    ],
    colSpan: "md:col-span-2 lg:col-span-2",
    rowSpan: "md:row-span-2 lg:row-span-2",
  },
  {
    id: "future-fulfillment",
    title: "Future Fulfillment Logistics",
    short: "Multi-Service Logistics Investigation Platform",
    description:
      "A complete e-commerce logistics platform letting sellers view ChannelDock orders, raise investigations, and track case progress. Composed of a Next.js portal, a Node.js email automation worker, and a Python/FastAPI headless browser bot for Freshdesk integrations.",
    tags: ["Next.js", "TypeScript", "Node.js", "Python", "FastAPI", "Firebase", "Firestore", "Playwright"],
    stats: [{ label: "Automated Routing", value: "100%" }, { label: "Carrier Matching", value: "High" }],
    category: "Operations Automation",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
    github: "#",
    gradient: "from-white/[0.05] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.05)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799184/portfolio/ejgp64aew4hgsq9uhxvi.webp", label: "Seller Dashboard", desc: "Next.js seller-facing portal integrating ChannelDock orders and Firebase Auth, offering streamlined shipment visibility and status filtering." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799185/portfolio/yoe67tcmtldu0nmkcufs.webp", label: "Query Submission", desc: "Structured investigation form allowing sellers to specify issues, upload evidence directly to Google Drive, and instantly log cases into Firestore." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799187/portfolio/wrtukqbtcvwrytdlfepa.webp", label: "Case Tracking", desc: "Live case tracker visualizing the lifecycle of an investigation from submission to carrier review to final resolution, utilizing Firestore for state." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799189/portfolio/yzzs54vrfvgrsegbtti3.webp", label: "Automated Dispatch", desc: "Node.js background worker claiming pending cases transactionally and routing them as direct emails or Freshdesk tickets via a Python browser bot." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799191/portfolio/qxihgln3ks1jwdqmwwlp.webp", label: "Carrier Ingestion", desc: "Inbound Gmail API processor parsing complex carrier auto-replies and forwarding verified case updates directly into the portal conversation thread." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799193/portfolio/uee39rmumuzijbirea1p.webp", label: "Freshdesk Sync", desc: "Python FastAPI service using Camoufox to automate Freshdesk UI operations, creating, updating, and synchronizing ticket closures across systems." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799195/portfolio/i41ois3mxvys5deaaib6.webp", label: "Message History", desc: "Full audit trail conversation view persisting all seller, carrier, and system messages independently of the high-level investigation status." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799197/portfolio/gb9miud3p8l93tj5pkko.webp", label: "Admin Reporting", desc: "Data insights mapping carrier responses and ticket closures to individual seller accounts for streamlined internal operations review." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  },
  {
    id: "floris-tv",
    title: "Floris TV Live Updates",
    short: "Real-Time Warehouse Operations Dashboard",
    description:
      "A real-time logistics and warehouse coordination dashboard with an admin back office. Features department-based active worker tracking, subtask assignment, business-hour timers, and complex Excel/CSV operations reporting synchronized via Firestore.",
    tags: ["Next.js", "React", "Firebase", "Firestore"],
    stats: [{ label: "Sync Speed", value: "Real-time" }, { label: "Data Tracking", value: "100%" }],
    category: "Dashboard UI",
    year: "2026",
    link: "https://www.upwork.com/freelancers/~01c62dbeb138533025",
    github: "#",
    gradient: "from-white/[0.04] via-white/[0.02] to-white/[0.01]",
    accentColor: "rgba(255,255,255,0.04)",
    images: [
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799198/portfolio/eep3bwd9vc0vmjohggbs.webp", label: "TV Operations View", desc: "Public live dashboard optimized for warehouse TV display, showing department columns, active employees, subtasks, and real-time timers." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799201/portfolio/vljqea1voprmayyaxdpo.webp", label: "Drag-and-Drop Mgmt", desc: "Interactive workforce assignment allowing managers to drag employees between departments or directly onto subtasks to update live rosters instantly." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799204/portfolio/vqt9i4dlsfpafe0yhcvl.webp", label: "Task Modals", desc: "Detailed task creation and management modal supporting descriptions, employee assignment, attachment uploads via Firebase Storage, and custom timer overrides." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799207/portfolio/sfq7qnharooaskncurv8.webp", label: "Activity Logs", desc: "Employee-level detail view showcasing current assignments, active subtasks, historical assignment transitions, and logged time analytics." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799210/portfolio/kmozvrilqqiz3hjz03ig.webp", label: "Admin Workspace", desc: "Password-protected administrative control panel enabling detailed task creation, permanent deletion capabilities, and workforce configuration." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799211/portfolio/vvccwbxi8ily1bfhxjss.webp", label: "Time Tracking Engine", desc: "Business-logic driven time tracker enforcing Netherlands local time (Europe/Amsterdam), automatically pausing between midnight and 9:00 AM." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799213/portfolio/mflqboxa7i7hvnigubkg.webp", label: "Data Export Pipeline", desc: "Advanced reporting tools generating highly structured Excel workbooks featuring daily KPI summaries, department performance, and task logs." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799214/portfolio/lpdbv1re0rrdzx2hlpjt.webp", label: "Completed Archives", desc: "Dedicated history view separating completed operations from active workflow, allowing admins to reopen or audit finalized warehouse tasks." },
      { src: "https://res.cloudinary.com/deq6qmh8n/image/upload/v1777799216/portfolio/u8uncjlszc5ljevrlhlr.webp", label: "Live Sync Engine", desc: "Firestore-backed synchronization keeping dashboard screens, admin panels, and active Modals constantly refreshed without manual browser reloads." },
    ],
    colSpan: "md:col-span-1 lg:col-span-1",
    rowSpan: "md:row-span-1 lg:row-span-1",
  }
];

const ease = [0.16, 1, 0.3, 1] as const;

/* Tool icon SVGs — keyed by tag name */
const TOOL_ICONS: Record<string, string> = {
  "Python": "M14.25 2.26l-.02-.01c-1.85-.44-2.99-.35-3.73-.14-.37.1-.63.26-.82.43-.09.09-.15.17-.2.24l-.02.04v3.36h4.07v.85H6.57c-.47 0-2.76.27-3.43 3.17-.08.35-.25 1.2-.26 2.08 0 .97.1 1.84.36 2.6.38 1.08.95 1.72 1.72 2.06.46.2 1.02.3 1.64.3h1.06v-2.76c0-.53.43-2.93 2.88-2.93h4.07c.38 0 2.49-.1 2.49-2.49V5.36c0-.35-.42-2.35-2.85-3.1zm-4.7 1.78c-.41 0-.74-.33-.74-.74s.33-.74.74-.74.74.33.74.74-.33.74-.74.74z M18.53 7.67h-1.06v2.66c0 .72-.56 3.03-2.88 3.03H10.5c-.54 0-2.49.33-2.49 2.49v4.01c0 .35.73 1.88 2.85 2.55 1.01.32 1.88.38 2.72.18.36-.08.7-.24.97-.42.12-.09.2-.17.27-.26l.01-.03V19.5h-4.07v-.85h6.97c.47 0 1.64-.33 2.42-1.62.33-.55.62-1.25.76-2.12.14-.88.17-1.72.08-2.54-.13-1.16-.47-2.01-1.03-2.64-.42-.47-.93-.8-1.55-1.03-.37-.14-.78-.23-1.22-.27l-.46-.03v-.73zm-3.98 11.29c.41 0 .74.33.74.74s-.33.74-.74.74-.74-.33-.74-.74.33-.74.74-.74z",
  "FastAPI": "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  "WebSockets": "M4 12a8 8 0 018-8m0 0a8 8 0 018 8m-8-8v16m8-8H4m3.5-4.5l9 9m0-9l-9 9",
  "Firebase": "M5.2 19.4l2.2-13.6L9 9.5l3-6 3 6 1.6-3.7L18.8 19.4H5.2z",
  "Cloudflare R2": "M16.5 12c0-2.5-2-4.5-4.5-4.5S7.5 9.5 7.5 12m9 0c0 2.5-2 4.5-4.5 4.5s-4.5-2-4.5-4.5m0 0H2m20 0h-5.5M12 2v4m0 12v4",
  "ComfyUI": "M12 2a10 10 0 100 20 10 10 0 000-20zm0 5a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z",
  "FFmpeg": "M4 4h16v16H4V4zm2 2v12h12V6H6zm2 3h8v2H8V9zm0 4h5v2H8v-2z",
  "LLM Orchestration": "M12 2v4m0 12v4M6 12H2m20 0h-4m-1.5-6.5L14 8m-4 8l-2.5 2.5M18.5 5.5L16 8M8 16l-2.5 2.5M12 8a4 4 0 100 8 4 4 0 000-8z",
  "Next.js": "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14V9.5l7 8.5h-2l-5-6v5h-1.5v-5l-2.5 3H6l4-5v5H9z",
  "React": "M12 12m-2 0a2 2 0 104 0 2 2 0 10-4 0M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.74 0 3.41.56 4.78 1.57L12 12l-4.78-5.43A8.96 8.96 0 0112 5zm-7 7c0-1.74.56-3.41 1.57-4.78L12 12l-5.43 4.78A8.96 8.96 0 015 12zm7 7c-1.74 0-3.41-.56-4.78-1.57L12 12l4.78 5.43A8.96 8.96 0 0112 19z",
  "Tailwind CSS": "M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35.98 1 2.12 2.15 4.6 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C15.62 7.15 14.48 6 12 6zM7 12c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.9 1.35C8.38 16.85 9.52 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.9-1.35C10.62 13.15 9.48 12 7 12z",
  "Multi-Agent": "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm14 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
  "Vercel": "M12 2l10 18H2L12 2z",
  "GitHub API": "M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.7C6.73 19.91 6.14 17.97 6.14 17.97c-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85 0 1.7.11 2.5.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0022 12c0-5.52-4.48-10-10-10z",
  "Discord.py": "M20.32 4.37a19.8 19.8 0 00-4.93-1.51.07.07 0 00-.08.04c-.21.38-.45.87-.61 1.26a18.27 18.27 0 00-5.4 0 12.6 12.6 0 00-.62-1.26.07.07 0 00-.08-.04 19.74 19.74 0 00-4.93 1.51.07.07 0 00-.03.03C1.11 8.39.34 12.28.79 16.12a.08.08 0 00.03.05 19.9 19.9 0 005.99 3.03.07.07 0 00.08-.03c.46-.63.87-1.3 1.22-2a.07.07 0 00-.04-.1 13.1 13.1 0 01-1.87-.9.07.07 0 01-.01-.12c.13-.09.25-.19.37-.29a.07.07 0 01.07-.01c3.93 1.8 8.18 1.8 12.07 0a.07.07 0 01.07.01c.12.1.25.2.37.29a.07.07 0 01-.01.12c-.6.35-1.22.65-1.87.9a.07.07 0 00-.04.1c.36.7.77 1.37 1.22 2a.07.07 0 00.08.03 19.83 19.83 0 006-3.03.08.08 0 00.03-.05c.53-5.47-.89-10.22-3.74-14.43a.06.06 0 00-.03-.03zM8.02 13.72c-1.18 0-2.16-1.08-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.09 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.16-1.08-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.09 2.16 2.42 0 1.34-.95 2.42-2.16 2.42z",
  "Scene Detection": "M15 12a3 3 0 11-6 0 3 3 0 016 0zm6-3h-2.18A2 2 0 0017 7.82L15.89 6.5A1 1 0 0015.05 6h-6.1a1 1 0 00-.84.5L6.99 7.82A2 2 0 005.18 9H3a1 1 0 00-1 1v8a1 1 0 001 1h18a1 1 0 001-1v-8a1 1 0 00-1-1z",
  "Prompt Engineering": "M12 20h9M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4L16.5 3.5z",
  "Instagram API": "M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z",
  "SDXL": "M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a6 6 0 110 12 6 6 0 010-12z",
  "IPAdapter": "M4 6h16M4 12h16M4 18h16M8 6v12M16 6v12",
  "InsightFace": "M12 2a10 10 0 100 20 10 10 0 000-20zm-3 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm6 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-8 4s1.5 3 5 3 5-3 5-3",
  "CLIP Vision": "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  "Image Processing": "M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm0 14l4-4 2 2 4-4 5 5",
  "OpenAI": "M22.28 14.37a5.86 5.86 0 00-.5-4.86 5.92 5.92 0 00-6.38-2.83 5.86 5.86 0 00-4.4-1.96 5.92 5.92 0 00-5.66 4.13A5.86 5.86 0 001.7 12.7a5.92 5.92 0 00.73 6.96 5.86 5.86 0 00.5 4.86 5.92 5.92 0 006.38 2.83 5.86 5.86 0 004.4 1.96 5.92 5.92 0 005.66-4.13 5.86 5.86 0 003.64-3.81 5.92 5.92 0 00-.73-6.96",
  "DALL·E": "M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14l-2-2 5-5 5 5-2 2-3-3-3 3z",
  "DOCX Export": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M8 13h8M8 17h8M10 9h4",
  "JSON": "M4 16V4h4M20 8v12h-4M8 12H4m16 0h-4",
  "Pinterest SEO": "M12 2C6.48 2 2 6.48 2 12c0 4.12 2.5 7.65 6.07 9.17-.08-.76-.16-1.93.03-2.76.17-.75 1.1-4.67 1.1-4.67s-.28-.56-.28-1.39c0-1.3.76-2.28 1.7-2.28.8 0 1.19.6 1.19 1.32 0 .81-.51 2.01-.78 3.13-.22.93.47 1.7 1.39 1.7 1.67 0 2.95-1.76 2.95-4.3 0-2.25-1.62-3.82-3.93-3.82-2.68 0-4.25 2.01-4.25 4.09 0 .81.31 1.68.7 2.15.08.09.09.17.07.27l-.26 1.06c-.04.17-.14.21-.33.12-1.24-.58-2.01-2.38-2.01-3.83 0-3.12 2.27-5.99 6.55-5.99 3.44 0 6.12 2.45 6.12 5.73 0 3.42-2.16 6.17-5.15 6.17-1.01 0-1.95-.52-2.28-1.14l-.62 2.36c-.22.87-.83 1.96-1.24 2.63.93.29 1.92.44 2.95.44 5.52 0 10-4.48 10-10S17.52 2 12 2z",
  "Multimodal AI": "M12 2v4m0 12v4M6 12H2m20 0h-4m-1.5-6.5L14 8m-4 8l-2.5 2.5M18.5 5.5L16 8M8 16l-2.5 2.5M12 8a4 4 0 100 8 4 4 0 000-8z",
  "HTML5 Canvas": "M4 3l1.5 17L12 22l6.5-2L20 3H4zm3.5 5h9l-.3 3H9l.2 2h6.8l-.5 5.5L12 19.5l-3.5-1L8.2 15h2l.2 1.5 1.6.5 1.6-.5.2-2H8.5L8 8.5h8",
  "CSS Animations": "M12 2a10 10 0 100 20 10 10 0 000-20zm-2 14V8l6 4-6 4z",
  "PDF Export": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8m8 4H8m2-8H8",
  "Analytics": "M3 3v18h18M7 16l4-4 4 4 6-6",
  "Google BigQuery": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c2.3 0 4.41-.78 6.09-2.09l3.5 3.5 1.41-1.41-3.5-3.5C20.78 16.41 21.5 14.3 21.5 12c0-5.52-4.48-10-9.5-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
  "REST API": "M4 6h16v12H4V6zm2 2v8h12V8H6zm2 2h8v2H8v-2z",
  "Database": "M12 3c-4.97 0-9 1.79-9 4v10c0 2.21 4.03 4 9 4s9-1.79 9-4V7c0-2.21-4.03-4-9-4zm0 2c3.87 0 7 1.34 7 2s-3.13 2-7 2-7-1.34-7-2 3.13-2 7-2zm0 14c-3.87 0-7-1.34-7-2v-1.46c2.06 1.53 4.4 2.46 7 2.46s4.94-.93 7-2.46V19c0 .66-3.13 2-7 2zm0-5c-3.87 0-7-1.34-7-2v-1.46c2.06 1.53 4.4 2.46 7 2.46s4.94-.93 7-2.46V14c0 .66-3.13 2-7 2z",
  "Dashboard": "M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z",
  "TypeScript": "M4 4h16v16H4V4zm8 10h-2v4H8v-4H6V8h8v2H8v4h2v2h2v-2zm4-.5c0 1.93-3.5 1.5-3.5 1.5S11 16 11 14v-2h2v2s1 0 1-.5V13c0-.83-.67-1.5-1.5-1.5S11 10.83 11 10s.67-1.5 1.5-1.5S14 8.83 14 9.5v2h-2v-1.5s-1 0-1 .5V11c0 .83.67 1.5 1.5 1.5S16 13.17 16 14v-.5h-2z",
  "Gemini AI": "M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2zm6 2l-1.5 4.5L12 10l4.5 1.5L18 16l1.5-4.5L24 10l-4.5-1.5L18 4z",
  "Web Scraping": "M15 3h6v6h-2V6.41l-4.29 4.3-2.83-2.83L15 3zm2.5 14H6V8h6V6H4v14h14v-7h-2v5z",
  "Node.js": "M12 22.21l-9.67-5.54V5.54L12 0l9.67 5.54v11.13L12 22.21zm-7.67-6.7l7.67 4.4 7.67-4.4V6.7l-7.67-4.4-7.67 4.4v8.81z",
  "Notion API": "M4 4h16v16H4V4zm4 4v8h2V9l4 4v-4h-2v3l-4-4H8z",
  "OpenAI API": "M22.28 14.37a5.86 5.86 0 00-.5-4.86 5.92 5.92 0 00-6.38-2.83 5.86 5.86 0 00-4.4-1.96 5.92 5.92 0 00-5.66 4.13A5.86 5.86 0 001.7 12.7a5.92 5.92 0 00.73 6.96 5.86 5.86 0 00.5 4.86 5.92 5.92 0 006.38 2.83 5.86 5.86 0 004.4 1.96 5.92 5.92 0 005.66-4.13 5.86 5.86 0 003.64-3.81 5.92 5.92 0 00-.73-6.96",
};

/* ================================================================== */
/*  WHEEL CAROUSEL — large arc from right edge of screen               */
/* ================================================================== */
function WheelCarousel({
  images,
  activeIndex,
  onSelect,
  onImageClick,
}: {
  images: { src?: string; bg?: string; label: string; desc: string }[];
  activeIndex: number;
  onSelect: (i: number) => void;
  onImageClick?: () => void;
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
      
      // Ignore tiny trackpad jitters
      if (Math.abs(e.deltaY) < 25) return;

      locked = true;
      setTimeout(() => { locked = false; }, 600);
      
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
            onClick={() => {
              if (i === activeIndex && onImageClick) {
                onImageClick();
              } else {
                onSelect(i);
              }
            }}
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
  const [lightboxOpen, setLightboxOpen] = useState(false);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* keyboard navigation */
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (lightboxOpen) setLightboxOpen(false);
      else onClose();
    }
    if (!lightboxOpen) {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft")
        setActiveImage((p) => Math.max(0, p - 1));
      if (e.key === "ArrowDown" || e.key === "ArrowRight")
        setActiveImage((p) => Math.min(project.images.length - 1, p + 1));
    }
  }, [onClose, project.images.length, lightboxOpen]);

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
                  onClick={() => i === activeImage && setLightboxOpen(true)}
                  className="max-w-full max-h-full object-contain rounded-lg border border-white/[0.05] cursor-pointer"
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

            {/* Tools & Skills */}
            {project.tags && project.tags.length > 0 && (
              <div className="mb-4">
                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/25 block mb-3">Tools & Skills</span>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag: string, ti: number) => (
                    <div key={ti} className="group/icon relative w-8 h-8 flex items-center justify-center border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 transition-all duration-200 cursor-default">
                      <svg className="w-4 h-4 text-white/50 group-hover/icon:text-white/80 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={TOOL_ICONS[tag] || "M12 2a10 10 0 100 20 10 10 0 000-20z"} />
                      </svg>
                      {/* Instant tooltip */}
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white text-black text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 opacity-0 scale-90 group-hover/icon:opacity-100 group-hover/icon:scale-100 transition-all duration-150 z-50">
                        {tag}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}


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
            onImageClick={() => setLightboxOpen(true)}
          />
        </div>
      </motion.div>

      {/* Corner brackets (Desktop only to save space on mobile) */}
      <div className="hidden lg:block absolute top-3 left-3 w-5 h-5 border-t border-l border-white/[0.06] pointer-events-none" />
      <div className="hidden lg:block absolute bottom-3 left-3 w-5 h-5 border-b border-l border-white/[0.06] pointer-events-none" />
      <div className="hidden lg:block absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/[0.06] pointer-events-none" />

      {/* ============================================ */}
      {/* LIGHTBOX OVERLAY                             */}
      {/* ============================================ */}
      <AnimatePresence>
        {lightboxOpen && project.images[activeImage].src && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 z-50 w-12 h-12 border border-white/20 bg-black/50 backdrop-blur-md flex items-center justify-center hover:border-white/40 hover:bg-white/[0.1] transition-all rounded-full cursor-pointer"
            >
              <X className="w-5 h-5 text-white/80" />
            </button>
            <motion.img
              src={project.images[activeImage].src}
              alt={project.images[activeImage].label}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
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
      id={`project-${project.id}`}
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

          {/* Performance Stats */}
          {project.stats && project.stats.length > 0 && (
            <div className="flex gap-4 mt-4">
              {project.stats.map((stat: { label: string; value: string }, si: number) => (
                <motion.div
                  key={si}
                  className="flex flex-col"
                  initial={{ opacity: 0, y: 8 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.12 + si * 0.08, duration: 0.4 }}
                >
                  <span className="text-lg font-bold text-white/90 tracking-tight">{stat.value}</span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-white/30">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="h-px bg-white/30 mt-5"
            initial={{ width: 0 }}
            animate={inView ? { width: 40 } : {}}
            transition={{ delay: 0.5 + index * 0.12, duration: 0.6, ease }}
          />
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

  // Listen for custom 'select-project' events from chatbot
  useEffect(() => {
    const handler = (e: Event) => {
      const projectId = (e as CustomEvent).detail?.projectId;
      if (projectId) {
        const project = PROJECTS.find(p => p.id === projectId);
        if (project) setSelected(project);
      }
    };
    window.addEventListener('select-project', handler);
    return () => window.removeEventListener('select-project', handler);
  }, []);

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

        {/* --- LIGHTWEIGHT BACKGROUND ELEMENTS (Pure CSS for GPU compositing) --- */}
        {/* Subtle static glow — no animation, near-zero cost */}
        <div 
          className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.008] pointer-events-none z-0"
          style={{ filter: 'blur(80px)', willChange: 'transform', transform: 'translateZ(0)' }}
        />
        <div 
          className="absolute top-[40%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-white/[0.005] pointer-events-none z-0"
          style={{ filter: 'blur(80px)', willChange: 'transform', transform: 'translateZ(0)' }}
        />

        {/* Slow rotating wireframe rings — pure CSS animation */}
        <div 
          className="absolute top-[15%] right-[25%] w-[400px] h-[400px] border-[0.5px] border-white/[0.015] rounded-full pointer-events-none z-0 hidden md:block"
          style={{ animation: 'spin 60s linear infinite', willChange: 'transform' }}
        />
        <div 
          className="absolute top-[18%] right-[26%] w-[350px] h-[350px] border-[0.5px] border-white/[0.01] border-dashed rounded-full pointer-events-none z-0 hidden md:block"
          style={{ animation: 'spin 90s linear infinite reverse', willChange: 'transform' }}
        />

        {/* Noise — lightweight CSS pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '4px 4px',
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

          {/* Bento Grid layout with dense packing to flawlessly fill trailing holes */}
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[280px] md:auto-rows-[300px] gap-px bg-white/[0.03] grid-flow-row-dense">
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
              href="https://github.com/DhruvitNavadiya"
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
