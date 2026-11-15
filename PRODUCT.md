# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Primary:** owners and managers of small and medium Polish firms who need software built and are looking for one person to do it. They arrive with a business problem, not a technology: "klienci nie mogą nas znaleźć", "chcę sprzedawać online", "dane mamy w arkuszach i mailach", "potrzebuję programu do konkretnego zadania". Most do not know the difference between a website, a web app and a desktop program, and should not have to.
- **Secondary:** firms that already have a product and need a developer (Next.js audits, extensions). Served by `/nextjs-developer`, outside the main path.
- **Operator:** Emanuel himself, using `/admin` to publish projects, edit prices, read client messages, manage testimonials and check traffic.

## Product Purpose

emanuelwloch.pl is Emanuel Włoch's offer and portfolio. It must make a visitor understand within the first screen that Emanuel builds software for firms — websites, online shops, web applications with databases and admin panels, and Windows programs — and then prove it with real, inspectable work before asking for contact.

Success: a visitor who needs any of those things recognises their problem, sees comparable work, and sends a message through the contact form.

## Positioning

One person designs, programs, connects the data and deploys — from the public website to the panel and database behind it, and to desktop programs. The client talks to the same person who writes the code. Based in Jarosław (Podkarpackie), working remotely across Poland.

## Operating Context

- Services offered (confirmed 2026-11-14): firm websites, online shops, web applications and admin panels, databases and data organisation, Windows programs. Mobile apps are **not** offered until a published realisation exists.
- Prices are net; the visitor gets scope and an exact quote before work starts. Base prices are stored in the database and edited in the admin panel.
- Projects, services, testimonials and settings live in Turso (libSQL) and are edited in `/admin`. Pages revalidate every 60 s.
- A public, read-only demo of the admin panel on fictional data is approved (2026-11-14). It must never read or write production data.

## Capabilities and Constraints

- Next.js 16 App Router, React 19, TypeScript, Tailwind 4, GSAP 3.15 (ScrollTrigger, SplitText), React Three Fiber, `@paper-design/shaders-react`. Deployed on Vercel.
- Polish only. Copy addresses the client directly ("Ty", "Twoja firma").
- `prefers-reduced-motion` and the in-page "Ogranicz ruch" switch must leave all content visible with no decorative motion.
- SEO pages per service and per city (Jarosław, Rzeszów), guides under `/poradniki`, case studies under `/projekty/[id]`, catalog under `/realizacje`.

## Brand Commitments

- Name and mark: "Emanuel Włoch", wordmark `ew`, terminal glyph `>_` (favicon, `BrandMark`).
- Palette (confirmed 2026-11-15): dark graphite base; steel blue is the colour of technology (screens, 3D, lines); copper is spent only on actions (primary buttons, prices, the active row); the process and opinions sections sit on warm paper. Light as glow, never neon. Tokens: `src/components/palette/palettes.css`.
- Voice: concrete, calm, second person, no hype.

## Evidence on Hand

- 13 published projects in the database, with screenshots in `public/projects/` and short preview videos in `public/project-previews/`. Mix: offer websites (VIP Transfery, Iluminatia Tattoo, BCC), sites (Zielona Baza, Fundacja Serce Mototrasy, Dmuchańce Afryka), web apps (Solid Print, Mototrasa Tour with Supabase, this site with its own CMS on Turso), shops (Łapki w Ciapki, shop demo with admin panel on Prisma/SQLite), Samsung TV app (COCO), Windows program (WARDOGS Companion, C#/.NET/WPF/SQLite).
- Several projects are test versions or own demos; that status must stay truthful (no claim of live sales, payments or production use where none is confirmed).
- Client testimonials are stored in the database and must be quoted verbatim.
- Portrait: `public/emanuel_wloch.jpg`. Promo film: `src/lib/promo-film.ts`.
- **Absent, must not be invented:** business results (conversion or revenue growth), Lighthouse scores, client counts, years-of-experience beyond "od 2019", mobile app realisations.

## Product Principles

1. Lead with the client's problem, then show the kind of software that solves it.
2. Show real screens before describing technology; technology names come last.
3. Every claim has a visible proof on the site or is not made.
4. The panel and data behind a product are part of what is sold, so they are shown, not just mentioned.
5. One clear next step on every page: describe your project.

## Accessibility & Inclusion

Keyboard access, visible focus, labelled form fields, reduced-motion parity, readable contrast on the dark theme.
