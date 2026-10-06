/**
 * Placeholder wordmark: "one" in violet over a full-width, letter-spaced "TECH" in grey.
 * Everything scales from the `size` prop (font size in px of the word "one").
 * Swap this component for the final logo asset when it exists.
 */
export function Logo({ size = 30, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex flex-col items-stretch ${className}`.trim()}
      style={{ fontSize: size }}
      role="img"
      aria-label="One Tech"
    >
      <span aria-hidden className="block font-display font-semibold leading-[0.78] tracking-[-0.045em] text-accent">
        one
      </span>
      <span
        aria-hidden
        className="mt-[0.1em] flex justify-between font-medium uppercase leading-none text-mute"
        style={{ fontSize: "0.28em" }}
      >
        {"TECH".split("").map((c) => (
          <span key={c}>{c}</span>
        ))}
      </span>
    </span>
  );
}
