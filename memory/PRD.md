# PRD — Vaibhav Kanhere · Motion-First Cinematic Portfolio

## Original problem statement
Build a motion-first, cinematic, editorial personal portfolio for VAIBHAV KANHERE — "Tourism & Hospitality Marketing Professional · Content Creator · Travel Product Builder". Core line: "I market travel businesses — and I build the systems behind them." Must NOT look like a resume/corporate/SaaS/AI-generic site. Light off-white editorial foundation, dark ink typography, terracotta accent; photography + typography as heroes; motion-led throughout (masked hero reveal, scroll triggers, parallax, horizontal scroll, animated workflows); respect prefers-reduced-motion; never invent metrics/clients/testimonials; use editable placeholders. Old portfolio reference: adnanbvp.my.canva.site/digitalmarketing-portfolio.

## User decisions (confirmed)
- Curated stock travel photography (Unsplash/Pexels), no fake photos of Vaibhav; imagery easily swappable
- Full single-page cinematic experience with smooth section navigation
- Framer Motion (`motion`) + Lenis smooth scroll; performance-first, no gimmicks
- "Things I've Built" gets major visual importance with animated workflow diagrams
- Contact details: user to provide real email/LinkedIn/WhatsApp later — placeholders in use

## Architecture
- Frontend: Vite + React 19 + TS, Tailwind v4, motion (MotionConfig reducedMotion="user"), lenis
- Backend: FastAPI + MongoDB (motor); POST /api/contact stores inquiries (+ /api/status template routes)
- Content: all copy/imagery centralized in `frontend/src/lib/data.ts` (edit there to swap content/photos/contact links)
- Theme tokens in `frontend/src/index.css` (paper/ink/stone/terracotta/night/coal; Playfair Display + DM Sans + JetBrains Mono)

## User personas
- Recruiter / hospitality company evaluating marketing + systems capability
- Potential freelance client (travel/hospitality business owner)
- Travel industry peer / collaborator

## Core requirements (static)
Hero (masked line reveal, parallax) → Story journey (7 steps) → Experience (Shalom Backpackers, Moustache Escapes) → Things I've Built (Triplin, Travel CRM w/ low-margin warning, Hospitality CRM) → 9-chapter case studies → Marketing gallery (filterable) → On the road (horizontal scroll) → Approach diagram → Skills system → Why travel → Contact (form + Email/LinkedIn/WhatsApp CTAs). Sticky nav with active-section pill; full-screen mobile menu; slow editorial marquee.

