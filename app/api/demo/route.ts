import { NextResponse } from "next/server";
import { normalizeDemo, validateDemo, LIMITS, type DemoFields } from "@/lib/demo";

export const runtime = "nodejs";

const RESEND_URL = "https://api.resend.com/emails";
const RESEND_EVENTS_URL = "https://api.resend.com/events/send";
const MAX_BODY_BYTES = 8_000;

const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function buildEmail(f: DemoFields) {
  const rows: [string, string][] = [
    ["Name", f.name],
    ["Email", f.email],
    ["Company", f.company],
    ["Team size", f.teamSize],
    ["Message", f.message || "(none)"],
    ["Privacy notice accepted", f.privacy ? "Yes" : "No"],
    ["Newsletter", f.newsletter ? "Subscribed" : "Not subscribed"],
  ];
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#18181b">
<h2 style="margin:0 0 16px;color:#6F4CFE">New demo request</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#52525b;vertical-align:top">${k}</td><td style="white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table></div>`;
  return { text, html };
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.DEMO_TO_EMAIL;
  if (!apiKey || !to) {
    return NextResponse.json({ error: "Booking is not configured yet. Please try again later." }, { status: 500 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return NextResponse.json({ error: "Request too large." }, { status: 413 });

  let body: Record<string, unknown>;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("shape");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this field. Pretend success so bots move on.
  if (str(body.website)) return NextResponse.json({ ok: true });

  const input: DemoFields = {
    name: str(body.name),
    email: str(body.email),
    company: str(body.company),
    teamSize: str(body.teamSize),
    message: str(body.message),
    privacy: body.privacy === true,
    newsletter: body.newsletter === true,
  };
  // Consent flags must be real booleans when present.
  for (const k of ["privacy", "newsletter"] as const) {
    if (body[k] !== undefined && typeof body[k] !== "boolean") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
  }
  // Reject oversized raw values before any processing.
  if (input.name.length > LIMITS.name * 2 || input.company.length > LIMITS.company * 2 || input.message.length > LIMITS.message * 2) {
    return NextResponse.json({ error: "Request too large." }, { status: 413 });
  }

  const errors = validateDemo(input);
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 400 });

  // Only valid submissions count toward the limit, so typos never lock anyone out.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const fields = normalizeDemo(input);
  const { text, html } = buildEmail(fields);

  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || "One Tech <onboarding@resend.dev>",
        to: [to],
        reply_to: fields.email,
        subject: `Demo request from ${fields.name} at ${fields.company}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) {
      console.error("Resend error", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 });
    }
  } catch (err) {
    console.error("Resend request failed", err);
    return NextResponse.json({ error: "We could not send your request. Please try again." }, { status: 502 });
  }

  // Tell Resend whether this person opted in to the newsletter. The booking already succeeded,
  // so a failure here is logged and never shown to the visitor.
  try {
    const res = await fetch(RESEND_EVENTS_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "user.subscribed",
        email: fields.email,
        payload: { subscribed: fields.newsletter },
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) console.error("Resend event error", res.status, await res.text().catch(() => ""));
  } catch (err) {
    console.error("Resend event failed", err);
  }

  return NextResponse.json({ ok: true });
}
