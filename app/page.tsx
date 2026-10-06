import {
  Compass,
  EnvelopeSimple,
  PlugsConnected,
  Plus,
  Scissors,
  Timer,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/Button";
import { ChatWidget } from "@/components/ChatWidget";
import { CookieSettingsButton } from "@/components/CookieSettingsButton";
import { CursorGlow } from "@/components/CursorGlow";
import { DemoForm } from "@/components/DemoForm";
import { Logo } from "@/components/Logo";
import { MobileNav } from "@/components/MobileNav";
import { LogoCarousel } from "@/components/LogoCarousel";
import { Products } from "@/components/Products";
import { Reveal } from "@/components/Reveal";
import TechText from "@/components/TechText";
import { TailorProgress } from "@/components/TailorProgress";
import { TestimonialCards } from "@/components/TestimonialCards";
import { ChipsPanel, MapPanel } from "@/components/Visuals";
import { HeroIndustries } from "@/components/HeroIndustries";
import { getLogos } from "@/lib/logos";

const DEMO_URL = "#demo";
const wrap = "mx-auto w-full max-w-7xl px-4 md:px-8";
const h2 = "text-3xl font-medium leading-[1.08] tracking-tighter text-balance md:text-5xl";
const lead = "mt-5 max-w-[52ch] text-base leading-relaxed text-mute md:text-lg";
const eyebrow = "mb-4 text-xs font-medium uppercase tracking-[0.16em] text-accent";

/* Company facts adapted from otech.one (Milan, Italy). Wording is original. */
const reasons = [
  {
    icon: Compass,
    title: "Built for your sector",
    body: "We start from engines already made for your industry, so you are not bending generic software to fit.",
  },
  {
    icon: Timer,
    title: "Live in weeks",
    body: "Ready-made engines turn months of development into weeks, then we shape them around your process.",
  },
  {
    icon: Scissors,
    title: "Tailor made",
    body: "Cut to your measurements with the care of Italian craft, not pulled off the rack.",
  },
  {
    icon: PlugsConnected,
    title: "Connected from day one",
    body: "Plugs into your management system, in-house CRM and chat channels, or runs as a web app.",
  },
];

const faqs = [
  {
    q: "How long does a project take?",
    a: "Our engines are already built for your sector, so most projects go live in weeks instead of months. Scope decides the exact timing.",
  },
  {
    q: "Do you build fully custom software?",
    a: "Yes. In Tailor Lab we start from your business problem and build the software or AI agent that fits it.",
  },
  {
    q: "Can it work with the systems we already use?",
    a: "Yes. Our products connect to your management system, your in-house CRM and your messaging channels, or run as a web app.",
  },
  {
    q: "Who is KORE for?",
    a: "KORE is made for credit agents and brokers in Italian consumer credit, and it covers the whole loan application journey.",
  },
  {
    q: "Where are you based?",
    a: "We are based in Milan, Italy, and we work in Italian and English.",
  },
];

const navLinks = [
  { href: "#products", label: "Products" },
  { href: "#tailor", label: "Tailor Lab" },
  { href: "#clients", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
  { href: "#faq", label: "FAQ" },
];

export default async function Page() {
  const logos = await getLogos();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>

      {/* Navigation: single line, 64px */}
      <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
        <div className={`${wrap} flex h-16 items-center justify-between`}>
          <a href="#main" aria-label="One Tech, back to top">
            <Logo size={30} />
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-mute transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button href={DEMO_URL} size="sm">
              Book a demo
            </Button>
            <MobileNav links={navLinks} />
          </div>
        </div>
      </header>

      <main id="main">
        {/* 1. HERO: asymmetric split */}
        <section
          className={`${wrap} grid items-center gap-10 pb-16 pt-12 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:gap-16 lg:pb-12 lg:pt-16`}
        >
          <div className="lg:col-span-6">
            <Reveal immediate>
              <h1>
                <span className="sr-only">One Tech. Custom software, AI and automation.</span>
                <div aria-hidden className="relative -ml-2 h-36 w-full sm:h-44 lg:h-56">
                  <TechText
                    text="One Tech"
                    fontWeight={600}
                    fontSize={190}
                    letterSpacing={-0.045}
                    color="#6F4CFE"
                    accentColor="#6F4CFE"
                    reveal="letter"
                    dashLength={4}
                    dashGap={2}
                    specks={15}
                  />
                </div>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.1}>
              <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-mute">
                Custom software, AI and automation built around your sector, ready in weeks rather than months.
              </p>
            </Reveal>
            <Reveal immediate delay={0.2} className="mt-8 flex flex-wrap gap-3">
              <Button href={DEMO_URL}>Book a demo</Button>
              <Button href="#products" variant="secondary">
                See our products
              </Button>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <HeroIndustries className="h-[500px] sm:h-[580px] lg:h-[min(76dvh,640px)]" />
          </div>
        </section>

        {/* 2. CLIENTS: infinite logo carousel, images come from public/logos */}
        <section aria-label="Clients" className="border-y border-line">
          <div className={`${wrap} py-12`}>
            <Reveal>
              <p className="mb-8 text-sm text-mute">Trusted by teams at</p>
              <LogoCarousel logos={logos} />
            </Reveal>
          </div>
        </section>

        {/* 3. PRODUCTS: interactive folder */}
        <section id="products" className={`${wrap} py-24 lg:py-32`}>
          <Reveal>
            <h2 className={h2}>One engine, four products.</h2>
            <p className={lead}>Each one solves a different job, and they all run on the same engine.</p>
          </Reveal>
          <Reveal className="mt-8 md:mt-14">
            <Products />
          </Reveal>
        </section>

        {/* 4. WHY ONE TECH: bento, exactly 4 cells */}
        <section id="why" className={`${wrap} pb-24 lg:pb-32`}>
          <Reveal>
            <p className={eyebrow}>Why One Tech</p>
            <h2 className={h2}>Software cut to fit your business.</h2>
            <p className={lead}>
              Most software asks you to adapt. We adapt the software, starting from engines that already know your
              sector.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-4 md:grid-cols-6">
            <Reveal className="md:col-span-4">
              <article className="grid h-full overflow-hidden rounded-2xl bg-panel sm:grid-cols-2">
                <ReasonText r={reasons[0]} />
                <ChipsPanel kind="engine" tone="strong" />
              </article>
            </Reveal>
            <Reveal className="md:col-span-2">
              <article className="h-full rounded-2xl bg-tint">
                <ReasonText r={reasons[1]} />
              </article>
            </Reveal>
            <Reveal className="md:col-span-2">
              <article className="h-full rounded-2xl border border-line">
                <ReasonText r={reasons[2]} />
              </article>
            </Reveal>
            <Reveal className="md:col-span-4">
              <article className="grid h-full overflow-hidden rounded-2xl bg-panel sm:grid-cols-2">
                <ChipsPanel kind="connect" tone="soft" className="order-last sm:order-first" />
                <ReasonText r={reasons[3]} />
              </article>
            </Reveal>
          </div>
        </section>

        {/* 5. TAILOR LAB: full-width panel */}
        <section id="tailor" className={`${wrap} pb-24 lg:pb-32`}>
          <Reveal>
            <h2 className={`${h2} max-w-[20ch]`}>Tailor Lab starts with your problem.</h2>
            <p className={lead}>
              When nothing off the shelf fits, we design the software or AI agent around how you work, then connect it
              to the systems you already run.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <TailorProgress />
          </Reveal>
        </section>

        {/* 6. TESTIMONIALS: auto-cycling card stack (sample quotes in lib/testimonials.ts) */}
        <section id="clients" className="border-t border-line">
          <div className={`${wrap} grid items-center gap-12 py-24 lg:grid-cols-12 lg:gap-16 lg:py-32`}>
            <Reveal className="lg:col-span-4">
              <h2 className={h2}>What our clients say.</h2>
              <p className={lead}>Teams that moved from generic tools to software cut for their sector.</p>
            </Reveal>
            <Reveal className="lg:col-span-8">
              <TestimonialCards />
            </Reveal>
          </div>
        </section>

        {/* 7. CONTACT: statement with side panel */}
        <section id="contact" className="bg-panel/70">
          <div className={`${wrap} grid items-center gap-12 py-24 lg:grid-cols-12 lg:gap-16 lg:py-32`}>
            <Reveal className="lg:col-span-7">
              <h2 className={`${h2} max-w-[16ch]`}>Complicated is where we start.</h2>
              <p className={lead}>
                One Tech is based in Milan and works in Italian and English. Tell us about your project and we will
                get back to you.
              </p>
              <ul className="mt-8 space-y-4 text-lg">
                <li>
                  <a
                    href="mailto:sales@otech.one"
                    className="inline-flex items-center gap-3 font-medium transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <EnvelopeSimple weight="regular" size={24} aria-hidden className="text-accent" />
                    sales@otech.one
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/393409683934"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 font-medium transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                  >
                    <WhatsappLogo weight="regular" size={24} aria-hidden className="text-accent" />
                    +39 340 968 3934 on WhatsApp
                  </a>
                </li>
              </ul>
              <div className="mt-8">
                <Button href={DEMO_URL}>Book a demo</Button>
              </div>
            </Reveal>
            <Reveal className="lg:col-span-5">
              <MapPanel className="aspect-[4/3] lg:aspect-[4/5]" />
            </Reveal>
          </div>
        </section>

        {/* 8. FAQ: accordion */}
        <section id="faq">
          <div className={`${wrap} py-24 lg:py-32`}>
            <Reveal>
              <h2 className={h2}>Questions, answered.</h2>
            </Reveal>
            <Reveal className="mt-12 max-w-3xl divide-y divide-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <Plus
                      weight="regular"
                      size={20}
                      aria-hidden
                      className="shrink-0 text-accent transition-transform duration-300 group-open:rotate-45"
                    />
                  </summary>
                  <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-mute">{f.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* 9. DEMO FORM: tinted panel with form */}
        <section id="demo" className={`${wrap} pb-24 lg:pb-32`}>
          <Reveal>
            <div className="grid gap-12 rounded-2xl bg-tint px-6 py-14 md:px-12 md:py-20 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <h2 className={h2}>See it on your own business.</h2>
                <p className={lead}>
                  Tell us about your team and we will show you how One Tech would fit the way you work.
                </p>
              </div>
              <div className="lg:col-span-7">
                <DemoForm />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className={`${wrap} flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between`}>
          <div>
            <Logo size={34} />
            <p className="mt-3 text-sm text-mute">Custom software, AI and automation. Milan, Italy.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-mute transition-colors hover:text-ink">
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-mute">
            <a href="/privacy" className="transition-colors hover:text-ink">
              Privacy policy
            </a>
            <CookieSettingsButton className="transition-colors hover:text-ink" />
            <span>&copy; 2026 One Tech</span>
          </div>
        </div>
      </footer>

      <ChatWidget />
      <CursorGlow />
    </>
  );
}

function ReasonText({ r }: { r: (typeof reasons)[number] }) {
  return (
    <div className="flex h-full min-h-60 flex-col justify-between gap-10 p-8">
      <r.icon weight="regular" size={28} aria-hidden className="text-accent" />
      <div>
        <h3 className="text-2xl font-medium tracking-tight">{r.title}</h3>
        <p className="mt-3 max-w-[40ch] text-base leading-relaxed text-mute">{r.body}</p>
      </div>
    </div>
  );
}

