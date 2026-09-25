import { motion } from "motion/react";
import { ArrowDown, Play } from "lucide-react";
import { EASE } from "@/lib/anim";
import { CountUp, ORANGE, fadeUp, staggerParent } from "./shared";

/* Chapter 01 — desk / digital marketing (typographic browser card) */
export function DeskVisual() {
  const rows = ["social media management", "search engine optimization", "online advertising", "brand building"];
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="rounded-md border border-ink/10 bg-white shadow-xl"
      data-testid="desk-visual"
    >
      <div className="flex items-center gap-1.5 border-b border-ink/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-ink/15" />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: ORANGE }} />
        <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">freelance — 2020</span>
      </div>
      <div className="space-y-3 p-5">
        {rows.map((r, i) => (
          <motion.p key={r} variants={fadeUp} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/70">
            <span className="font-bold" style={{ color: ORANGE }}>0{i + 1}</span> {r}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

/* Chapter 02 — e-commerce process */
const ECOM_STEPS = ["Brand Setup", "Product Listing", "Search Optimization", "Ads", "Orders", "Fulfillment", "Performance"];

export function EcomVisual() {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="rounded-md border border-ink/10 bg-white p-5 shadow-xl"
      data-testid="ecom-process"
    >
      <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">The process</p>
      <div className="mt-3 flex flex-wrap items-center gap-y-2">
        {ECOM_STEPS.map((s, i) => (
          <motion.span key={s} variants={fadeUp} className="flex items-center">
            <span className="rounded-full border border-ink/15 bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink/80">
              {s}
            </span>
            {i < ECOM_STEPS.length - 1 && (
              <span className="mx-1 text-[11px] font-bold" style={{ color: ORANGE }} aria-hidden="true">
                →
              </span>
            )}
          </motion.span>
        ))}
      </div>
      <div className="mt-4 border-t border-dashed border-ink/15 pt-3">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Amazon · Flipkart · IndiaMART
        </p>
      </div>
    </motion.div>
  );
}

/* Chapter 03 — simplified India map with ranking pins */
const INDIA_PATH =
  "M150,18 L172,28 L180,50 L205,48 L215,70 L250,78 L285,95 L305,92 L320,78 L345,95 L352,118 L330,128 L318,148 L300,140 L285,160 L262,168 L250,195 L238,230 L222,268 L205,310 L188,352 L176,388 L166,350 L152,305 L138,272 L118,250 L92,238 L66,214 L48,186 L38,156 L55,140 L62,112 L82,95 L98,72 L118,45 L134,28 Z";

const PINS: Array<[number, number, string]> = [
  [160, 105, "Delhi"], [130, 125, "Jaipur"], [200, 120, "Lucknow"], [100, 160, "Ahmedabad"],
  [105, 235, "Mumbai"], [120, 250, "Pune"], [160, 240, "Hyderabad"], [110, 275, "Goa"],
  [155, 300, "Bengaluru"], [185, 295, "Chennai"], [145, 330, "Kochi"], [275, 165, "Kolkata"],
  [165, 185, "Nagpur"],
];

export function IndiaMapVisual() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="mx-auto max-w-xs rounded-md border border-ink/10 bg-white p-4 shadow-xl"
      data-testid="india-map-visual"
    >
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">Search visibility</p>
        <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
          Simplified map
        </p>
      </div>
      <svg viewBox="0 0 360 400" className="mx-auto mt-3 max-h-56 w-full" role="img" aria-label="Simplified map of India with ranked city pins">
        <path d={INDIA_PATH} fill="#F1EAD9" stroke="#141413" strokeOpacity={0.25} strokeWidth={2} strokeLinejoin="round" />
        {PINS.map(([x, y, name], i) => (
          <motion.g
            key={name}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.4 + i * 0.13, duration: 0.45, ease: EASE }}
            style={{ transformOrigin: `${x}px ${y}px` }}
          >
            <circle cx={x} cy={y} r={9} fill={ORANGE} opacity={0.25} />
            <circle cx={x} cy={y} r={4.5} fill={ORANGE} />
            <circle cx={x} cy={y} r={1.6} fill="#fff" />
          </motion.g>
        ))}
      </svg>
      <p className="mt-3 border-t border-ink/10 pt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
        Location keywords ranked across India
      </p>
    </motion.div>
  );
}

/* Chapter 04 — social media card (typographic, no photos) */
export function SocialVisual() {
  const rows = ["Destination reels", "Travel guides", "Local stories", "Hidden places"];
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="absolute -left-6 top-10 h-44 w-44 rounded-full" style={{ background: ORANGE, opacity: 0.18 }} aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative z-10 rounded-[1.8rem] border-4 border-ink bg-night p-5 text-white shadow-2xl"
        data-testid="social-card"
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs font-semibold tracking-[0.1em]">@nagpurtaveler</p>
          <span className="rounded-full px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.15em]" style={{ background: ORANGE, color: "#141413" }}>
            Travel
          </span>
        </div>
        <p className="mt-4 flex items-baseline gap-2">
          <CountUp to={10} suffix="K+" className="text-4xl font-bold tracking-tight" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/50">Followers</span>
        </p>
        <motion.ul variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 space-y-2">
          {rows.map((r) => (
            <motion.li key={r} variants={fadeUp} className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3.5 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/75">{r}</span>
              <Play className="h-3 w-3 fill-white/60 text-white/60" />
            </motion.li>
          ))}
        </motion.ul>
        <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
          Reels · Guides · Local stories
        </p>
      </motion.div>
    </div>
  );
}

