import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
  size?: "md" | "sm";
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition duration-300 ease-out hover:-translate-y-px active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const variants = {
  primary: "bg-ink text-paper hover:bg-accent",
  secondary: "border border-ink/25 text-ink hover:bg-panel",
};

const sizes = { md: "px-6 py-3 text-sm", sm: "px-4 py-2 text-sm" };

export function Button({ href, children, variant = "primary", external, size = "md" }: Props) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${sizes[size]}`}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
      {variant === "primary" && <ArrowRight weight="regular" size={16} aria-hidden />}
    </a>
  );
}
