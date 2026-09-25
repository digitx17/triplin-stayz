import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Heart, Play, Search, Star } from "lucide-react";
import { EASE } from "@/lib/anim";
import { ORANGE } from "./story/shared";
import { PHOTOSHOOT, INFLUENCERS, IMAGES } from "@/lib/marketingData";
import { ProjectMediaModal } from "./ProjectMediaModal";

/* helpers */
function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.7, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

function Hand({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`font-hand leading-[1.05] ${className}`} style={{ color: "#1a1a1a" }}>{children}</span>;
}

function Pills({ items, twoCol = false }: { items: string[]; twoCol?: boolean }) {
  return (
    <div className={twoCol ? "mt-4 grid grid-cols-2 gap-2" : "mt-4 flex flex-wrap gap-2"}>
      {items.map((t) => (
        <span key={t} className="w-fit rounded-full border border-ink/15 bg-white/70 px-3 py-1 text-[11px] text-ink/70">{t}</span>
      ))}
    </div>
  );
}

function Poly({ src, className = "", rotate = "" }: { src: string; className?: string; rotate?: string }) {
  return (
    <figure className={`bg-white p-1.5 pb-3 shadow-md ${rotate} ${className}`}>
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
    </figure>
  );
}

function DarkCard({ lines, rotate = "" }: { lines: string[]; rotate?: string }) {
  return (
    <div className={`bg-ink px-4 py-4 text-center shadow-lg ${rotate}`}>
      {lines.map((l) => (
        <p key={l} className="font-heading text-sm font-semibold uppercase leading-tight text-paper">{l}</p>
      ))}
    </div>
  );
}

