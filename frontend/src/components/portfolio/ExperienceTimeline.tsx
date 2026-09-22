import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Mountain, Plane, TreePine } from "lucide-react";
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
  tilt: string;
  image: string;
  imageAlt: string;
  testId: string;
}

function OutlineTag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-ink/25 px-3 py-1 font-sans text-xs text-ink/70">
      {children}
    </span>
  );
}

function Polaroid({ image, alt, tilt, note }: { image: string; alt: string; tilt: string; note: string }) {
  return (
    <div className="relative flex flex-col items-center lg:items-end">
      <div className={`relative bg-white p-2 pb-4 shadow-xl ${tilt}`}>
        {/* washi tape */}
        <span
          aria-hidden="true"
          className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-[5deg] bg-[#e6dcc4]/70 shadow-sm"
        />
        <div className="h-52 w-40 overflow-hidden rounded-[1px] sm:h-56 sm:w-44">
          <img src={image} alt={alt} loading="lazy" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="mt-3 flex items-end gap-1">
        <span className="font-hand text-2xl leading-none" style={{ color: ORANGE }}>
          {note}
        </span>
        <svg viewBox="0 0 40 40" className="h-6 w-6 -translate-y-1" fill="none" stroke={ORANGE} strokeWidth="1.5" aria-hidden="true">
          <path d="M6 34 Q 20 34 30 12" strokeLinecap="round" />
          <path d="M23 12 L31 9 L31 18" strokeLinecap="round" strokeLinejoin="round" />
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
      className="relative"
      data-testid={exp.testId}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-0 select-none font-heading text-[92px] font-semibold leading-none text-ink/[0.07] sm:text-[120px]"
      >
        {exp.num}
      </span>

      <div className="relative border-l border-ink/15 pl-7 sm:pl-10">
        {/* orange rail accent */}
        <span aria-hidden="true" className="absolute -left-px top-1 h-24 w-[2px]" style={{ background: ORANGE }} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-6">
          <div className="min-w-0 pt-14 sm:pt-16 lg:pt-10">
            <div className="flex items-center gap-2.5">
              <span className="h-[2px] w-6" style={{ background: ORANGE }} />
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                {exp.date}
              </span>
            </div>
            <h3 className="mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl" data-testid={`${exp.testId}-title`}>
              {exp.org}
            </h3>
            <p className="mt-2 text-base text-ink/80">{exp.role}</p>
            <p className="mt-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/55">
              <MapPin className="h-3.5 w-3.5" style={{ color: ORANGE }} />
              {exp.location}
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">{exp.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {exp.tags.map((t) => (
                <OutlineTag key={t}>{t}</OutlineTag>
              ))}
            </div>
          </div>

          <div className="lg:pt-14">
            <Polaroid image={exp.image} alt={exp.imageAlt} tilt={exp.tilt} note={exp.note} />
          </div>
        </div>

        <div className="mt-9">
          <div className="flex items-center gap-2.5">
            <span className="h-[2px] w-6" style={{ background: ORANGE }} />
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-ink/60">Key contributions</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {exp.contributions.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-ink/70">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} />
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
      location: "Rishikesh · Shimla · McLeodganj",
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
      note: "Good people. Great vibes.",
      tilt: "rotate-[2deg]",
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
      note: "Good food. Great vibes.",
      tilt: "-rotate-[2deg]",
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
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
          <div>
            <p
              className="inline-block -rotate-1 border-b-2 pb-0.5 font-mono text-[11px] font-semibold uppercase tracking-[0.28em]"
              style={{ color: ORANGE, borderColor: ORANGE }}
            >
              Professional Experience
            </p>
            <h2
              className="mt-5 font-heading text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl"
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
        <div className="relative mt-16 grid gap-16 md:grid-cols-2 md:gap-14">
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-4 bottom-4 hidden w-px -translate-x-1/2 bg-ink/12 md:block"
          />
          {EXPERIENCES.map((exp) => (
            <ExpColumn key={exp.testId} exp={exp} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-20 flex items-center gap-6">
          <div className="flex items-end gap-1 text-ink/60">
            <Mountain className="h-8 w-8" strokeWidth={1} />
            <TreePine className="h-6 w-6" strokeWidth={1} />
          </div>
          <span className="h-px flex-1 bg-ink/15" />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink/45">
            Travel&nbsp;&nbsp;/&nbsp;&nbsp;Marketing&nbsp;&nbsp;/&nbsp;&nbsp;Hospitality
          </span>
        </div>
      </div>
    </section>
  );
}
