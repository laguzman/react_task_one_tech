"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion } from "motion/react";
import { CheckCircle, Hammer, PlugsConnected, Ruler, Scissors, SealCheck } from "@phosphor-icons/react";

const steps = [
  { icon: Ruler, title: "Measure", body: "Understand the problem in your business" },
  { icon: Scissors, title: "Cut", body: "Shape the right engine for your sector" },
  { icon: Hammer, title: "Build", body: "Create the software or AI agent" },
  { icon: PlugsConnected, title: "Connect", body: "Plug it into your CRM, systems and chat" },
  { icon: SealCheck, title: "Fit", body: "Test with your team and adjust" },
];

const STEP_SECONDS = 1.4;
const HOLD_SECONDS = 3.2; // how long "Tailor made" stays before the loop restarts

/**
 * Loops while it is on screen: five steps run in order while one overall progress ring fills to 100%
 * and turns into "Tailor made", holds briefly, then starts again. It pauses when scrolled away.
 * Per-frame values go straight to the DOM, so React only re-renders when a step changes.
 */
export function TailorProgress() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const run = useRef(0);
  const inView = useInView(rootRef, { amount: 0.3 });
  const controls = useRef<{ stop: () => void } | null>(null);

  const [active, setActive] = useState(-1); // step currently running
  const [done, setDone] = useState(0); // steps finished
  const progress = useMotionValue(0);

  useMotionValueEvent(progress, "change", (v) => {
    ringRef.current?.style.setProperty("--p", `${v}`);
    if (numRef.current) numRef.current.textContent = `${Math.round(v)}`;
  });

  const complete = done === steps.length;

  async function loop() {
    const id = ++run.current;
    const alive = () => run.current === id;
    while (alive()) {
      progress.jump(0);
      setDone(0);
      setActive(0);
      for (let i = 0; i < steps.length; i++) {
        if (!alive()) return;
        setActive(i);
        const anim = animate(progress, ((i + 1) * 100) / steps.length, {
          duration: STEP_SECONDS,
          ease: [0.4, 0, 0.2, 1],
        });
        controls.current = anim;
        await anim;
        if (!alive()) return;
        setDone(i + 1);
      }
      setActive(-1);
      await new Promise((r) => setTimeout(r, HOLD_SECONDS * 1000));
    }
  }

  useEffect(() => {
    if (reduce) {
      progress.jump(100);
      setDone(steps.length);
      return;
    }
    if (!inView) return;
    loop();
    return () => {
      run.current++;
      controls.current?.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce]);

  return (
    <div
      ref={rootRef}
      className="relative overflow-hidden rounded-2xl p-6 md:p-10"
      style={{
        backgroundImage:
          "radial-gradient(rgba(111,76,254,0.28) 1px, transparent 1.6px), linear-gradient(145deg, #EDE8FF 0%, #DCD3FF 100%)",
        backgroundSize: "22px 22px, auto",
      }}
    >
      <div className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
        <ol className="space-y-2 md:col-span-7" aria-label="Tailor Lab steps">
          {steps.map((s, i) => {
            const isDone = i < done;
            const isActive = i === active && !isDone;
            return (
              <li
                key={s.title}
                aria-current={isActive ? "step" : undefined}
                className={`relative flex items-center gap-4 overflow-hidden rounded-2xl px-4 py-3.5 transition-colors duration-500 ${
                  isActive ? "bg-paper shadow-[0_14px_30px_-16px_rgba(60,30,180,0.5)]" : isDone ? "bg-paper/60" : ""
                }`}
              >
                <span
                  className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-colors duration-500 ${
                    isDone ? "bg-accent text-paper" : isActive ? "bg-tint text-accent" : "bg-paper/60 text-mute"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle weight="regular" size={24} aria-hidden />
                  ) : (
                    <s.icon weight="regular" size={24} aria-hidden />
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-base font-medium tracking-tight text-ink">{s.title}</span>
                  <span className="block text-sm leading-snug text-mute">{s.body}</span>
                </span>
                {isActive && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: STEP_SECONDS, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        <div className="flex flex-col items-center gap-5 md:col-span-5">
          <div className="relative size-52 sm:size-60">
            <motion.div
              ref={ringRef}
              className="absolute inset-0 rounded-full"
              style={{
                ["--p" as string]: 0,
                background: "conic-gradient(#6F4CFE calc(var(--p) * 1%), rgba(111,76,254,0.18) 0)",
                WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 16px), #000 calc(100% - 15px))",
                mask: "radial-gradient(farthest-side, transparent calc(100% - 16px), #000 calc(100% - 15px))",
              }}
              animate={complete && !reduce ? { scale: [1, 1.04, 1] } : undefined}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center" role="status">
              {complete ? (
                <>
                  <SealCheck weight="regular" size={44} aria-hidden className="text-accent" />
                  <span className="mt-2 text-2xl font-medium tracking-tighter text-ink">Tailor made</span>
                  <span className="sr-only">100 percent complete</span>
                </>
              ) : (
                <>
                  <span className="text-6xl font-medium tracking-tighter tabular-nums text-ink">
                    <span ref={numRef}>0</span>
                    <span className="text-3xl text-mute">%</span>
                  </span>
                  <span className="mt-1 text-sm text-mute">{active >= 0 ? steps[active].title : "Ready"}</span>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