/* per-category visuals */
function Visual({ kind }: { kind: string }) {
  switch (kind) {
    case "photoshoot":
      return (
        <div className="relative h-48">
          <Poly src={PHOTOSHOOT[1].src} rotate="-rotate-3" className="absolute left-0 top-0 h-36 w-32" />
          <Poly src={PHOTOSHOOT[2].src} rotate="rotate-2" className="absolute right-0 top-6 h-32 w-28" />
          <Poly src={PHOTOSHOOT[3].src} rotate="rotate-1" className="absolute bottom-0 left-8 h-20 w-24" />
        </div>
      );
    case "social":
      return (
        <div className="relative h-52">
          <Poly src={IMAGES.personalThumb} rotate="rotate-2" className="absolute right-0 top-4 h-28 w-24" />
          <div className="absolute left-1 top-0 w-28 rounded-[1.3rem] border-4 border-ink bg-ink p-0.5 shadow-xl">
            <div className="relative overflow-hidden rounded-[0.9rem]">
              <img src={IMAGES.websitePhoto} alt="" loading="lazy" className="aspect-[9/16] w-full object-cover" />
              <span className="absolute inset-0 bg-black/15" />
              <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 text-white"><Heart className="h-2.5 w-2.5 fill-white" /><span className="font-mono text-[7px]">12.4K</span></span>
            </div>
          </div>
          <DarkCard lines={["Good", "Vibes", "Only"]} rotate="-rotate-3 absolute bottom-1 right-1 w-20" />
        </div>
      );
    case "events":
      return (
        <div className="relative h-48">
          <Poly src={IMAGES.eventPhoto} rotate="-rotate-2" className="absolute left-0 top-0 h-36 w-40" />
          <DarkCard lines={["Good Food", "Good People", "Good Vibes"]} rotate="rotate-2 absolute right-0 bottom-0 w-32" />
        </div>
      );
    case "influencer":
      return (
        <div className="relative h-48">
          <Poly src={INFLUENCERS[2].src} rotate="rotate-2" className="absolute right-0 top-0 h-36 w-28" />
          <Poly src={IMAGES.personalHero} rotate="-rotate-3" className="absolute left-0 bottom-0 h-28 w-28" />
        </div>
      );
    case "listing":
      return (
        <div className="relative h-48">
          <div className="absolute inset-x-0 top-2 rounded-md border border-ink/12 bg-white p-3 shadow-md">
            <div className="flex items-center gap-2">
              <img src={IMAGES.listingPhoto} alt="" loading="lazy" className="h-11 w-11 rounded object-cover" />
              <div>
                <p className="font-heading text-xs leading-none">Shalom Backpackers</p>
                <p className="mt-1 flex items-center gap-0.5 text-[9px] text-ink/50">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-2 w-2 fill-current" style={{ color: ORANGE }} />
                  ))}
                  4.8
                </p>
              </div>
            </div>
            <div className="mt-2.5 flex flex-wrap gap-1">
              {["Google", "Tripadvisor", "Zomato"].map((b) => (
                <span key={b} className="rounded border border-ink/12 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-ink/70">{b}</span>
              ))}
            </div>
            <div className="mt-2 space-y-1 border-t border-ink/8 pt-2">
              {["Reviews answered", "Photos updated"].map((s) => (
                <p key={s} className="flex items-center gap-1 text-[9px] text-ink/60"><span style={{ color: ORANGE }}>✓</span>{s}</p>
              ))}
            </div>
          </div>
        </div>
      );
    case "website":
      return (
        <div className="relative h-48">
          <svg viewBox="0 0 24 24" className="absolute right-1 top-0 h-6 w-6" fill="none" stroke={ORANGE} strokeWidth="1.4" aria-hidden>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
          </svg>
          <div className="absolute inset-x-0 top-6 overflow-hidden rounded-md border border-ink/15 bg-white shadow-lg">
            <div className="flex items-center gap-1 border-b border-ink/10 bg-[#f3ece0] px-2 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-ink/20" /><span className="h-1.5 w-1.5 rounded-full bg-ink/20" /><span className="h-1.5 w-1.5 rounded-full bg-ink/20" /></div>
            <div className="relative">
              <img src={IMAGES.websitePhoto} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              <span className="absolute inset-0 bg-black/30" />
              <span className="absolute bottom-2 left-2 font-heading text-base leading-none text-paper">Explore<br />More</span>
              <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-[7px] uppercase tracking-wider text-ink"><Search className="h-2 w-2" />Rishikesh</span>
            </div>
          </div>
        </div>
      );
    case "crm":
      return (
        <div className="relative flex h-44 items-center">
          <div className="w-full rounded-md border border-ink/12 bg-white p-2.5 shadow-md">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-ink/50">Leads</p>
            {[["New", 0.3], ["Contacted", 0.5], ["Confirmed", 0.7], ["Booked", 1]].map(([s, w]) => (
              <div key={s as string} className="mt-1.5 flex items-center gap-2">
                <span className="w-14 text-[9px] text-ink/60">{s as string}</span>
                <span className="h-1.5 flex-1 rounded-full bg-ink/8"><span className="block h-full rounded-full" style={{ width: `${(w as number) * 100}%`, background: ORANGE }} /></span>
              </div>
            ))}
          </div>
        </div>
      );
    case "blog":
      return (
        <div className="relative h-48">
          <div className="absolute left-0 top-0 w-36 overflow-hidden rounded-md border border-ink/12 bg-white shadow-md">
            <img src={IMAGES.blogPhoto} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
            <p className="px-2 py-1.5 font-heading text-[11px] leading-tight">Top 5 Places to Visit in Rishikesh</p>
            <p className="px-2 pb-2 font-mono text-[8px] uppercase tracking-wider" style={{ color: ORANGE }}>Read more →</p>
          </div>
          <div className="absolute bottom-0 right-0 rounded-md border border-ink/12 bg-white px-2.5 py-2 shadow-sm">
            {["Plan", "Explore", "Experience", "Repeat"].map((s) => (
              <p key={s} className="flex items-center gap-1 text-[9px] text-ink/70"><span style={{ color: ORANGE }}>✓</span>{s}</p>
            ))}
          </div>
        </div>
      );
    case "personal":
      return (
        <div className="relative h-44">
          <Poly src={INFLUENCERS[2].src} rotate="rotate-2" className="absolute right-0 top-0 h-32 w-24" />
          <div className="absolute left-0 bottom-0 w-20 rounded-[0.9rem] border-4 border-ink bg-ink p-0.5 shadow-lg">
            <div className="relative overflow-hidden rounded-[0.6rem]"><img src={IMAGES.blogPhoto} alt="" loading="lazy" className="aspect-[9/16] w-full object-cover" /><Play className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 fill-white text-white" /></div>
          </div>
        </div>
      );
    case "retention":
      return (
        <div className="relative flex h-44 items-center justify-center">
          <DarkCard lines={["Good", "Vibes", "Keep", "Coming"]} rotate="rotate-2 w-24" />
        </div>
      );
    default:
      return null;
  }
}

