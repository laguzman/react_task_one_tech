"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * Ambient violet glow that trails the cursor. It marks where the visitor is looking and gives
 * the page a sense of response. Position lives in motion values, so React never re-renders on move.
 * Under reduced motion it stays as a static glow.
 */
export function CursorGlow() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Core glow follows closely, halo lags behind for depth.
  const coreX = useSpring(x, { stiffness: 140, damping: 24, mass: 0.5 });
  const coreY = useSpring(y, { stiffness: 140, damping: 24, mass: 0.5 });
  const haloX = useSpring(x, { stiffness: 40, damping: 22, mass: 1 });
  const haloY = useSpring(y, { stiffness: 40, damping: 22, mass: 1 });

  useEffect(() => {
    const home = () => {
      x.jump(window.innerWidth * 0.72);
      y.jump(window.innerHeight * 0.32);
      coreX.jump(x.get());
      coreY.jump(y.get());
      haloX.jump(x.get());
      haloY.jump(y.get());
    };
    home();
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduce, x, y, coreX, coreY, haloX, haloY]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{
          x: haloX,
          y: haloY,
          background:
            "radial-gradient(circle, rgba(150,120,255,0.14) 0%, rgba(150,120,255,0.06) 38%, transparent 68%)",
        }}
        className="absolute left-0 top-0 -ml-[500px] -mt-[500px] size-[1000px] rounded-full will-change-transform"
      />
      <motion.div
        style={{
          x: coreX,
          y: coreY,
          background:
            "radial-gradient(circle, rgba(111,76,254,0.15) 0%, rgba(150,120,255,0.09) 35%, transparent 68%)",
        }}
        className="absolute left-0 top-0 -ml-[260px] -mt-[260px] size-[520px] rounded-full will-change-transform"
      />
    </div>
  );
}
