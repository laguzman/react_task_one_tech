"use client";

import { useSyncExternalStore } from "react";
import { Bank, ShoppingBag } from "@phosphor-icons/react";
import DepthCarouselSource from "@/components/DepthCarousel";

// The carousel is plain JavaScript, so its props are loosely typed here.
const DepthCarousel = DepthCarouselSource as unknown as React.ComponentType<Record<string, unknown>>;

const verticals = [
  {
    icon: Bank,
    title: "Fintech and consumer credit",
    audience: "For brokers and agencies selling personal loans and cessione del quinto.",
    benefit: "One flow from the first request to a complete application.",
    products: ["KORE", "ARGO", "MILO"],
    background: "linear-gradient(160deg, #F3F0FF 0%, #DED6FF 100%)",
  },
  {
    icon: ShoppingBag,
    title: "Fashion and e-commerce",
    audience: "For Shopify brands that grow with paid ads.",
    benefit: "One inbox for every shopper, on whatever channel they write.",
    products: ["ALL MESSAGE", "MILO", "Tailor Lab"],
    background: "linear-gradient(160deg, #EEE9FF 0%, #D3C8FF 100%)",
  },
];

const query = "(max-width: 639px)";
function useNarrow() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Hero card stack: one card per vertical we serve. Soft violet so it stays easy on the eye. */
export function HeroIndustries({ className = "" }: { className?: string }) {
  const narrow = useNarrow();

  const items = verticals.map((v) => ({
    alt: v.title,
    content: (
      <div
        className="flex h-full flex-col p-6 text-ink sm:p-8"
        style={{
          backgroundImage: `radial-gradient(rgba(111,76,254,0.2) 1px, transparent 1.6px), ${v.background}`,
          backgroundSize: "22px 22px, auto",
        }}
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-accent text-paper sm:size-14">
          <v.icon weight="regular" size={narrow ? 24 : 28} aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-2xl font-medium leading-tight tracking-tight sm:text-3xl">{v.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-mute sm:text-base">{v.audience}</p>
        <p className="mt-3 text-sm font-medium leading-relaxed sm:text-base">{v.benefit}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {v.products.map((p) => (
            <span key={p} className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-accent sm:text-sm">
              {p}
            </span>
          ))}
        </div>
      </div>
    ),
  }));

  return (
    <div className={className}>
      <DepthCarousel
        items={items}
        label="Industries we serve"
        cardWidth={narrow ? 290 : 400}
        cardHeight={narrow ? 400 : 500}
        radius={16}
        tint="#9C89E8"
        depth={narrow ? 90 : 150}
        spread={narrow ? 26 : 56}
        tilt={narrow ? 10 : 16}
        tiltDirection="right"
        perspective={1400}
        visibleCards={2}
        falloff={0.2}
        blur={3}
        autoplay
        autoplayDelay={5500}
        loop
      />
    </div>
  );
}