interface Item {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  kind: string;
  category: string;
  anno: string;
  annoClass: string;
}

const ITEMS: Item[] = [
  { num: "01", title: "Photoshoot", desc: "Capturing real moments, places and people that bring brands to life.", tags: ["Product Shoots", "Property Shoots", "Food & Beverage", "Lifestyle"], kind: "photoshoot", category: "Photoshoot", anno: "Real people.\nReal places.\nReal stories.", annoClass: "-right-1 -bottom-10 text-base text-right" },
  { num: "02", title: "Social Media Content", desc: "Scroll-stopping content for Instagram, Facebook and other platforms.", tags: ["Reels", "Stories", "Content Calendar", "Captions", "Analytics"], kind: "social", category: "Graphic Design / Content", anno: "Plan\nCreate\nPost\nGrow", annoClass: "right-0 -top-3 text-base text-right" },
  { num: "03", title: "Events", desc: "From concept to execution — creating memorable experiences for brands and guests.", tags: ["Concept & Planning", "On-ground Execution", "Guest Experience", "Brand Activations"], kind: "events", category: "Events", anno: "Great vibes,\nreal connections.", annoClass: "right-0 -top-3 text-base text-right" },
  { num: "04", title: "Influencer Collaborations", desc: "Partnering with creators to bring authentic stories to life.", tags: ["Travel Creators", "Lifestyle Creators", "Barter Collabs", "Campaigns"], kind: "influencer", category: "Influencer Collab", anno: "Real people.\nReal reach.", annoClass: "left-0 -top-3 text-base" },
  { num: "05", title: "Listing Directory", desc: "Optimising your presence across Google, Zomato, TripAdvisor and more.", tags: ["Google Business", "Zomato", "TripAdvisor", "OTA Listings"], kind: "listing", category: "Listings", anno: "More visibility.\nMore bookings.", annoClass: "right-0 bottom-0 text-base text-right" },
  { num: "06", title: "Website", desc: "Clean, modern and conversion-focused websites for travel & hospitality brands.", tags: ["UI/UX Design", "Web Development", "SEO Friendly", "Landing Pages"], kind: "website", category: "Website & CRM", anno: "Looks good.\nWorks hard.", annoClass: "right-0 -top-3 text-base text-right" },
  { num: "07", title: "CRM", desc: "Managing leads, guest relationships and automation for better conversions and retention.", tags: ["Lead Management", "Guest Follow-ups", "Automations", "Analytics"], kind: "crm", category: "Website & CRM", anno: "Relationships.\nLonger Journeys.", annoClass: "right-0 -top-3 text-sm text-right" },
  { num: "08", title: "Blog", desc: "Informative, SEO-friendly blogs that inspire, educate and bring organic traffic.", tags: ["Travel Guides", "Destination Blogs", "Tips & Itineraries", "SEO Articles"], kind: "blog", category: "Graphic Design / Content", anno: "Plan\nExplore\nExperience\nRepeat", annoClass: "right-0 -top-3 text-sm text-right" },
  { num: "09", title: "Personal Travel Content", desc: "Documenting my own journeys, from unexplored destinations to meaningful moments.", tags: ["Travel Vlogs", "Itineraries", "Photography", "Storytelling"], kind: "personal", category: "Photoshoot", anno: "Same places.\nNew stories.", annoClass: "right-0 -top-3 text-sm text-right" },
  { num: "10", title: "Retention / Loyalty", desc: "Building communities and loyalty programs that turn guests into regulars.", tags: ["Email Campaigns", "WhatsApp", "Loyalty Programs", "Referral Programs"], kind: "retention", category: "Graphic Design / Content", anno: "", annoClass: "" },
];

