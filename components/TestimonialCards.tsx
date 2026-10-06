"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, Pause, Play } from "@phosphor-icons/react";
import { testimonials } from "@/lib/testimonials";

const INTERVAL_MS = 6500;

// Where a card sits relative to the front: front, then two peeking behind, then hidden.
const slots = [
  { y: 0, scale: 1, opacity: 1 },
  { y: 18, scale: 0.955, opacity: 0.75 },
  { y: 36, scale: 0.91, opacity: 0.45 },
  { y: 36, scale: 0.89, opacity: 0 },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

const iconButton =
  "grid size-11 place-items-center rounded-full border border-ink/25 text-ink transition duration-300 hover:bg-panel active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/**
 * Card stack that cycles by itself and with arrows. Auto-advance pauses on hover and focus, when the
 * section is off screen, and on request (pause button). It never autoplays under reduced motion.
 */
export function TestimonialCards() {
  const reduce = useReducedMotion();
  const n = testimonials.length;
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false); // chosen with the button
  const [hovering, setHovering] = useState(false);

  const go = useCallback((dir: 1 | -1) => setIndex((i) => (i + dir + n) % n), [n]);

  const playing = !reduce && !paused && !hovering && inView;
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => go(1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [playing, go, index]);

  return (
    <div
      ref={rootRef}
      role="group"
      aria-roledescription="carousel"
      aria-label="Client testimonials"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={() => setHovering(false)}
    >
      <div className="isolate grid pb-10" aria-live={playing ? "off" : "polite"}>
        {testimonials.map((t, i) => {
          const rel = (i - index + n) % n;
          const slot = slots[Math.min(rel, slots.length - 1)];
          const front = rel === 0;
          return (
            <motion.figure
              key={t.name}
              // Cards behind the front one are decoration, so keep them out of tab order and screen readers.
              aria-hidden={!front}
              inert={!front}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${n}`}
              initial={false}
              animate={reduce ? { y: slot.y, scale: slot.scale, opacity: front ? 1 : 0 } : slot}
              transition={{ duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{ zIndex: n - rel, gridArea: "1 / 1", transformOrigin: "50% 100%" }}
              className={`flex flex-col justify-between gap-10 rounded-2xl border border-line p-8 md:p-10 ${
                front ? "bg-paper shadow-[0_30px_60px_-30px_rgba(60,30,180,0.45)]" : "bg-tint border-accent/25"
              }`}
            >
              <div>
                <span className="inline-flex rounded-full bg-tint px-3 py-1 text-xs font-medium text-accent">
                  {t.product}
                </span>
                <blockquote className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-balance md:text-3xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
              </div>
              <figcaption className="flex items-center gap-4">
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-accent text-sm font-medium text-paper"
                >
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block text-base font-medium">{t.name}</span>
                  <span className="block text-sm text-mute">
                    {t.role}, {t.company}
                  </span>
                </span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button type="button" className={iconButton} onClick={() => go(-1)} aria-label="Previous testimonial">
            <ArrowLeft weight="regular" size={18} aria-hidden />
          </button>
          <button type="button" className={iconButton} onClick={() => go(1)} aria-label="Next testimonial">
            <ArrowRight weight="regular" size={18} aria-hidden />
          </button>
          {!reduce && (
            <button
              type="button"
              className={iconButton}
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Resume automatic rotation" : "Pause automatic rotation"}
              aria-pressed={paused}
            >
              {paused ? <Play weight="regular" size={18} aria-hidden /> : <Pause weight="regular" size={18} aria-hidden />}
            </button>
          )}
        </div>
        <div className="flex items-center gap-2" role="group" aria-label="Choose a testimonial">
          {testimonials.map((t, i) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial ${i + 1} of ${n}`}
              aria-current={i === index}
              className="grid h-6 w-6 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-accent" : "w-2 bg-ink/25"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
