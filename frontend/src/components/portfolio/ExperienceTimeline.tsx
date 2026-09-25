import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Plane } from "lucide-react";
import { EASE } from "@/lib/anim";
import { MaskedLine } from "./Reveal";
import { ORANGE, WordReveal } from "./story/shared";
import { useSiteContent } from "@/lib/content";

interface Experience {
  num: string;
  date: string;
  org: string;
  role: string;
  location: string;
  description: string;
  tags: string[];
  contributions: string[];
  note: string;
  noteAlign: "start" | "end";
  tilt: string;
  imgClass: string;
  image: string;
  imageAlt: string;
  testId: string;
}

function OutlineTag({ children, dark = false }: { children: string; dark?: boolean }) {
  return (
    <span
      className={
        dark
          ? "rounded-full bg-ink px-3.5 py-1.5 font-sans text-[13px] text-paper"
          : "rounded-full border border-ink/25 px-3.5 py-1.5 font-sans text-[13px] text-ink/75"
      }
    >
      {children}
    </span>
  );
}

function Polaroid({ exp }: { exp: Experience }) {
  return (
    <div className={`flex flex-col ${exp.noteAlign === "end" ? "items-end" : "items-start"}`}>
      <div className={`relative bg-white p-2.5 pb-5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.35)] ${exp.tilt}`}>
        {/* washi tape */}
        <span
          aria-hidden="true"
          className="absolute -top-3 left-1/2 h-6 w-20 -translate-x-1/2 -rotate-[5deg] bg-[#e6dcc4]/70 shadow-sm"
        />
        <div className={`overflow-hidden rounded-[1px] ${exp.imgClass}`}>
          <img src={exp.image} alt={exp.imageAlt} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className={`mt-4 flex items-end gap-1 ${exp.noteAlign === "end" ? "flex-row-reverse" : ""}`}>
        <span className="font-hand text-[26px] leading-[1.05]" style={{ color: ORANGE }}>
          {exp.note.split("\n").map((l, i) => (
            <span key={i} className="block">
              {l}
            </span>
          ))}
        </span>
        <svg
          viewBox="0 0 40 40"
          className={`h-7 w-7 -translate-y-2 ${exp.noteAlign === "end" ? "-scale-x-100" : ""}`}
          fill="none"
          stroke={ORANGE}
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M4 34 Q 22 34 32 10" strokeLinecap="round" />
          <path d="M24 11 L33 7 L34 17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function ExpColumn({ exp }: { exp: Experience }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="grid grid-cols-[52px_minmax(0,1fr)] gap-x-3 sm:grid-cols-[96px_minmax(0,1fr)] sm:gap-x-5"
      data-testid={exp.testId}
    >
      {/* number + rail gutter */}
      <div className="flex flex-col items-center">
        <span className="select-none font-heading text-[48px] font-semibold leading-none text-ink/[0.14] sm:text-[90px]">
          {exp.num}
        </span>
        <span className="mt-4 h-2 w-2 shrink-0 rounded-full" style={{ background: ORANGE }} />
        <span className="my-1.5 w-px flex-1" style={{ background: ORANGE, opacity: 0.55 }} />
        <span className="mb-1 h-2 w-2 shrink-0 rounded-full" style={{ background: ORANGE }} />
      </div>

      {/* content */}
      <div>
        <div className="mb-6 flex justify-center lg:mb-2 lg:ml-8 lg:block lg:float-right">
          <Polaroid exp={exp} />
        </div>

        <div className="flex items-center gap-2.5 pt-2">
          <span className="h-[2px] w-6 shrink-0" style={{ background: ORANGE }} />
          <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
            {exp.date}
          </span>
        </div>
        <h3
          className="mt-3 font-heading text-3xl font-semibold leading-[1.08] tracking-tight break-words sm:text-[2.25rem]"
          data-testid={`${exp.testId}-title`}
        >
          {exp.org}
        </h3>
        <p className="mt-3 text-lg text-ink/85">{exp.role}</p>
        <p className="mt-3 flex items-center gap-1.5 text-[13px] text-ink/60">
          <MapPin className="h-4 w-4 shrink-0" style={{ color: ORANGE }} />
          {exp.location}
        </p>
        <p className="mt-5 text-[15px] leading-relaxed text-ink/70">{exp.description}</p>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {exp.tags.map((t, i) => (
            <OutlineTag key={t} dark={i % 2 === 1}>
              {t}
            </OutlineTag>
          ))}
        </div>

        <div className="clear-both" />

        <div className="mt-9">
          <div className="flex items-center gap-2.5">
            <span className="h-[2px] w-6" style={{ background: ORANGE }} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/60">
              Key contributions
            </span>
          </div>
          <ul className="mt-4 grid gap-x-10 gap-y-2.5 sm:grid-cols-2">
            {exp.contributions.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[15px] leading-relaxed text-ink/75">
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.article>
  );
}

export function ExperienceTimeline() {
  const { content } = useSiteContent();

  const EXPERIENCES: Experience[] = [
    {
      num: "01",
      date: "June 2025 – July 2025",
      org: "Shalom Backpackers",
      role: "Social Media Marketing Intern",
      location: "Rishikesh",
      description:
        "Created engaging content, planned campaigns and helped grow the brand's online presence for solo travellers, backpackers and digital nomads.",
      tags: ["Reels", "Posts", "Stories", "SEO", "Google Business", "Influencers", "Events", "Reviews"],
      contributions: [
        "Managed social media accounts and created content calendar.",
        "Conducted SEO optimization and improved Google Business listing.",
        "Coordinated with property managers for marketing campaigns.",
        "Worked on influencer tie-ups and on-ground event promotions.",
        "Managed online reviews across hostel properties.",
      ],
      note: "Good people.\nGreat vibes.",
      noteAlign: "start",
      tilt: "rotate-[2.5deg]",
      imgClass: "aspect-[4/5] w-44 sm:w-48",
      image: content.experience.shalom,
      imageAlt: "Shalom Backpackers — hostel and travel work",
      testId: "exp-shalom",
    },
    {
      num: "02",
      date: "March 2026 – May 2026",
      org: "Moustache Escapes",
      role: "Marketing Executive — F&B",
      location: "Indian Hotels Pvt. Ltd.",
      description:
        "Managed social media, events, photoshoots and brand campaigns for F&B outlets across multiple properties. Worked closely with agencies, delivery partners and CRM platforms to drive visibility and revenue.",
      tags: ["F&B Social", "Events", "Photoshoots", "Agency Mgmt", "Zomato", "Swiggy", "EazyDiner", "CRM Campaigns"],
      contributions: [
        "Managed and optimized F&B social media accounts.",
        "Executed monthly events across outlets with positive P&L.",
        "Coordinated one professional photoshoot per month for all outlets.",
        "Managed external marketing agency deliverables.",
        "Drove customer retention through CRM campaigns.",
        "Worked with automated marketing journeys.",
      ],
      note: "Good Food\nGreat Vibes",
      noteAlign: "end",
      tilt: "-rotate-[2.5deg]",
      imgClass: "aspect-[5/4] w-48 sm:w-52",
      image: content.experience.moustache,
      imageAlt: "Moustache Escapes — F&B marketing work",
      testId: "exp-moustache",
    },
  ];

  return (
    <section
      id="experience"
      className="grain relative overflow-hidden bg-[#F7F2E8] py-24 text-ink sm:py-28"
      data-testid="experience-section"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div>
            <h2
              className="mt-5 font-heading text-5xl font-bold uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl"
              data-testid="experience-heading"
            >
              <WordReveal text="Professional Experience" />
            </h2>
            <div className="mt-4 font-heading text-xl italic text-ink/80 sm:text-2xl">
              <MaskedLine inView>Where marketing met the real world.</MaskedLine>
            </div>
          </div>

          <div className="relative">
            <p className="max-w-sm text-sm leading-relaxed text-ink/70">
              From content and SEO to events, customer engagement and on-ground execution — my work in hospitality and
              F&amp;B taught me how marketing works beyond screens.
            </p>
            <div className="pointer-events-none relative mt-6 hidden h-16 sm:block" aria-hidden="true">
              <svg viewBox="0 0 220 70" className="h-16 w-56" fill="none" stroke={ORANGE} strokeWidth="1.4">
                <path d="M5 62 Q 130 4 200 26" strokeLinecap="round" strokeDasharray="5 5" />
              </svg>
              <Plane className="absolute right-3 top-3 h-5 w-5 rotate-[35deg]" style={{ color: "#1a1a1a" }} />
              <span
                className="absolute left-16 top-1 -rotate-3 font-hand text-2xl leading-tight"
                style={{ color: "#1a1a1a" }}
              >
                Same dream.
                <br />
                Bigger plans.
              </span>
            </div>
          </div>
        </div>

        {/* Two experience columns with center divider */}
        <div className="relative mt-16 grid gap-x-12 gap-y-20 md:grid-cols-2">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 bottom-2 hidden w-px -translate-x-1/2 bg-ink/12 md:block"
          />
          {EXPERIENCES.map((exp) => (
            <ExpColumn key={exp.testId} exp={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}