/* Chapter 05 — academic / travel visual (ticket card, no photo) */
export function MbaVisual() {
  return (
    <div className="flex justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 30, rotate: 2 }}
        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
        className="w-72 rounded-md border border-ink/10 bg-white p-6 shadow-xl"
        data-testid="iittm-ticket"
      >
        <p className="font-mono text-[9px] uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
          Admission · Travel &amp; Tourism
        </p>
        <p className="mt-2 font-heading text-3xl font-medium tracking-tight">IITTM</p>
        <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
          Indian Institute of Travel and Tourism Management
        </p>
        <div className="my-4 border-t border-dashed border-ink/20" />
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-ink/70">
          <span>MBA · T&amp;T Mgmt</span>
          <span>2023–2026</span>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} className="h-6 w-[3px] bg-ink/80" style={{ opacity: i % 3 === 0 ? 1 : 0.35 }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* Chapter 06 — event poster collage */
export function EventsVisual() {
  return (
    <div className="relative flex items-end justify-center pb-12 pt-4">
      <motion.div
        initial={{ opacity: 0, x: -40, rotate: -12 }}
        whileInView={{ opacity: 1, x: 0, rotate: -6 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease: EASE }}
        className="z-0 -mr-8 flex h-56 w-40 flex-col justify-between rounded-md p-4 shadow-xl sm:h-64 sm:w-44"
        style={{ background: ORANGE }}
        data-testid="event-poster-comedy"
      >
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-ink/70">UrbanHook Events</p>
        <div>
          <p className="font-heading text-3xl font-medium leading-none text-ink">STAND-UP</p>
          <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-ink/80">Comedy night · Live</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: 8 }}
        whileInView={{ opacity: 1, y: 0, rotate: 4 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        className="z-10 flex h-56 w-40 flex-col justify-between rounded-md bg-night p-4 text-paper shadow-2xl sm:h-64 sm:w-44"
        data-testid="event-poster-music"
      >
        <p className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-white/50">UrbanHook Events</p>
        <div>
          <p className="font-heading text-3xl font-medium leading-none">JAM</p>
          <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
            Music sessions · Live
          </p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
        className="absolute -bottom-2 left-1/2 z-20 w-64 -translate-x-1/2 rounded-sm border border-ink/15 bg-white px-4 py-2.5 shadow-lg"
      >
        <p className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-ink/70">
          <span>Admit one</span>
          <span style={{ color: ORANGE }}>UrbanHook</span>
        </p>
      </motion.div>
    </div>
  );
}

/* Chapter 07 — hospitality experience cards (light, compact) */
export function HospitalityCard({
  org,
  role,
  locations,
  tags,
  details,
  metric,
  from,
  testId,
}: {
  org: string;
  role: string;
  locations?: string;
  tags: string[];
  details: string[];
  metric?: React.ReactNode;
  from: number;
  testId: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: from }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: EASE }}
      className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm sm:p-7"
      data-testid={testId}
    >
      <h4 className="font-heading text-2xl font-medium tracking-tight">{org}</h4>
      <p className="mt-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ORANGE }}>
        {role}
      </p>
      {locations && (
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{locations}</p>
      )}
      {metric}
      <motion.div variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span key={t} className="rounded-full border border-ink/10 bg-ink/[0.04] px-3 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/70">
            {t}
          </span>
        ))}
      </motion.div>
      <motion.ul variants={staggerParent} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} className="mt-5 space-y-2 border-t border-ink/10 pt-4">
        {details.map((d) => (
          <motion.li key={d} variants={fadeUp} className="flex items-start gap-3 text-[13px] leading-relaxed text-ink/65">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full" style={{ background: ORANGE }} />
            {d}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

/* Chapter 08 — Triplin system diagram */
const TRIPLIN_FLOW = ["Travel Website", "Travel CRM", "Vendor Network", "Packages & Itineraries", "Content + Marketing", "Travelers"];

export function TriplinDiagram() {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mx-auto flex max-w-md flex-col items-center"
      data-testid="triplin-diagram"
    >
      {TRIPLIN_FLOW.map((s, i) => (
        <div key={s} className="flex flex-col items-center">
          <motion.div
            variants={fadeUp}
            className={`rounded-full px-7 py-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] shadow-lg ${
              i === TRIPLIN_FLOW.length - 1 ? "text-ink" : "bg-[#141414] text-[#F7F2E8]"
            }`}
            style={i === TRIPLIN_FLOW.length - 1 ? { background: ORANGE } : undefined}
          >
            {s}
          </motion.div>
          {i < TRIPLIN_FLOW.length - 1 && (
            <motion.span variants={fadeUp} className="my-1 text-[#141414]" aria-hidden="true">
              <ArrowDown className="h-5 w-5" />
            </motion.span>
          )}
        </div>
      ))}
    </motion.div>
  );
}
