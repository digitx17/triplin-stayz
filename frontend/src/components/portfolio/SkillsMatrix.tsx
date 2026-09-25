import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView } from "motion/react";
import {
  CalendarDays,
  Camera,
  Clapperboard,
  Heart,
  Mail,
  MapPin,
  Megaphone,
  Monitor,
  Orbit,
  Palette,
  PenLine,
  Play,
  Search,
  Share2,
  ShoppingCart,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { EASE } from "@/lib/anim";
import { useMedia } from "@/lib/media";
import { IMAGES, INFLUENCERS, PHOTOSHOOT } from "@/lib/marketingData";

const ORANGE = "#E16428";

function Rise({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.7, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

function Hand({ children, className = "", color = ORANGE }: { children: ReactNode; className?: string; color?: string }) {
  return <span className={`font-hand leading-[1.1] ${className}`} style={{ color }}>{children}</span>;
}

function Poly({ src, className = "", rotate = "" }: { src: string; className?: string; rotate?: string }) {
  return (
    <figure className={`bg-white p-1 pb-2 shadow-md ${rotate} ${className}`}>
      <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
    </figure>
  );
}

/* default per-skill mock visuals (replaced by admin uploads) */
function DefaultVisual({ k }: { k: string }) {
  switch (k) {
    case "photoshoot":
      return (
        <div className="relative h-full min-h-[110px]">
          <Poly src={PHOTOSHOOT[3].src} rotate="rotate-6" className="absolute right-1 top-1 h-20 w-16" />
          <Poly src={PHOTOSHOOT[1].src} rotate="-rotate-6" className="absolute left-1 top-4 h-24 w-20" />
        </div>
      );
    case "cinematography":
      return (
        <div className="relative h-full min-h-[110px]">
          <img src={INFLUENCERS[1].src} alt="" loading="lazy" className="absolute inset-0 h-full w-full rounded-md object-cover" />
          <span className="absolute inset-0 rounded-md bg-black/20" />
          <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-black/35">
            <Play className="h-3.5 w-3.5 fill-white text-white" />
          </span>
        </div>
      );
    case "events":
      return (
        <div className="relative h-full min-h-[110px]">
          <img src={IMAGES.eventPhoto} alt="" loading="lazy" className="absolute inset-0 h-full w-full rounded-md object-cover" />
          <span className="absolute bottom-2 right-2 rounded-sm bg-ink px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.2em] text-paper">VIP</span>
        </div>
      );
    case "ota":
      return (
        <div className="relative flex h-full min-h-[110px] items-center">
          <div className="w-full rounded-md border border-ink/10 bg-white p-2.5 shadow-md">
            <div className="mb-2 flex items-center gap-1 border-b border-ink/8 pb-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-ink/15" /><span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
            </div>
            {[["Booking.com", "#003580"], ["Agoda", "#C15B2E"], ["Airbnb", "#FF5A5F"]].map(([n, c]) => (
              <p key={n} className="mt-1.5 flex items-center gap-1.5 rounded border border-ink/8 px-2 py-1 font-mono text-[8px] font-semibold text-ink/70">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{n}
              </p>
            ))}
          </div>
        </div>
      );
    case "localseo":
      return (
        <div className="relative flex h-full min-h-[110px] items-center">
          <div className="w-full rounded-md border border-ink/10 bg-white p-2.5 shadow-md">
            <p className="flex items-center gap-1.5 rounded border border-ink/8 px-2 py-1 font-mono text-[8px] text-ink/50"><Search className="h-2.5 w-2.5" />hostel near me</p>
            <div className="mt-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" style={{ color: ORANGE }} />
              <div>
                <p className="font-heading text-[10px] leading-none">Your Business</p>
                <p className="mt-0.5 flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-1.5 w-1.5 fill-current" style={{ color: ORANGE }} />)}</p>
              </div>
            </div>
          </div>
        </div>
      );
    case "ads":
      return (
        <div className="relative flex h-full min-h-[110px] items-center">
          <div className="w-full rounded-md border border-ink/10 bg-white p-2.5 shadow-md">
            {[["Meta", "#0866FF"], ["Google Ads", "#F9AB00"]].map(([n, c]) => (
              <p key={n} className="mt-1.5 flex items-center gap-1.5 rounded border border-ink/8 px-2 py-1 font-mono text-[8px] font-semibold text-ink/70 first:mt-0">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />{n}
              </p>
            ))}
            <p className="mt-2 flex items-center gap-1 text-[8px] text-ink/50"><Megaphone className="h-2.5 w-2.5" style={{ color: ORANGE }} />Campaign live</p>
          </div>
        </div>
      );
    case "ecommerce":
      return (
        <div className="relative h-full min-h-[110px]">
          <img src={IMAGES.websitePhoto} alt="" loading="lazy" className="absolute inset-0 h-full w-full rounded-md object-cover" />
          <span className="absolute inset-0 rounded-md bg-black/15" />
          <span className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md">
            <ShoppingCart className="h-3.5 w-3.5 text-ink" />
          </span>
        </div>
      );
    case "writing":
      return (
        <div className="relative flex h-full min-h-[110px] items-center justify-center">
          <div className="w-[85%] -rotate-2 rounded-sm border border-ink/10 bg-[#FBF6EA] px-3 py-4 text-center shadow-md">
            <Hand className="text-sm" color="#1a1a1a">Better Content<br />Bigger Impact</Hand>
            <span className="mx-auto mt-2 block h-px w-10 bg-ink/20" />
            <PenLine className="mx-auto mt-1.5 h-3 w-3 text-ink/40" />
          </div>
        </div>
      );
    case "social":
      return (
        <div className="relative flex h-full min-h-[110px] items-center justify-center">
          <div className="w-16 rounded-[0.9rem] border-[3px] border-ink bg-ink p-0.5 shadow-lg">
            <div className="grid grid-cols-2 gap-0.5 overflow-hidden rounded-[0.6rem]">
              {[PHOTOSHOOT[0].src, PHOTOSHOOT[1].src, PHOTOSHOOT[2].src, PHOTOSHOOT[3].src].map((s) => (
                <img key={s} src={s} alt="" loading="lazy" className="aspect-square w-full object-cover" />
              ))}
            </div>
          </div>
          <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white px-1.5 py-0.5 shadow-md">
            <Heart className="h-2.5 w-2.5 fill-current" style={{ color: ORANGE }} /><span className="font-mono text-[7px] text-ink/70">12.4K</span>
          </span>
        </div>
      );
    case "email":
      return (
        <div className="relative flex h-full min-h-[110px] items-center">
          <div className="w-full rounded-md border border-ink/10 bg-white p-2.5 shadow-md">
            <p className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-ink/50"><Mail className="h-2.5 w-2.5" style={{ color: ORANGE }} />Newsletter</p>
            <p className="mt-1.5 font-heading text-[11px] leading-tight">Special offers, just for you!</p>
            <span className="mt-2 inline-block rounded-full bg-ink px-2.5 py-1 font-mono text-[7px] uppercase tracking-wider text-paper">Shop Now</span>
          </div>
        </div>
      );
    case "virtualtour":
      return (
        <div className="relative h-full min-h-[110px]">
          <img src={PHOTOSHOOT[1].src} alt="" loading="lazy" className="absolute inset-0 h-full w-full rounded-md object-cover" />
          <span className="absolute inset-0 rounded-md bg-black/20" />
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-dashed border-white/80 bg-black/25">
            <span className="font-mono text-[9px] font-bold text-white">360°</span>
          </span>
        </div>
      );
    case "design":
      return (
        <div className="relative flex h-full min-h-[110px] items-center">
          <div className="w-full -rotate-1 rounded-md border border-ink/10 bg-white p-2.5 shadow-md">
            <p className="font-heading text-sm font-bold uppercase tracking-wide">Travel<br />More</p>
            <div className="mt-2 flex gap-1">
              {["#E16428", "#2E5E4E", "#E9C46A", "#1a1a1a", "#B23A48"].map((c) => (
                <span key={c} className="h-3.5 w-3.5 rounded-sm" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

interface Skill {
  num: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  key: string;
}

const SKILLS: Skill[] = [
  { num: "01", title: "Photoshoot", desc: "Professional photography for brands, products and destinations.", icon: Camera, key: "photoshoot" },
  { num: "02", title: "Cinematography", desc: "Video storytelling for brands, reels and campaigns.", icon: Clapperboard, key: "cinematography" },
  { num: "03", title: "Event Marketing", desc: "Planning and promoting events that build brand awareness and create real connections.", icon: CalendarDays, key: "events" },
  { num: "04", title: "OTA Management", desc: "Listing, optimization and performance management across OTAs (Booking.com, Agoda, Airbnb, etc).", icon: Monitor, key: "ota" },
  { num: "05", title: "Local SEO", desc: "Improve local visibility and attract high-intent travelers.", icon: MapPin, key: "localseo" },
  { num: "06", title: "Google & Meta Ads", desc: "Targeted campaigns that reach the right audience and drive conversions.", icon: Megaphone, key: "ads" },
  { num: "07", title: "Ecommerce", desc: "Set up and manage online stores for seamless shopping experiences.", icon: ShoppingCart, key: "ecommerce" },
  { num: "08", title: "Content Writing", desc: "SEO-friendly and engaging content that informs, inspires and converts.", icon: PenLine, key: "writing" },
  { num: "09", title: "Social Media Marketing", desc: "Build communities, grow reach and turn followers into customers.", icon: Share2, key: "social" },
  { num: "10", title: "Email / SMS Marketing", desc: "Personalized campaigns that bring back customers and increase loyalty.", icon: Mail, key: "email" },
  { num: "11", title: "Virtual Tour", desc: "Immersive 360° experiences that bring destinations to life.", icon: Orbit, key: "virtualtour" },
  { num: "12", title: "Graphic Design", desc: "Eye-catching visuals for stronger brand presence and engagement.", icon: Palette, key: "design" },
];

const SLUGS: Record<string, string> = Object.fromEntries(SKILLS.map((s) => [s.title, s.key]));

function CenterBadge() {
  return (
    <div className="relative mx-auto flex h-60 w-60 items-center justify-center lg:h-72 lg:w-72" data-testid="skills-center-badge">
      <div className="absolute inset-0 rounded-full border border-ink/10 bg-white/60" />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="46" stroke={ORANGE} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.7" />
        {[0, 90, 180, 270].map((deg) => (
          <circle key={deg} cx={50 + 46 * Math.cos((deg * Math.PI) / 180)} cy={50 + 46 * Math.sin((deg * Math.PI) / 180)} r="1.6" fill={ORANGE} />
        ))}
      </svg>
      <div className="relative text-center">
        <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-ink/50">Digital Marketing</p>
        <p className="mt-2 font-heading text-5xl font-bold uppercase tracking-tight lg:text-6xl">Skills</p>
        <span className="mx-auto mt-3 block h-[3px] w-14" style={{ background: ORANGE }} />
        <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.3em] text-ink/45">Create&nbsp;/&nbsp;Connect&nbsp;/&nbsp;Convert</p>
      </div>
    </div>
  );
}

export function SkillsMatrix() {
  const media = useMedia();

  const customImages = useMemo(() => {
    const map = new Map<string, string>();
    for (const m of media.data ?? []) {
      if (m.category === "Skill Cards" && m.kind === "image" && !map.has(m.brand)) {
        map.set(m.brand, m.url);
      }
    }
    return map;
  }, [media.data]);

  const card = (s: Skill, i: number, span = "") => {
    const custom = customImages.get(s.title);
    return (
      <Rise key={s.num} delay={(i % 3) * 0.06} className={span}>
        <article
          className="flex h-full gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md"
          data-testid={`skill-card-${s.key}`}
        >
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3EDE0]">
                <s.icon className="h-4 w-4 text-ink/70" />
              </span>
              <span aria-hidden className="font-heading text-3xl font-semibold text-ink/15">{s.num}</span>
            </div>
            <h3 className="mt-3 font-heading text-xl font-medium tracking-tight">{s.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-ink/60">{s.desc}</p>
          </div>
          <div className="relative w-[42%] shrink-0" data-testid={`skill-image-${s.key}`}>
            {custom ? (
              <figure className="h-full w-full rotate-2 rounded-md bg-white p-1 pb-2 shadow-md">
                <img src={custom} alt={s.title} loading="lazy" className="h-full min-h-[110px] w-full rounded-sm object-cover" />
              </figure>
            ) : (
              <DefaultVisual k={s.key} />
            )}
          </div>
        </article>
      </Rise>
    );
  };

  return (
    <section id="skills" className="grain relative overflow-hidden bg-[#FDFBF6] py-24 text-ink sm:py-28" data-testid="skills-section">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* header */}
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-terracotta px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white">Section 05</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-ink/60">Skills &amp; Expertise</span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.35em] text-ink/70">My Digital Marketing</p>
            <h2 className="mt-1 font-heading text-6xl font-bold tracking-tight sm:text-7xl" data-testid="skills-heading">Skill Set</h2>
            <svg viewBox="0 0 160 10" className="mt-2 h-3 w-40" fill="none" aria-hidden>
              <path d="M2 7 Q 80 1 158 6" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink/70 lg:border-l lg:border-ink/15 lg:pl-6">
            A complete toolkit to create visibility, build brands, engage audiences and drive real business
            results — across every digital channel.
          </p>
          <div className="hidden text-right lg:block">
            <Hand className="rotate-2 text-xl">Strategy +<br />Creativity +<br />Technology =<br />Impact</Hand>
            <svg viewBox="0 0 120 10" className="ml-auto mt-1 h-2.5 w-28" fill="none" aria-hidden>
              <path d="M2 7 Q 60 1 118 6" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* grid — 12 cards around the center badge */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SKILLS.slice(0, 3).map((s, i) => card(s, i))}
          {card(SKILLS[3], 3)}
          <Rise className="flex items-center justify-center py-4 sm:col-span-2 lg:col-span-1">
            <CenterBadge />
          </Rise>
          {card(SKILLS[4], 4)}
          {SKILLS.slice(5, 8).map((s, i) => card(s, i + 5))}
          {SKILLS.slice(8, 11).map((s, i) => card(s, i + 8))}
          {card(SKILLS[11], 11, "lg:col-span-2")}
          <Rise className="hidden items-center justify-end lg:flex">
            <div className="pr-6 text-right lg:border-l lg:border-ink/15 lg:pl-8">
              <Hand className="text-2xl" color="#1a1a1a">Different skills.<br />One goal.</Hand>
              <svg viewBox="0 0 120 10" className="ml-auto mt-1 h-2.5 w-28" fill="none" aria-hidden>
                <path d="M2 7 Q 60 1 118 6" stroke={ORANGE} strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </Rise>
        </div>

        <p className="mt-10 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-ink/40">
          Card photos can be changed anytime from the admin dashboard — category “Skill Cards”
        </p>
      </div>
    </section>
  );
}
