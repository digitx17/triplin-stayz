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
- Hero redesigned (2026-09-17): light editorial layout with real photo cutout of Vaibhav over terracotta circle, "Hello!" pill, "I'm Vaibhav 👋, A Tourism & Hospitality Marketing Professional" masked reveal, 5 floating skill tags (Social Media, Travel Marketing, Brand Strategy, Content, Hospitality), side stats (3 Systems / 2 Brands), split CTA pill (Explore my work / Let's connect). Portrait: /frontend/public/portrait-full.jpg (his real B&W photo in an arch frame over the terracotta circle — transparent cutout removed per user request).
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