function Block({ item, delay, compact = false, onView }: { item: Item; delay: number; compact?: boolean; onView: (it: Item) => void }) {
  return (
    <Rise delay={delay} className="relative h-full">
      <div data-testid={`mw-${item.kind}`} className="flex h-full gap-5">
        <div className="flex min-w-0 flex-1 flex-col">
          <div>
            <span aria-hidden className="font-heading text-5xl font-semibold leading-none text-ink/[0.14]">{item.num}</span>
            <span className="mt-1 block h-[3px] w-8" style={{ background: ORANGE }} />
            <h3 className={`mt-3 font-heading font-semibold uppercase leading-[1.05] tracking-tight ${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}>{item.title}</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-ink/60">{item.desc}</p>
            <Pills items={item.tags} twoCol={!compact} />
          </div>
          <div className="mt-auto pt-5">
            <button
              onClick={() => onView(item)}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/20 bg-white/70 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors duration-300 hover:border-ink hover:text-ink"
              data-testid={`mw-view-${item.kind}`}
            >
              View Project <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>
        </div>
        <div className={`relative shrink-0 ${compact ? "w-[42%]" : "w-[46%]"}`}>
          <Visual kind={item.kind} />
          {item.anno && (
            <Hand className={`pointer-events-none absolute whitespace-pre-line ${item.annoClass}`}>{item.anno}</Hand>
          )}
        </div>
      </div>
    </Rise>
  );
}

export function MarketingGallery() {
  const [viewing, setViewing] = useState<Item | null>(null);

  return (
    <section id="gallery" className="grain relative overflow-hidden bg-[#F7F2E8] py-24 text-ink sm:py-28" data-testid="work-gallery">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* header */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
          <div>
            <p className="inline-block border-b-2 pb-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: ORANGE, borderColor: ORANGE }}>Marketing Work</p>
            <h2 className="mt-4 font-heading text-5xl font-bold uppercase leading-[0.9] tracking-tight sm:text-7xl" data-testid="gallery-heading">Marketing Work</h2>
            <p className="mt-3 font-heading text-lg italic text-ink/80 sm:text-2xl">Turning ideas into experiences people remember.”</p>
          </div>
          <div className="relative lg:border-l lg:border-ink/15 lg:pl-8">
            <p className="max-w-sm text-sm leading-relaxed text-ink/70">I work across content, social media, hospitality marketing and brand storytelling — from the first idea to execution.</p>
            <div className="pointer-events-none relative mt-3 hidden h-20 sm:block" aria-hidden>
              <svg viewBox="0 0 240 70" className="h-16 w-64" fill="none" stroke="#1a1a1a" strokeWidth="1.2">
                <path d="M2 56 l18 -24 l12 15 l20 -32 l22 44 Z" fill="#1a1a1a" opacity="0.7" stroke="none" />
                <path d="M80 50 Q 160 50 226 16" stroke={ORANGE} strokeDasharray="4 4" strokeLinecap="round" />
              </svg>
              <svg viewBox="0 0 24 24" className="absolute right-2 top-0 h-5 w-5" fill="#1a1a1a"><path d="M2 16l20-7L2 2v5l14 2L2 11z" /></svg>
              <Hand className="absolute -right-2 -bottom-7 rotate-[7deg] text-lg text-right">Better Brands.<br />Bigger Journeys.</Hand>
            </div>
          </div>
        </div>

        {/* rows 01-06 */}
        <div className="mt-16 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {ITEMS.slice(0, 6).map((it, i) => <Block key={it.num} item={it} delay={(i % 3) * 0.05} onView={setViewing} />)}
        </div>

        {/* rows 07-10 */}
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.slice(6).map((it, i) => <Block key={it.num} item={it} delay={i * 0.05} compact onView={setViewing} />)}
        </div>

        {/* footer */}
        <div className="mt-20 flex items-center gap-6 border-t border-ink/10 pt-8">
          <svg viewBox="0 0 80 30" className="h-8 w-20" fill="#1a1a1a" opacity="0.6" aria-hidden><path d="M2 28 l18 -22 l12 14 l10 -10 l16 18 Z" /></svg>
          <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} />
          <span className="h-px flex-1 bg-ink/12" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/45">Travel&nbsp;&nbsp;/&nbsp;&nbsp;Content&nbsp;&nbsp;/&nbsp;&nbsp;Marketing</span>
        </div>
      </div>

      <ProjectMediaModal
        project={viewing ? { num: viewing.num, title: viewing.title, category: viewing.category } : null}
        onClose={() => setViewing(null)}
      />
    </section>
  );
}
