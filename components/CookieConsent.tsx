"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { OPEN_SETTINGS_EVENT, TRACKERS, readConsent, writeConsent, type Consent } from "@/lib/consent";

type Choice = { analytics: boolean; marketing: boolean };

// Reject and Accept share one style on purpose, so refusing is as easy as accepting.
const choiceButton =
  "inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition duration-300 hover:bg-accent active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const quietButton =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition duration-300 hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const categories: { key: keyof Choice; title: string; body: string }[] = [
  { key: "analytics", title: "Analytics", body: "Helps us understand how the site is used so we can improve it." },
  { key: "marketing", title: "Marketing", body: "Lets us measure campaigns and show relevant content elsewhere." },
];

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [custom, setCustom] = useState(false);
  const [draft, setDraft] = useState<Choice>({ analytics: false, marketing: false });
  const [consent, setConsent] = useState<Consent | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const injected = useRef(new Set<string>());

  // First visit: show the banner. Returning visit within 12 months: stay quiet.
  useEffect(() => {
    const c = readConsent();
    setConsent(c);
    setVisible(!c);
    const reopen = () => {
      const current = readConsent();
      setDraft({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });
      setCustom(true);
      setVisible(true);
      setTimeout(() => panelRef.current?.focus(), 0);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  // Load a third-party script only after its category is accepted.
  useEffect(() => {
    if (!consent) return;
    for (const t of TRACKERS) {
      if (!consent[t.category] || injected.current.has(t.id)) continue;
      const s = document.createElement("script");
      s.src = t.src;
      s.async = true;
      s.dataset.consentId = t.id;
      Object.entries(t.attrs ?? {}).forEach(([k, v]) => s.setAttribute(k, v));
      document.head.appendChild(s);
      injected.current.add(t.id);
    }
  }, [consent]);

  const save = useCallback(
    (choice: Choice) => {
      const previous = readConsent();
      const next = writeConsent(choice);
      setConsent(next);
      setVisible(false);
      setCustom(false);
      // A script that already ran cannot be unloaded, so reload after a withdrawal.
      const withdrew = TRACKERS.some((t) => previous?.[t.category] && !next[t.category]);
      if (withdrew) window.location.reload();
    },
    [],
  );

  if (!visible) return null;

  return (
    <section
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-4 bottom-4 z-[60] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-24px_rgba(24,24,27,0.4)] outline-none md:right-auto md:w-[26rem] md:p-6"
    >
      <h2 id="cookie-title" className="text-lg font-medium tracking-tight">
        Your privacy choices
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-mute">
        This site only uses what it needs to work. With your permission we would also use optional analytics and
        marketing tools. You can change your mind at any time.{" "}
        <Link href="/privacy" className="font-medium text-accent underline underline-offset-2">
          Privacy and cookie policy
        </Link>
      </p>

      {custom && (
        <fieldset className="mt-4 space-y-4 border-t border-line pt-4">
          <legend className="sr-only">Choose which cookies to allow</legend>
          <label className="flex items-start gap-3 text-sm leading-relaxed">
            <input type="checkbox" checked disabled className="mt-0.5 size-5 shrink-0 accent-accent" />
            <span>
              <span className="font-medium">Essential</span>
              <span className="block text-mute">Needed to run the site and remember this choice. Always on.</span>
            </span>
          </label>
          {categories.map((c) => (
            <label key={c.key} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                checked={draft[c.key]}
                onChange={(e) => setDraft((d) => ({ ...d, [c.key]: e.target.checked }))}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              />
              <span>
                <span className="font-medium">{c.title}</span>
                <span className="block text-mute">{c.body}</span>
              </span>
            </label>
          ))}
        </fieldset>
      )}

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" className={choiceButton} onClick={() => save({ analytics: false, marketing: false })}>
          Reject all
        </button>
        <button type="button" className={choiceButton} onClick={() => save({ analytics: true, marketing: true })}>
          Accept all
        </button>
      </div>
      <div className="mt-2">
        {custom ? (
          <button type="button" className={`${quietButton} w-full`} onClick={() => save(draft)}>
            Save my choices
          </button>
        ) : (
          <button
            type="button"
            className={`${quietButton} w-full`}
            onClick={() => {
              setDraft({ analytics: false, marketing: false });
              setCustom(true);
            }}
          >
            Choose cookies
          </button>
        )}
      </div>
    </section>
  );
}
