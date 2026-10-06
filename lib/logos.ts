import { readdir } from "node:fs/promises";
import path from "node:path";

export type Logo = { src: string; name: string };

/** Every image placed in public/logos, in alphabetical order. */
export async function getLogos(): Promise<Logo[]> {
  try {
    const files = await readdir(path.join(process.cwd(), "public", "logos"));
    return files
      .filter((f) => /\.(png|jpe?g|svg|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((f, i) => ({
        src: `/logos/${encodeURIComponent(f)}`,
        // Files named only with a number get a generic alt text.
        name: f.replace(/\.[^.]+$/, "").replace(/^\d+[-_.\s]*/, "").replace(/[-_]+/g, " ") || `Client logo ${i + 1}`,
      }));
  } catch {
    return [];
  }
}