## Implemented (2026-09-10)
- Hero redesigned (2026-09-17): light editorial layout with real photo cutout of Vaibhav over terracotta circle, "Hello!" pill, "I'm Vaibhav 👋, A Tourism & Hospitality Marketing Professional" masked reveal, 5 floating skill tags (Social Media, Travel Marketing, Brand Strategy, Content, Hospitality), side stats (3 Systems / 2 Brands), split CTA pill (Explore my work / Let's connect). Portrait: /frontend/public/portrait.png (background-removed cutout from his real B&W photo, over the terracotta circle — user confirmed this version).
- Section 02 rebuilt (2026-09-17): "HOW IT STARTED" — scroll-driven 8-chapter editorial story (src/components/portfolio/story/), replacing JourneyPathway. Warm ivory #F7F2E8 + grain texture, orange #FF6B1A accent, center progress rail that draws on scroll, oversized cropped chapter numbers with parallax, word-by-word title reveals, sticky "8 CHAPTERS. ONE DIRECTION → TRAVEL." statement. Chapters: 01 Digital Marketing 2020 / 02 E-commerce Mar 2022 (₹20K sales, ₹2.5K ad spend, 2 months, process chain) / 03 First website (13+ cities, simplified India map pins) / 04 @nagpurtaveler travel content (10K+ followers, social card) / 05 MBA Travel & Tourism IITTM 2023–2026 / 06 UrbanHook Events / 07 Hospitality (light compact cards, images removed per user) / 08 The Turn — Triplin (white bg, compact, black chips + orange accents, triplin.co.in CTA). User rule: no black/colored theme takeovers in Section 02 — keep it white/ivory with orange accents only. Later pass: hero right stat = "6 Years in Digital Marketing 2020→Today"; Section 02 intro = two-column compact (title left, "8 CHAPTERS ONE DIRECTION → TRAVEL" right, sticky statement removed); chapters alternate starting right-to-left; ALL photos removed from Section 02 (CSS/typographic visuals only: browser card, process chain, SVG India map, typographic social card, IITTM ticket w/ barcode, CSS event posters). MaskedLine now uses useInView (whileInView was stuck — fixed site-wide in Reveal.tsx).
- Section 03 redesign (2026-09-18): "PROFESSIONAL EXPERIENCE" in story language — cream bg + grain, orange line entering from left with nodes at each experience and → arrow exiting right toward Section 04, faded 01/02 numbers, Caveat handwritten orange "2 months"/"3 months" annotations (added @fontsource-variable/caveat, --font-hand), black tags, exact durations (Shalom: Jun–Jul 2025; Moustache: Mar–May 2026), 100% F&B revenue target metric, non-identical blocks (Shalom straight image, Moustache tilted polaroid frame). Mobile: left vertical orange rail.
- Media dashboard (2026-09-17): password-protected /admin (JWT 12h, ADMIN_PASSWORD in backend/.env) to upload images/videos (Emergent object storage, prefix vk-portfolio/media/, Mongo `media` collection, soft delete). Uploads tagged travel → appear first in "On the road"; marketing → first in Marketing gallery. Backend: lib/storage.py, lib/admin_auth.py, routers/media.py. Frontend hook: lib/media.ts useMedia(). Verified end-to-end (login 401/200, upload, list, serve, delete, gallery render).
- Section 02 final redesign (2026-09-18): serpentine journey — one continuous thin orange line LEFT→RIGHT (ch01-03), U-turn down, RIGHT→LEFT (visual order 06-05-04), U-turn down, LEFT→RIGHT (ch07-08), orange node dots per chapter, animated curve connectors. Concise copy, faded oversized numbers, black rounded tags, small inline visuals (metric chips ₹20K/₹2.5K/2mo, mini India map, @nagpurtaveler 10K+ chip, IITTM ticket, mini event posters). Ch08: "I'm building Triplin." + pulsing "Currently building." + triplin.co.in chip. Mobile: chapters stack with left vertical progress rail. NOTE: whileInView is unreliable in this codebase — use useInView + animate (see Row/Turn in HowItStarted.tsx, MaskedLine in Reveal.tsx). All metrics user-supplied. Section eyebrows renumbered 03–10 downstream. Lenis instance exposed as window.__lenis for e2e scrolling (data-testid-based, no chapter ids).
- Full single-page cinematic portfolio, all 11 sections, motion-led, reduced-motion support
- Interactive workflow simulators for all 3 projects; LOW MARGIN — REVIEW PRICING toggle state on Travel CRM
- CaseStudyModal: full-screen reader, 9 numbered chapters, sidebar jump nav, Esc to close, page scroll lock
- Filterable marketing gallery; scroll-driven horizontal "On the road" gallery with progress bar (reduced-motion fallback)
- Contact form → POST /api/contact → MongoDB, sonner toast confirmation; validation (422 on bad input)
- SEO + Open Graph metadata; data-testids on all interactive elements
- Verified: typecheck clean; API curl via public URL; Playwright passes (desktop flows + mobile menu)

## Backlog / next tasks
- P0: Replace placeholder contact details (email/LinkedIn/WhatsApp in `data.ts` CONTACT) with real ones
- P0: Swap placeholder imagery with Vaibhav's own travel photography/videos and real campaign creatives
- P1: Real UI screenshots into case-study chapter 07 placeholder frames
- P1: Admin view or email notification for contact inquiries (Resend integration)
- P2: Case study deep-links (URL routes per project), OG image, analytics
