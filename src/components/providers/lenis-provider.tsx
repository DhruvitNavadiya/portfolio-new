"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";

export default function LenisProvider({ children }: { children: ReactNode }) {
  /* Visitors who ask the OS for reduced motion get native scrolling and no Framer transforms */
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: !reduceMotion }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
