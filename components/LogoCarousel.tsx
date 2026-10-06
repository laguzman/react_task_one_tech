import type { Logo } from "@/lib/logos";

const MIN_ITEMS = 18; // enough to overfill wide screens so the loop never shows a gap

/**
 * Infinite logo carousel in pure CSS. Two identical groups sit side by side and both slide left by
 * their own width, so the second one takes the place of the first. See .logo-carousel in globals.css.
 * With no files in public/logos it shows six neutral placeholders.
 */
export function LogoCarousel({ logos }: { logos: Logo[] }) {
  const base: (Logo | null)[] = logos.length ? logos : Array.from({ length: 6 }, () => null);
  const repeats = Math.ceil(MIN_ITEMS / base.length);

  const group = (hidden: boolean) => (
    <div className="logo-group" {...(hidden ? { "aria-hidden": true } : {})}>
      {Array.from({ length: repeats }).flatMap((_, r) =>
        base.map((logo, i) => {
          const copy = hidden || r > 0;
          return logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={`${r}-${i}`}
              src={logo.src}
              alt={copy ? "" : logo.name}
              loading="lazy"
              className="h-14 w-auto max-w-none shrink-0 object-contain opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-20"
            />
          ) : (
            <span
              key={`${r}-${i}`}
              aria-hidden
              className="grid h-14 w-48 shrink-0 place-items-center rounded-full bg-panel text-sm text-mute"
            >
              Your logo
            </span>
          );
        }),
      )}
    </div>
  );

  return (
    <div className="logo-carousel">
      {group(false)}
      {group(true)}
    </div>
  );
}
