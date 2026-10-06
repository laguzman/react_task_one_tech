"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, CursorClick } from "@phosphor-icons/react";
import DecryptedTextSource from "@/components/DecryptedText";
import FolderFloatSource from "@/components/FolderFloat";

// The component is plain JavaScript, so its props are loosely typed here.
const DecryptedText = DecryptedTextSource as unknown as React.ComponentType<Record<string, unknown>>;
const FolderFloat = FolderFloatSource as unknown as React.ComponentType<Record<string, unknown>>;

/* Product facts adapted from otech.one. Wording is original. */
const products = [
  {
    value: "kore",
    label: "KORE",
    summary:
      "A plug and play set of digital engines for credit agents and brokers in Italian consumer credit, covering the whole loan application journey.",
  },
  {
    value: "argo",
    label: "ARGO",
    summary:
      "Document intelligence. It reads any document and prepares the data your business needs, connected to your management system or CRM, or used as a web app.",
  },
  {
    value: "all-message",
    label: "ALL MESSAGE",
    summary:
      "WhatsApp, Instagram, Facebook and email in a single conversation per customer, so replies are faster and no message gets lost between apps.",
  },
  {
    value: "milo",
    label: "MILO",
    summary:
      "The One Tech AI agent. It talks to your customers, collects the details you need and guides them through each stage, turning conversations into opportunities.",
  },
];

export function Products() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<(typeof products)[number] | null>(null); // nothing chosen yet
  const [open, setOpen] = useState(false);
  // Hover opens the folder with a mouse. Touch screens have no hover, so they tap instead.
  const [trigger, setTrigger] = useState<"hover" | "click">("hover");
  useEffect(() => {
    setTrigger(window.matchMedia("(hover: hover) and (pointer: fine)").matches ? "hover" : "click");
  }, []);

  return (
    <div className="grid items-end gap-8 lg:grid-cols-12 lg:gap-16">
      <div className="relative flex min-h-[18.5rem] items-end justify-center lg:col-span-7 lg:min-h-[22rem]">
        {/* Invitation shown while the folder is closed */}
        <AnimatePresence>
          {!open && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-[12.5rem] left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={reduce ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1"
              >
                <span className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full border border-accent/30 bg-paper py-2 pl-2 pr-5 text-sm font-medium text-accent shadow-[0_18px_36px_-16px_rgba(60,30,180,0.55)]">
                  <span className="grid size-8 place-items-center rounded-full bg-accent text-paper">
                    <CursorClick weight="regular" size={18} aria-hidden />
                  </span>
                  <span className="pointer-fine:hidden">Tap to open</span>
                  <span className="hidden pointer-fine:inline">Hover to open</span>
                </span>
                <ArrowDown weight="regular" size={20} aria-hidden className="text-accent" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <FolderFloat
          key={trigger}
          items={products.map(({ label, value }) => ({ label, value }))}
          label="Our products"
          sublabel="4 products"
          trigger={trigger}
          closeOnSelect={false}
          physics
          drift={0.5}
          onOpenChange={(o: boolean) => setOpen(o)}
          onSelect={(value: string) => setActive(products.find((p) => p.value === value) ?? null)}
          folderColor="#4F33C9"
          frontColor="#6F4CFE"
          paperColor="#F5F2FF"
          itemColor="#FAFAFA"
          itemTextColor="#18181B"
          labelColor="#FFFFFF"
          width={220}
          height={156}
          radius={16}
          spread={150}
          lift={30}
        />
      </div>

      <div className="min-h-[15rem] lg:col-span-5">
        {!active ? (
          <div className="rounded-2xl border border-dashed border-accent/40 bg-tint p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-paper">
              <CursorClick weight="regular" size={26} aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl font-medium tracking-tight md:text-3xl">Choose a product</h3>
            <p className="mt-3 max-w-[36ch] text-base leading-relaxed text-mute">
              <span className="pointer-fine:hidden">Tap</span>
              <span className="hidden pointer-fine:inline">Hover over</span> the folder, then pick KORE, ARGO, ALL
              MESSAGE or MILO to see what it does.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-mute">Selected</p>
            {/* Screen readers get the real text. The scrambling effect stays visual only. */}
            <p role="status" className="sr-only">
              {active.label}. {active.summary}
            </p>
            <div aria-hidden>
              <h3 className="mt-2 text-3xl font-medium tracking-tighter md:text-4xl">
                {reduce ? (
                  active.label
                ) : (
                  <DecryptedText
                    key={`${active.value}-title`}
                    text={active.label}
                    animateOn="view"
                    sequential
                    revealDirection="start"
                    speed={80}
                    characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                    className="text-ink"
                    encryptedClassName="text-accent"
                  />
                )}
              </h3>
              <p className="mt-4 min-h-[9.5rem] max-w-[40ch] text-base leading-relaxed text-mute md:text-lg">
                {reduce ? (
                  active.summary
                ) : (
                  <DecryptedText
                    key={`${active.value}-body`}
                    text={active.summary}
                    animateOn="view"
                    sequential
                    revealDirection="start"
                    speed={18}
                    characters="abcdefghijklmnopqrstuvwxyz"
                    className="text-mute"
                    encryptedClassName="text-accent/70"
                  />
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
