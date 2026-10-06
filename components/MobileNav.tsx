"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";

type Link = { href: string; label: string };

/** Hamburger menu for screens narrower than md. The desktop nav is rendered separately in the page. */
export function MobileNav({ links }: { links: Link[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = (returnFocus = false) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // Move focus into the menu when it opens, close with Escape, and reset when the screen grows.
  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const mq = window.matchMedia("(min-width: 768px)");
    const onResize = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
    };
  }, [open]);

  const motionProps = reduce
    ? {}
    : {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid size-10 place-items-center rounded-full border border-ink/25 text-ink transition duration-300 hover:bg-panel active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {open ? <X weight="regular" size={20} aria-hidden /> : <List weight="regular" size={20} aria-hidden />}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Tap outside to close */}
            <div aria-hidden className="fixed inset-x-0 bottom-0 top-16 bg-ink/20" onClick={() => close()} />
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              {...motionProps}
              className="absolute inset-x-0 top-full border-b border-line bg-paper px-4 pb-6 pt-2 shadow-[0_24px_40px_-24px_rgba(24,24,27,0.35)]"
            >
              <ul>
                {links.map((l, i) => (
                  <li key={l.href} className="border-b border-line last:border-b-0">
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={l.href}
                      onClick={() => close()}
                      className="block py-4 font-display text-2xl font-medium tracking-tight text-ink transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
