# One Tech website

Marketing site for One Tech, a Milan-based company that builds custom software, AI and automation.
Built with Next.js (App Router), React, Tailwind CSS v4 and Motion.

## What is on the page

- Hero with the interactive "One Tech" wordmark and a card stack for the two verticals
- Client logo carousel (images come from `public/logos`)
- Products folder (KORE, ARGO, ALL MESSAGE, MILO) with decrypted text
- Why One Tech, Tailor Lab progress animation, testimonials, contact and FAQ
- Demo request form that emails the team through Resend
- AI chat assistant powered by Groq
- Cookie consent banner and a privacy and cookie policy page (`/privacy`)

## Getting started

Requires Node.js 20.9 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run typecheck` | TypeScript check |

## Environment variables

Set these in `.env.local` locally and in your host's settings when you deploy. See `.env.example`.

| Variable | Used for |
|---|---|
| `GROQ_API_KEY` | Chat assistant (`app/api/chat`) |
| `RESEND_API_KEY` | Demo request emails and the `user.subscribed` event (`app/api/demo`) |
| `DEMO_TO_EMAIL` | Inbox that receives demo requests |
| `RESEND_FROM` | Sender address (verify a domain in Resend for production) |

## Reasons for the design 

- A lot of animations where chosen to make the webpage unique and not boring 
- API call where used, for chatbot integration. Real email send for booking demo and event management 
    when the user accepts newsletter.
