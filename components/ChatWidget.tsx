"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {ChatCircle, ChatCircleIcon, PaperPlaneTilt, X} from "@phosphor-icons/react";

type Msg = { role: "user" | "bot"; text: string };

const suggestions = [
  "What does One Tech do?",
  "What is MILO?",
  "How fast can we go live?",
];

/** Floating chat for general inquiries. Calls /api/chat, which holds the Groq key server-side. */
export function ChatWidget() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: reduce ? "auto" : "smooth" });
  }, [messages, loading, reduce]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || loading) return;
    setDraft("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setMessages((m) => [...m, { role: "bot", text: data.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const panelMotion = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 16, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.98 },
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.section
            {...panelMotion}
            aria-label="Chat with One Tech"
            onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
            className="flex h-[min(560px,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-line bg-paper shadow-[0_24px_60px_-24px_rgba(24,24,27,0.35)]"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <h2 className="text-base font-medium tracking-tight">Ask One Tech</h2>
                <p className="text-sm text-mute">General questions about One Tech</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid size-9 place-items-center rounded-full text-mute transition hover:bg-panel hover:text-ink focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X weight="regular" size={18} aria-hidden />
              </button>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4" aria-live="polite">
              {messages.length === 0 && (
                <div>
                  <p className="text-sm leading-relaxed text-mute">
                    Hi, I can answer general questions about One Tech. Try one of these.
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-mute">
                    Messages are processed by an AI provider. Please do not share personal information.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-ink/25 px-3 py-1.5 text-sm text-ink transition hover:bg-panel focus-visible:outline-2 focus-visible:outline-accent"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <p
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user" ? "bg-ink text-paper" : "bg-panel text-ink"
                    }`}
                  >
                    {m.text}
                  </p>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start" role="status" aria-label="One Tech is typing">
                  <div className="w-44 space-y-2 rounded-2xl bg-panel px-4 py-3">
                    <div className="h-2.5 w-full animate-pulse rounded-full bg-line" />
                    <div className="h-2.5 w-2/3 animate-pulse rounded-full bg-line" />
                  </div>
                </div>
              )}

              {error && (
                <p role="alert" className="text-sm text-accent">
                  {error}
                </p>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="border-t border-line px-5 py-4"
            >
              <label htmlFor="chat-input" className="mb-2 block text-sm font-medium">
                Your question
              </label>
              <div className="flex gap-2">
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  maxLength={500}
                  autoComplete="off"
                  placeholder="Type here"
                  className="min-w-0 flex-1 rounded-full border border-ink/30 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-mute focus-visible:outline-2 focus-visible:outline-accent"
                />
                <button
                  type="submit"
                  disabled={loading || !draft.trim()}
                  aria-label="Send question"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-paper transition hover:bg-accent active:scale-[0.96] disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <PaperPlaneTilt weight="regular" size={18} aria-hidden />
                </button>
              </div>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-sm font-medium text-paper transition duration-300 hover:-translate-y-px hover:bg-accent active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <ChatCircleIcon weight="regular" size={18} aria-hidden />
        {open ? "Close chat" : "Ask One Tech"}
      </button>
    </div>
  );
}
