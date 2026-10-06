import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { CookieConsent } from "@/components/CookieConsent";
import "@/styles/globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face", display: "swap" });

export const metadata: Metadata = {
  title: "One Tech: custom software, AI and automation",
  description:
    "One Tech, based in Milan, builds custom software, AI agents and automation around your sector, ready in weeks.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${display.variable}`}>
      <body className="antialiased">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
