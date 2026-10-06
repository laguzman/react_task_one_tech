import type { Icon } from "@phosphor-icons/react";
import {
  Cube,
  Database,
  Desktop,
  GearSix,
  MapPin,
  PlugsConnected,
  PuzzlePiece,
} from "@phosphor-icons/react/dist/ssr";

/*
  Brand visuals that replace stock photography. Each one is a violet gradient with a dot grid,
  carrying icons that explain the product. No photos, no fake screenshots.
*/

const gradients = {
  strong: "linear-gradient(145deg, #6F4CFE 0%, #8A6BFF 55%, #B5A2FF 100%)",
  soft: "linear-gradient(145deg, #EDE8FF 0%, #DCD3FF 100%)",
} as const;

const dots = {
  strong: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1.6px)",
  soft: "radial-gradient(rgba(111,76,254,0.28) 1px, transparent 1.6px)",
} as const;

type Tone = keyof typeof gradients;

function Surface({ tone, className = "", children }: { tone: Tone; className?: string; children?: React.ReactNode }) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundImage: `${dots[tone]}, ${gradients[tone]}`, backgroundSize: "22px 22px, auto" }}
    >
      {children}
    </div>
  );
}

function Chip({ icon: I, size = "md", className = "" }: { icon: Icon; size?: "md" | "lg"; className?: string }) {
  const box = size === "lg" ? "size-20 rounded-3xl" : "size-14 rounded-2xl";
  return (
    <span
      className={`grid shrink-0 place-items-center bg-paper text-accent shadow-[0_14px_30px_-14px_rgba(60,30,180,0.55)] ${box} ${className}`}
    >
      <I weight="regular" size={size === "lg" ? 36 : 26} aria-hidden />
    </span>
  );
}

const ring = "absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border";

const trios = {
  engine: [Cube, PuzzlePiece, GearSix],
  connect: [Database, PlugsConnected, Desktop],
} as const;

/** Bento halves: three icon chips that stand for what the agent touches. */
export function ChipsPanel({ kind, tone, className = "" }: { kind: keyof typeof trios; tone: Tone; className?: string }) {
  return (
    <Surface tone={tone} className={`grid min-h-60 place-items-center ${className}`}>
      <div className="flex items-center gap-4">
        {trios[kind].map((icon, i) => (
          <Chip key={i} icon={icon} className={i === 1 ? "-translate-y-5" : "translate-y-3"} />
        ))}
      </div>
    </Surface>
  );
}

/** Side panel for the contact section. */
export function MapPanel({ className = "" }: { className?: string }) {
  return (
    <Surface tone="strong" className={`rounded-2xl ${className}`}>
      <div className={`${ring} h-[46%] border-white/30`} />
      <div className={`${ring} h-[78%] border-white/20`} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Chip icon={MapPin} size="lg" />
      </div>
    </Surface>
  );
}
