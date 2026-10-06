import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GROQ_URL = "https://api.groq.com/openai/v1/responses";
const MODEL = "openai/gpt-oss-120b";
const INSTRUCTIONS =
  "You are the website assistant for One Tech. Answer only general questions about One Tech and its products, in under 80 words, in plain text without markdown, and never use em-dashes or en-dashes. Facts: One Tech is based in Milan, Italy, works in Italian and English, and builds custom software, AI and automation tailored to a sector. Projects go live in weeks rather than months. Products: KORE, a plug and play set of digital engines for credit agents and brokers in Italian consumer credit covering the whole loan application journey; ARGO, document intelligence that reads documents and prepares the data, connected to a management system or CRM or used as a web app; ALL MESSAGE, which brings WhatsApp, Instagram, Facebook and email into one conversation; MILO, the One Tech AI agent that talks to customers, gathers information and guides them through each stage. Tailor Lab builds custom software or AI agents from the client's problem. Contact: sales@otech.one. If you do not know something, say a One Tech team member will follow up and suggest the demo form.";
const MAX_INPUT = 500;

// Naive per-IP limiter for the proof of concept (resets on server restart).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 15;
}

type OutputItem = { type?: string; content?: { type?: string; text?: string }[] };

function extractText(data: { output_text?: string; output?: OutputItem[] }) {
  if (typeof data.output_text === "string" && data.output_text) return data.output_text;
  return (data.output ?? [])
    .filter((o) => o.type === "message")
    .flatMap((o) => o.content ?? [])
    .filter((c) => c.type === "output_text" && c.text)
    .map((c) => c.text)
    .join("")
    .trim();
}

export async function POST(req: Request) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: "Chat is not configured." }, { status: 500 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages. Try again in a minute." }, { status: 429 });

  let message = "";
  try {
    const body = await req.json();
    message = typeof body?.message === "string" ? body.message.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (!message || message.length > MAX_INPUT) {
    return NextResponse.json({ error: `Write a question of up to ${MAX_INPUT} characters.` }, { status: 400 });
  }

  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: MODEL, input: message, instructions: INSTRUCTIONS }),
      signal: AbortSignal.timeout(30_000),
    });
    if (!res.ok) {
      return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 502 });
    }
    const reply = extractText(await res.json());
    if (!reply) return NextResponse.json({ error: "The assistant returned no answer." }, { status: 502 });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "The assistant is unavailable right now." }, { status: 502 });
  }
}
