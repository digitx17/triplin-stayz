import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, useInView, useScroll } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Mail,
  MapPin,
  Play,
  Search,
  Star,
} from "lucide-react";
import { EASE } from "@/lib/anim";
import { ORANGE, CountUp } from "./story/shared";
import { useMedia } from "@/lib/media";
import type { MediaItem } from "@/lib/media";
import { useSiteContent } from "@/lib/content";
import { PHOTOSHOOT, SOCIAL, INFLUENCERS, IMAGES } from "@/lib/marketingData";

/* ---------- small building blocks ---------- */

function Rise({ children, delay = 0, y = 28, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-ink/45">{children}</p>;
}

function Hand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-hand text-2xl leading-tight ${className}`} style={{ color: ORANGE }}>
      {children}
    </span>
  );
}

function CaseTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/55">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: ORANGE }} /> Case study
    </span>
  );
}

function Movement({
  num,
  kicker,
  title,
  children,
  testId,
}: {
  num: string;
  kicker: string;
  title: ReactNode;
  children: ReactNode;
  testId: string;
}) {
  return (
    <div className="relative pl-12 sm:pl-20" data-testid={testId}>
      {/* node dot on the spine */}
      <span className="absolute left-4 top-2 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 bg-paper sm:left-8" style={{ borderColor: ORANGE }} />
      {/* oversized faded number */}
      <span aria-hidden="true" className="pointer-events-none absolute -left-1 -top-8 select-none font-heading text-[80px] font-semibold leading-none text-ink/[0.06] sm:text-[120px]">
        {num}
      </span>
      <Rise>
        <div className="flex items-center gap-3">
          <Kicker>{kicker}</Kicker>
          <span className="h-px w-10" style={{ background: `${ORANGE}66` }} />
        </div>
        <h3 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h3>
      </Rise>
      <div className="mt-7">{children}</div>
    </div>
  );
}

/* ---------- 01 · Photoshoot contact sheet ---------- */

function Photoshoot() {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {PHOTOSHOOT.map((s, i) => (
          <Rise key={s.n} delay={i * 0.06}>
            <figure className={`group relative bg-white p-1.5 pb-5 shadow-md ${i % 2 ? "sm:mt-6" : ""} ${i === 2 ? "-rotate-1" : i === 4 ? "rotate-1" : ""}`}>
              <div className="relative overflow-hidden">
                <img src={s.src} alt={s.cap} loading="lazy" className="aspect-[4/5] w-full object-cover grayscale-[15%] transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.04]" />
                <span className="absolute left-1.5 top-1.5 bg-black/70 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-white">{s.n}</span>
              </div>
              <figcaption className="flex items-center justify-between px-1 pt-1.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-ink/60">{s.cap}</span>
                <span className="font-mono text-[8px] text-ink/35">{s.coord}</span>
              </figcaption>
            </figure>
          </Rise>
        ))}
      </div>
      {/* tape + annotation */}
      <span aria-hidden="true" className="absolute -top-3 left-1/2 hidden h-6 w-24 -translate-x-1/2 -rotate-2 bg-[#e6dcc4]/70 sm:block" />
      <div className="mt-5 flex items-center gap-2">
        <svg viewBox="0 0 40 30" className="h-6 w-8" fill="none" stroke={ORANGE} strokeWidth="1.6" aria-hidden="true">
          <path d="M36 6 Q 10 4 6 24" strokeLinecap="round" />
          <path d="M4 15 L6 25 L14 21" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <Hand>36 frames from one shoot day.</Hand>
      </div>
    </div>
  );
}

/* ---------- 02 · Social media content (phones) ---------- */

function Phone({ src, label, cap, rotate }: { src: string; label: string; cap: string; rotate: string }) {
  return (
    <div className={`relative w-[128px] shrink-0 rounded-[1.6rem] border-4 border-ink bg-ink p-1 shadow-xl sm:w-[150px] ${rotate}`}>
      <span className="absolute left-1/2 top-1.5 z-10 h-1 w-8 -translate-x-1/2 rounded-full bg-white/30" />
      <div className="relative overflow-hidden rounded-[1.3rem]">
        <img src={src} alt={cap} loading="lazy" className="aspect-[9/16] w-full object-cover" />
        <span className="absolute inset-0 bg-black/15" />
        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.15em] text-ink">{label}</span>
        <span className="absolute bottom-8 left-2 flex items-center gap-1 text-white">
          <Play className="h-3 w-3 fill-white" />
          <span className="font-mono text-[8px] tracking-widest">{cap}</span>
        </span>
        <span className="absolute bottom-2 left-2 flex items-center gap-1.5 text-white">
          <Heart className="h-3 w-3 fill-white" />
          <span className="font-mono text-[8px]">2.1k</span>
        </span>
      </div>
    </div>
  );
}

function SocialContent() {
  const rot = ["rotate-[-4deg]", "rotate-[1deg] sm:-mt-4", "rotate-[5deg]"];
  return (
    <div>
      <div className="flex items-start gap-3 sm:gap-5">
        {SOCIAL.map((s, i) => (
          <Rise key={s.label} delay={i * 0.1}>
            <Phone src={s.src} label={s.label} cap={s.cap} rotate={rot[i]} />
          </Rise>
        ))}
      </div>
      <p className="mt-6 max-w-xs text-sm leading-relaxed text-ink/65">
        A repeatable content system — reels, stories and posts planned as one calendar across brands.
      </p>
    </div>
  );
}

/* ---------- 03 · Events ---------- */

function Events() {
  return (
    <div className="flex flex-wrap items-start gap-5">
      <Rise>
        <figure className="relative w-64 rotate-[-2deg] bg-white p-1.5 pb-4 shadow-lg">
          <img src={IMAGES.eventPhoto} alt="Live event" loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <figcaption className="px-1 pt-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-ink/55">Venue · night show</figcaption>
        </figure>
      </Rise>
      <Rise delay={0.1}>
        {/* poster + ticket */}
        <div className="w-56 rotate-[1.5deg]">
          <div className="border border-ink/15 bg-ink p-5 text-paper">
            <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/50">Live · presents</p>
            <p className="mt-2 font-heading text-2xl leading-none">Open Mic<br />& Music Night</p>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.15em] text-white/60">Sat · 7 PM · Rooftop</p>
          </div>
          <div className="relative border border-t-0 border-ink/15 bg-white px-5 py-3">
            <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#F7F2E8]" />
            <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-[#F7F2E8]" />
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">Admit one · No. 0042</p>
          </div>
        </div>
      </Rise>
      <Rise delay={0.15} className="self-center">
        <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/70">
          <span className="rounded-full border border-ink/25 px-2.5 py-1">Plan</span>
          <ArrowRight className="h-3.5 w-3.5" style={{ color: ORANGE }} />
          <span className="rounded-full border border-ink/25 px-2.5 py-1">Promote</span>
          <ArrowRight className="h-3.5 w-3.5" style={{ color: ORANGE }} />
          <span className="rounded-full px-2.5 py-1 text-paper" style={{ background: ORANGE }}>Execute</span>
        </div>
      </Rise>
    </div>
  );
}

/* ---------- 04 · Influencer collaborations ---------- */

function Influencers() {
  const pos = ["", "sm:mt-10", "sm:mt-4"];
  return (
    <div className="relative">
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block" aria-hidden="true">
        <line x1="12%" y1="30%" x2="46%" y2="60%" stroke={ORANGE} strokeWidth="1" strokeDasharray="4 4" />
        <line x1="46%" y1="60%" x2="82%" y2="40%" stroke={ORANGE} strokeWidth="1" strokeDasharray="4 4" />
      </svg>
      <div className="flex flex-wrap items-start gap-5">
        {INFLUENCERS.map((inf, i) => (
          <Rise key={inf.handle} delay={i * 0.1} className={pos[i]}>
            <div className="w-40 border border-ink/12 bg-white p-2 shadow-sm">
              <img src={inf.src} alt={inf.handle} loading="lazy" className="aspect-square w-full object-cover" />
              <div className="flex items-center justify-between px-1 pt-2">
                <span className="font-mono text-[10px] font-semibold tracking-tight text-ink">{inf.handle}</span>
                <ArrowUpRight className="h-3.5 w-3.5" style={{ color: ORANGE }} />
              </div>
              <p className="px-1 pb-1 font-mono text-[9px] uppercase tracking-[0.15em] text-ink/45">{inf.reach} reach</p>
            </div>
          </Rise>
        ))}
      </div>
      <p className="relative mt-6 max-w-sm text-sm leading-relaxed text-ink/65">
        Creator campaigns mapped as a network — matching voice to brand, brief to barter, reach to bookings.
      </p>
    </div>
  );
}

/* ---------- 05 · Listing directory ---------- */

function Listing() {
  const rows = [
    { name: "The River Loft", loc: "Rishikesh", cat: "Boutique stay", rating: "4.9" },
    { name: "Bayleaf Kitchen", loc: "McLeodganj", cat: "Restaurant", rating: "4.7" },
  ];
  return (
    <div className="grid gap-5 md:grid-cols-[280px_1fr]">
      <Rise>
        {/* map panel */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-ink/12 bg-[#efe7d6]">
          <svg className="absolute inset-0 h-full w-full text-ink/10" aria-hidden="true">
            {[20, 45, 70, 95].map((y) => <line key={y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="currentColor" strokeWidth="1" />)}
            {[15, 40, 65, 90].map((x) => <line key={x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="currentColor" strokeWidth="1" />)}
            <path d="M5 90 C 30 60, 55 80, 95 20" fill="none" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="5 4" />
          </svg>
          {[[26, 68], [58, 44], [80, 26]].map(([x, y], i) => (
            <MapPin key={i} className="absolute h-5 w-5 -translate-x-1/2 -translate-y-full drop-shadow" style={{ left: `${x}%`, top: `${y}%`, color: ORANGE }} fill={ORANGE} />
          ))}
          <span className="absolute bottom-2 left-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ink/40">Directory map</span>
        </div>
      </Rise>
      <Rise delay={0.1}>
        <div className="overflow-hidden rounded-md border border-ink/12 bg-white">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-ink/10 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-ink/40">
            <span>Property · Location</span><span>Category</span><span>Rating</span>
          </div>
          {rows.map((r) => (
            <div key={r.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-ink/8 px-4 py-3 last:border-0">
              <div>
                <p className="font-heading text-lg leading-tight">{r.name}</p>
                <p className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/50"><MapPin className="h-3 w-3" style={{ color: ORANGE }} />{r.loc}</p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink/60">{r.cat}</span>
              <span className="flex items-center gap-1 font-mono text-[11px] text-ink"><Star className="h-3 w-3 fill-current" style={{ color: ORANGE }} />{r.rating}</span>
            </div>
          ))}
          <button className="flex w-full items-center justify-center gap-2 bg-ink py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-paper" data-testid="mw-listing-discover">
            <Search className="h-3.5 w-3.5" /> Discover
          </button>
        </div>
      </Rise>
    </div>
  );
}

/* ---------- 06 · Website ---------- */

function Website() {
  return (
    <div className="max-w-xl">
      <Rise>
        <div className="overflow-hidden rounded-lg border border-ink/15 bg-white shadow-xl">
          <div className="flex items-center gap-2 border-b border-ink/10 bg-[#f3ece0] px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink/20" />
            <span className="ml-3 flex-1 rounded-full bg-white px-3 py-1 font-mono text-[9px] tracking-wide text-ink/40">vaibhavbuilds.travel</span>
          </div>
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-3">
            <span className="font-heading text-base font-semibold">TRAVEL</span>
            <nav className="hidden gap-4 font-mono text-[9px] uppercase tracking-[0.15em] text-ink/60 sm:flex">
              <span>Destinations</span><span>Stays</span><span>Experiences</span>
            </nav>
            <span className="rounded-full px-3 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-paper" style={{ background: ORANGE }}>Explore</span>
          </div>
          <div className="relative">
            <img src={IMAGES.websitePhoto} alt="Travel website hero" loading="lazy" className="aspect-[16/7] w-full object-cover" />
            <span className="absolute inset-0 bg-black/25" />
            <div className="absolute bottom-4 left-5 text-paper">
              <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/70">Plan the journey</p>
              <p className="font-heading text-2xl leading-none">Where will you wander?</p>
            </div>
          </div>
        </div>
      </Rise>
      <div className="mt-4 flex items-center gap-2">
        <Hand>design → build → seo</Hand>
        <ArrowRight className="h-4 w-4" style={{ color: ORANGE }} />
      </div>
    </div>
  );
}

/* ---------- 07 · CRM journey ---------- */

function CRM() {
  const steps = ["Visitor", "Lead", "Booking", "Follow-up", "Returning guest"];
  return (
    <Rise>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-0">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3 sm:gap-0">
            <div className={`rounded-md border px-4 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.15em] ${i === steps.length - 1 ? "border-transparent text-paper" : "border-ink/20 text-ink/70"}`} style={i === steps.length - 1 ? { background: ORANGE } : undefined}>
              {s}
            </div>
            {i < steps.length - 1 && (
              <span className="mx-2 h-6 w-px bg-ink/20 sm:h-px sm:w-8" style={{ background: `${ORANGE}99` }} />
            )}
          </div>
        ))}
      </div>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-ink/65">
        Every enquiry moves through a designed journey — not a dashboard, a relationship mapped end to end.
      </p>
    </Rise>
  );
}

/* ---------- 08 · Blog ---------- */

function Blog() {
  return (
    <Rise>
      <div className="grid items-center gap-6 md:grid-cols-2">
        <figure className="relative overflow-hidden rounded-md">
          <img src={IMAGES.blogPhoto} alt="Travel story" loading="lazy" className="aspect-[5/4] w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-ink">Travel stories</span>
        </figure>
        <div>
          <CaseTag />
          <h4 className="mt-3 font-heading text-2xl leading-tight sm:text-3xl">Where the mountains meet the river.</h4>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
            A slow guide to the temple towns along the Ganges — where to stay, what to eat and the quiet corners the crowds miss.
          </p>
          <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
            Read story <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Rise>
  );
}

/* ---------- 09 · Personal travel content (emphasised) ---------- */

function Personal() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-ink/12 bg-white p-5 shadow-sm sm:p-8">
      <div className="grid items-center gap-8 md:grid-cols-[1.1fr_1fr]">
        <Rise>
          <div className="flex items-center gap-3">
            <span className="font-heading text-3xl font-semibold sm:text-4xl">@nagpurtraveler</span>
          </div>
          <div className="mt-3 flex items-center gap-6">
            <div>
              <CountUp to={10} suffix="K+" className="font-heading text-4xl font-semibold" />
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/45">Followers</p>
            </div>
            <div className="h-10 w-px bg-ink/10" />
            <div className="flex flex-wrap gap-2">
              {["Guides", "Local stories", "Reels", "Maps"].map((t) => (
                <span key={t} className="rounded-full border border-ink/20 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">{t}</span>
              ))}
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/65">
            The creator engine behind the strategy — destinations and experiences told from a local traveller's point of view.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <MapPin className="h-4 w-4" style={{ color: ORANGE }} />
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/55">Nagpur → everywhere</span>
          </div>
        </Rise>
        <Rise delay={0.1}>
          <div className="relative">
            <figure className="w-full max-w-[240px] bg-white p-2 pb-4 shadow-lg">
              <img src={IMAGES.personalHero} alt="Travel content" loading="lazy" className="aspect-[4/5] w-full object-cover" />
            </figure>
            <figure className="absolute -bottom-3 -right-1 w-28 rotate-3 rounded-[0.9rem] border-4 border-ink bg-ink p-0.5 shadow-xl">
              <div className="relative overflow-hidden rounded-[0.7rem]">
                <img src={IMAGES.personalThumb} alt="Reel" loading="lazy" className="aspect-[9/16] w-full object-cover" />
                <Play className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-white text-white" />
              </div>
            </figure>
            <div className="absolute -left-2 -top-4 flex items-center gap-1">
              <Hand className="text-xl">this one's mine.</Hand>
            </div>
          </div>
        </Rise>
      </div>
    </div>
  );
}

/* ---------- 10 · Retention / Loyalty ---------- */

function Retention() {
  const steps = ["Discover", "Book", "Experience", "Return", "Loyalty"];
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_260px]">
      <Rise>
        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] font-bold" style={{ background: i === steps.length - 1 ? ORANGE : "transparent", color: i === steps.length - 1 ? "#fff" : ORANGE, border: `1px solid ${ORANGE}` }}>
                {i + 1}
              </span>
              <span className="font-heading text-xl">{s}</span>
              {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-ink/30" />}
            </li>
          ))}
        </ol>
      </Rise>
      <Rise delay={0.1}>
        <div className="space-y-3">
          {/* loyalty card */}
          <div className="rounded-lg border border-ink/15 bg-ink p-4 text-paper">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">Loyalty</span>
              <Star className="h-3.5 w-3.5" style={{ color: ORANGE }} fill={ORANGE} />
            </div>
            <p className="mt-2 font-heading text-lg">Explorer's Club</p>
            <div className="mt-3 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <span key={n} className="h-2.5 w-2.5 rounded-full" style={{ background: n < 3 ? ORANGE : "rgba(255,255,255,0.2)" }} />
              ))}
            </div>
          </div>
          {/* message preview */}
          <div className="flex items-start gap-2 rounded-lg border border-ink/12 bg-white p-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0" style={{ color: ORANGE }} />
            <div>
              <p className="text-xs font-semibold text-ink">We saved your table 🌿</p>
              <p className="text-[11px] leading-snug text-ink/55">A little something for your next stay — welcome back.</p>
            </div>
          </div>
        </div>
      </Rise>
    </div>
  );
}

/* ---------- Uploads browser (dashboard-driven archive) ---------- */

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function UploadsBrowser() {
  const { content } = useSiteContent();
  const media = (useMedia().data ?? []).filter((m) => m.brand !== "site-assets");
  const [cat, setCat] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);
  const catMedia = cat ? media.filter((m) => m.category === cat) : [];
  const brands = Array.from(new Set(catMedia.map((m) => m.brand)));
  const brandMedia = brand ? catMedia.filter((m) => m.brand === brand) : [];

  return (
    <div className="mt-24 border-t border-ink/10 pt-12" data-testid="work-archive">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>The archive</Kicker>
          <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">Browse all uploads.</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50" data-testid="work-breadcrumb">
          <button onClick={() => { setCat(null); setBrand(null); }} className={!cat ? "text-ink" : "hover:text-terracotta"} data-testid="work-crumb-all">All work</button>
          {cat && (<><span>/</span><button onClick={() => setBrand(null)} className={!brand ? "text-ink" : "hover:text-terracotta"} data-testid="work-crumb-cat">{cat}</button></>)}
          {brand && (<><span>/</span><span className="text-ink">{brand}</span></>)}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!cat && (
          <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {content.categories.map((c) => {
              const n = media.filter((m) => m.category === c).length;
              return (
                <button key={c} onClick={() => setCat(c)} className="group rounded-md border border-ink/12 bg-white p-5 text-left transition-colors hover:border-terracotta" data-testid={`cat-${slug(c)}`}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-heading text-xl font-medium tracking-tight">{c}</p>
                    <ArrowUpRight className="h-5 w-5 text-terracotta opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{n > 0 ? `${n} ${n === 1 ? "piece" : "pieces"}` : "Add via dashboard"}</p>
                </button>
              );
            })}
          </motion.div>
        )}
        {cat && !brand && (
          <motion.div key="brands" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="brand-list">
              {brands.map((b) => {
                const n = catMedia.filter((m) => m.brand === b).length;
                return (
                  <button key={b} onClick={() => setBrand(b)} className="group rounded-md border border-ink/12 bg-white p-5 text-left transition-colors hover:border-terracotta" data-testid={`brand-${slug(b)}`}>
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-heading text-xl font-medium tracking-tight">{b}</p>
                      <ArrowUpRight className="h-5 w-5 text-terracotta opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">{n} {n === 1 ? "piece" : "pieces"}</p>
                  </button>
                );
              })}
            </div>
            {brands.length === 0 && (
              <p className="rounded-md border border-dashed border-ink/15 p-10 text-center text-sm text-ink/50" data-testid="brand-empty">Nothing here yet — add {cat} work from the dashboard.</p>
            )}
          </motion.div>
        )}
        {cat && brand && (
          <motion.div key="media" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <button onClick={() => setBrand(null)} className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-terracotta" data-testid="work-back-brands">
              <ArrowLeft className="h-4 w-4" /> All {cat} brands
            </button>
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {brandMedia.map((m: MediaItem, i) => (
                <motion.figure key={m.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }} data-testid={`work-media-${m.id}`}>
                  <div className="img-frame group aspect-[4/3] rounded-sm">
                    {m.kind === "video" ? (
                      <video src={m.url} controls preload="metadata" className="h-full w-full object-cover" />
                    ) : (
                      <img src={m.url} alt={m.caption || m.brand} loading="lazy" className="h-full w-full object-cover group-hover:scale-105" />
                    )}
                  </div>
                  {m.caption && <figcaption className="mt-3 text-sm text-ink/60">{m.caption}</figcaption>}
                </motion.figure>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Section ---------- */

export function MarketingGallery() {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: railRef, offset: ["start 75%", "end 60%"] });

  return (
    <section id="gallery" className="grain relative overflow-hidden bg-[#F7F2E8] py-24 text-ink sm:py-32" data-testid="work-gallery">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        {/* header */}
        <div className="max-w-3xl">
          <Rise>
            <Kicker>Marketing work</Kicker>
            <h2 className="mt-4 font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl" data-testid="gallery-heading">
              Marketing<br />Work
            </h2>
            <p className="mt-5 font-heading text-xl italic text-ink/80 sm:text-2xl">Turning ideas into stories, experiences and growth.</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/60">From creating the content to building the digital system behind it.</p>
          </Rise>
        </div>

        {/* ecosystem spine + movements */}
        <div ref={railRef} className="relative mt-20">
          <div className="absolute left-4 top-0 h-full w-px bg-ink/10 sm:left-8" />
          <motion.div className="absolute left-4 top-0 h-full w-px origin-top sm:left-8" style={{ background: ORANGE, scaleY: scrollYProgress }} />

          <div className="space-y-20 sm:space-y-28">
            <Movement num="01" kicker="Photography" title="Photoshoot" testId="mw-photoshoot"><Photoshoot /></Movement>
            <Movement num="02" kicker="Content system" title="Social media content" testId="mw-social"><SocialContent /></Movement>
            <Movement num="03" kicker="On the ground" title="Events" testId="mw-events"><Events /></Movement>
            <Movement num="04" kicker="Reach" title="Influencer collaborations" testId="mw-influencers"><Influencers /></Movement>
            <Movement num="05" kicker="Discovery" title="Listing directory" testId="mw-listing"><Listing /></Movement>
            <Movement num="06" kicker="Owned platform" title="Website" testId="mw-website"><Website /></Movement>
            <Movement num="07" kicker="Relationships" title="CRM" testId="mw-crm"><CRM /></Movement>
            <Movement num="08" kicker="Storytelling" title="Blog" testId="mw-blog"><Blog /></Movement>
            <Movement num="09" kicker="Creator-led" title="Personal travel content" testId="mw-personal"><Personal /></Movement>
            <Movement num="10" kicker="The long game" title="Retention / Loyalty" testId="mw-retention"><Retention /></Movement>
          </div>
        </div>

        {/* ecosystem paths */}
        <Rise className="mt-20">
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
            <span className="flex flex-wrap items-center gap-2">
              {["Content", "Social", "Influencers", "Traffic", "Website", "CRM", "Retention"].map((s, i, a) => (
                <span key={s} className="flex items-center gap-2">{s}{i < a.length - 1 && <span style={{ color: ORANGE }}>→</span>}</span>
              ))}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">
            <span className="flex flex-wrap items-center gap-2">
              {["Photoshoot", "Content", "Blog", "SEO", "Discovery"].map((s, i, a) => (
                <span key={s} className="flex items-center gap-2">{s}{i < a.length - 1 && <span style={{ color: ORANGE }}>→</span>}</span>
              ))}
            </span>
          </div>
        </Rise>

        {/* bottom statement */}
        <Rise className="mt-16 border-t border-ink/10 pt-12">
          <h3 className="font-heading text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
            Creative <span style={{ color: ORANGE }}>+</span> Digital <span style={{ color: ORANGE }}>+</span> Travel
          </h3>
          <p className="mt-4 max-w-xl font-heading text-lg italic text-ink/70 sm:text-xl">
            Building the story, the system and the experience behind the brand.
          </p>
        </Rise>

        <UploadsBrowser />
      </div>
    </section>
  );
}
