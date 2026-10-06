export const CONSENT_KEY = "onetech-consent";
export const CONSENT_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 365; // ask again after 12 months
export const OPEN_SETTINGS_EVENT = "onetech:cookie-settings";

export type ConsentCategory = "analytics" | "marketing";
export type Consent = { v: 1; analytics: boolean; marketing: boolean; ts: number };

/**
 * Third-party scripts that need consent. Nothing in this list loads until the visitor
 * accepts its category. The site ships with none, so no tracking runs today.
 * Example:
 *   { id: "plausible", category: "analytics", src: "https://plausible.io/js/script.js", attrs: { "data-domain": "otech.one", defer: "" } }
 */
export type Tracker = { id: string; category: ConsentCategory; src: string; attrs?: Record<string, string> };
export const TRACKERS: Tracker[] = [];

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (c.v !== 1 || typeof c.analytics !== "boolean" || typeof c.marketing !== "boolean") return null;
    if (Date.now() - c.ts > CONSENT_MAX_AGE_MS) return null;
    return c;
  } catch {
    return null;
  }
}

export function writeConsent(choice: { analytics: boolean; marketing: boolean }): Consent {
  const c: Consent = { v: 1, ...choice, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  return c;
}
