export const TEAM_SIZES = ["1 to 10", "11 to 50", "51 to 200", "More than 200"] as const;

export type DemoFields = {
  name: string;
  email: string;
  company: string;
  teamSize: string;
  message: string;
  /** Required consent to process the data for this request. */
  privacy: boolean;
  /** Optional newsletter opt-in. */
  newsletter: boolean;
};

export type TextKey = "name" | "email" | "company" | "teamSize" | "message";

export type DemoErrors = Partial<Record<keyof DemoFields, string>>;

export const LIMITS = { name: 100, email: 254, company: 120, message: 1000 } as const;

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
const COMPANY_RE = /^[\p{L}\p{M}\p{N}][\p{L}\p{M}\p{N}\s.,&'’()+/!-]*$/u;
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,24}$/;

/** Collapse whitespace and trim, so "  Ana   Ruiz " becomes "Ana Ruiz". */
export const clean = (v: string) => v.replace(/\s+/g, " ").trim();

export function normalizeDemo(v: DemoFields): DemoFields {
  return {
    name: clean(v.name),
    email: v.email.trim().toLowerCase(),
    company: clean(v.company),
    teamSize: v.teamSize,
    message: v.message.replace(/\r\n/g, "\n").trim(),
    privacy: v.privacy === true,
    newsletter: v.newsletter === true,
  };
}

/** Shared by the form (instant feedback) and the API route (the real check). */
export function validateDemo(input: DemoFields): DemoErrors {
  const v = normalizeDemo(input);
  const e: DemoErrors = {};

  // Name
  if (!v.name) e.name = "Enter your full name.";
  else if (v.name.length < 2) e.name = "Your name needs at least 2 characters.";
  else if (v.name.length > LIMITS.name) e.name = `Keep your name under ${LIMITS.name} characters.`;
  else if (!NAME_RE.test(v.name) || (v.name.match(/\p{L}/gu) ?? []).length < 2) {
    e.name = "Use letters only. Spaces, hyphens, apostrophes and dots are fine.";
  }

  // Email
  const [local = "", domain = ""] = v.email.split("@");
  if (!v.email) e.email = "Enter your work email.";
  else if (v.email.length > LIMITS.email) e.email = "That email address is too long.";
  else if (
    !EMAIL_RE.test(v.email) ||
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    v.email.includes("..") ||
    domain.startsWith("-") ||
    domain.includes("-.")
  ) {
    e.email = "Enter a valid email, for example name@company.com.";
  }

  // Company
  if (!v.company) e.company = "Enter your company name.";
  else if (v.company.length < 2) e.company = "Your company name needs at least 2 characters.";
  else if (v.company.length > LIMITS.company) e.company = `Keep the company name under ${LIMITS.company} characters.`;
  else if (!COMPANY_RE.test(v.company)) {
    e.company = "Use letters, numbers and common punctuation only.";
  }

  // Team size
  if (!v.teamSize) e.teamSize = "Choose your team size.";
  else if (!(TEAM_SIZES as readonly string[]).includes(v.teamSize)) e.teamSize = "Choose one of the listed ranges.";

  // Message (optional)
  if (v.message) {
    if (v.message.length > LIMITS.message) e.message = `Keep this under ${LIMITS.message} characters.`;
    else if (CONTROL_CHARS.test(v.message)) e.message = "Remove special control characters from your message.";
    else if (v.message.length < 10) e.message = "Add a little more detail, or leave this empty.";
  }

  // Privacy consent (required)
  if (v.privacy !== true) e.privacy = "Accept the data privacy notice to book a demo.";

  return e;
}
