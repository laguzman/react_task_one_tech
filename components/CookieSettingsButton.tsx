"use client";

import { OPEN_SETTINGS_EVENT } from "@/lib/consent";

/** Footer control that reopens the banner, so consent can be changed or withdrawn at any time. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      Cookie settings
    </button>
  );
}
