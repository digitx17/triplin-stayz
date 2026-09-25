# PRD — Triplin-Stayz (Vaibhav Kanhere Portfolio)

## Original problem statement
Import the existing `saazjam/triplin-stayz` repo (cinematic, motion-first personal portfolio for Vaibhav Kanhere — travel/hospitality/marketing), boot it in this workspace, and return a working live preview preserving all content and functionality. Then Phase 1 security remediation (rotate admin password, fix CORS, contact spam protection, admin brute-force protection). Phase 2 (real contact links, email alerts, gallery reorder/captions) pending user answers.

## Architecture
- Frontend: Vite + React 19 + TypeScript strict + Tailwind v4 + shadcn/ui, Lenis smooth scroll, TanStack Query, relative `/api` fetch layer (Vite dev proxy → :8001)
- Backend: FastAPI + motor (async MongoDB) + Pydantic v2, routers/ (media, content), lib/ (db, admin_auth JWT, storage via Emergent object storage)
- DB: local mongod via MONGO_URL / DB_NAME env
- Tests: pytest (backend/tests), Playwright (tests/e2e)

## User personas
- Public visitors: recruiters, clients, collaborators viewing the portfolio
- Owner (Vaibhav): /admin dashboard — media upload, skills/toolkit/categories editing, experience photos

## Core requirements (static)
- Full scrolling portfolio: parallax hero, How-it-started path, experience timeline (Shalom Backpackers, Moustache Escapes), Things I've built, marketing gallery with filters, skills, toolkit marquee, Why travel, contact form
- /admin private dashboard (JWT, 12h token)
- Contact enquiries persist to MongoDB
- Reduced-motion support, sticky nav, mobile menu

## Implemented (2026-09-25)
- Phase 0: repo imported into /app, backend/.env recreated (MONGO_URL, DB_NAME, CORS_ORIGINS, JWT_SECRET, fresh ADMIN_PASSWORD, EMERGENT_LLM_KEY), deps installed, `start` script added for supervisor, all services running, preview live
- Phase 1: admin password rotated (old leaked passwords dead); CORS pinned to preview origin, wildcard+credentials removed; /api/contact honeypot field + per-IP rate limit (5/10min → 429); /api/admin/login brute-force lockout (5 fails/15min → 429); frontend honeypot input added
- 2026-09-25 (gallery rework): Marketing work cards realigned — rows 07-10 switched to stacked layout (visual on top, no more cramped/empty columns); every category card now has a View Project button opening a full-screen project modal that groups media by brand (e.g. Photoshoot → Shalom Backpackers / Moustache Escapes); media model extended with embed kind — admin can add Instagram/YouTube links (POST /api/media/link, host-validated) which render as in-page embeds in the modal; admin dashboard gained Upload file / Instagram-YouTube link mode toggle and embed tiles in the upload grid; OnTheRoadGallery excludes embeds

## Backlog
- P0: deploy target decision (sets final CORS origins + secret location)
- P1: real contact links (email / LinkedIn / WhatsApp — currently placeholders in src/lib/data.ts)
- P1: contact-form email alerts (Resend / SendGrid / Gmail — TBD)
- P2: upload real photography, reorder gallery uploads, per-experience captions

## Next tasks
1. User confirms deploy target + contact link values + email provider
2. Wire contact email alerts via chosen provider
3. Replace placeholder photography via /admin
