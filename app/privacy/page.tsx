import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";

export const metadata: Metadata = {
  title: "Privacy and cookie policy | One Tech",
  description: "How One Tech handles personal data and cookies on this website.",
};

const h2 = "mt-12 text-2xl font-medium tracking-tight";
const p = "mt-4 text-base leading-relaxed text-mute";
const li = "mt-2 text-base leading-relaxed text-mute";

const storage = [
  {
    name: "onetech-consent",
    purpose: "Remembers your cookie choice so we do not ask again on every visit.",
    duration: "12 months",
    category: "Essential",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4 md:px-8">
          <Link href="/" aria-label="One Tech, back to home">
            <Logo size={30} />
          </Link>
          <Link href="/" className="text-sm text-mute transition-colors hover:text-ink">
            Back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-16 md:px-8 md:py-24">
        <h1 className="text-4xl font-medium leading-[1.08] tracking-tighter text-balance md:text-5xl">
          Privacy and cookie policy
        </h1>
        <p className={p}>Last updated 6 October 2026.</p>

        {/* TEMPLATE: have the final text reviewed by your legal adviser and complete the company details. */}
        <h2 className={h2}>Who we are</h2>
        <p className={p}>
          One Tech, based in Milan, Italy, is the controller of the personal data collected on this website. To contact
          us about your data, write to{" "}
          <a href="mailto:sales@otech.one" className="font-medium text-accent underline underline-offset-2">
            sales@otech.one
          </a>
          .
        </p>

        <h2 className={h2}>What we collect and why</h2>
        <ul className="mt-2 list-disc pl-5">
          <li className={li}>
            <strong className="font-medium text-ink">Demo request form.</strong> Your name, work email, company, team
            size and optional message, used to reply to you and arrange a demo. Legal basis: steps taken at your
            request before a contract, and your consent to this policy.
          </li>
          <li className={li}>
            <strong className="font-medium text-ink">Newsletter.</strong> Your email address, only if you tick the
            newsletter box. Legal basis: your consent. You can unsubscribe at any time.
          </li>
          <li className={li}>
            <strong className="font-medium text-ink">Chat assistant.</strong> The question you type is sent to an AI
            provider to generate an answer. Please do not include personal or confidential information in it.
            Legal basis: your request for the answer.
          </li>
        </ul>

        <h2 className={h2}>Who receives your data</h2>
        <p className={p}>We use these service providers to run the site. They process data only on our instructions.</p>
        <ul className="mt-2 list-disc pl-5">
          <li className={li}>Resend, to deliver demo request emails and manage newsletter subscriptions.</li>
          <li className={li}>Groq, to generate chat assistant answers.</li>
          <li className={li}>Our hosting provider, to serve this website.</li>
        </ul>
        <p className={p}>
          Some of these providers are located outside the European Economic Area, for example in the United States.
          Where that applies, transfers rely on safeguards such as the EU Standard Contractual Clauses.
        </p>

        <h2 className={h2}>How long we keep it</h2>
        <p className={p}>
          We keep demo requests for as long as needed to answer you and follow up on your request, and we delete
          them when you ask or when they are no longer needed. Newsletter data is kept until you unsubscribe.
        </p>

        <h2 className={h2}>Your rights</h2>
        <p className={p}>
          You can ask us for access to your data, correction, deletion, restriction of processing, a portable copy,
          or object to processing. Where we rely on consent you can withdraw it at any time, and doing so does not
          affect what we did before. You also have the right to complain to your local data protection authority.
        </p>

        <h2 className={h2}>Cookies and similar storage</h2>
        <p className={p}>
          This website currently uses only the essential item below. We do not run analytics or marketing tools
          unless you accept them, and nothing optional loads before you choose. You can refuse as easily as you
          accept, and you can change your choice at any time.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <thead className="bg-panel">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Purpose</th>
                <th scope="col" className="px-4 py-3 font-medium">Duration</th>
                <th scope="col" className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {storage.map((s) => (
                <tr key={s.name}>
                  <td className="px-4 py-3 font-medium">{s.name}</td>
                  <td className="px-4 py-3 text-mute">{s.purpose}</td>
                  <td className="px-4 py-3 text-mute">{s.duration}</td>
                  <td className="px-4 py-3 text-mute">{s.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <CookieSettingsButton className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-ink/25 px-5 py-2.5 text-sm font-medium text-ink transition duration-300 hover:bg-panel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent" />
        </div>
      </main>
    </>
  );
}
