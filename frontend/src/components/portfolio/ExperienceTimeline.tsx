import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE, fadeUp } from "@/lib/anim";
import { MaskedLine } from "./Reveal";
import { CountUp, ORANGE, Tag, WordReveal } from "./story/shared";
import { useSiteContent } from "@/lib/content";

function ExpBlock({
  num,
  org,
  role,
  duration,
  locations,
  image,
  imageAlt,
  tilt = false,
  tags,
  bullets,
  metric = false,
  testId,
}: {
  num: string;
  org: string;
  role: string;
  duration: string;
  locations?: string;
  image: string;
  imageAlt: string;
  tilt?: boolean;
  tags: string[];
  bullets: string[];
  metric?: boolean;
  testId: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 44 }}
      animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.9, ease: EASE }}
      className="relative rounded-md border border-ink/10 bg-white p-6 shadow-sm sm:p-8"
      data-testid={testId}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-4 select-none font-heading text-8xl leading-none text-ink/[0.05]"
      >
        {num}
      </span>
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
        {role}
      </p>
      <h3 className="mt-2 font-heading text-3xl font-medium tracking-tight sm:text-4xl">{org}</h3>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">{duration}</p>
      {locations && (
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{locations}</p>
      )}
      <div className={`img-frame group mt-6 aspect-[4/3] rounded-sm ${tilt ? "rotate-[1.2deg] shadow-lg" : ""}`}>
        <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover group-hover:scale-105" />
      </div>
      {metric && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={seen ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
          className="mt-7 flex items-baseline gap-3"
          data-testid="exp-metric-100"
        >
          <CountUp to={100} suffix="%" className="text-6xl font-bold tracking-tight sm:text-7xl" />
          <span className="max-w-[150px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
            Achieved · F&amp;B Bar &amp; À La Carte revenue targets
          </span>
        </motion.div>
      )}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <Tag key={t}>{t}</Tag>
        ))}
      </div>
      <p className="mt-7 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        What I worked on
      </p>
      <ul className="mt-3 space-y-2">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm leading-relaxed text-ink/65">
            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} />
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

export function ExperienceTimeline() {
  const { content } = useSiteContent();

  return (
    <section id="experience" className="grain relative overflow-hidden bg-[#F7F2E8] py-24 text-ink sm:py-28" data-testid="experience-section">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl" data-testid="experience-heading">
          <WordReveal text="PROFESSIONAL EXPERIENCE" />
        </h2>
        <div className="mt-5 font-heading text-base italic leading-snug text-ink/80 sm:text-lg">
          <MaskedLine inView>“Where marketing met the real world.”</MaskedLine>
        </div>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-5 max-w-2xl text-sm leading-relaxed text-ink/60"
        >
          My experience across hospitality taught me how marketing works beyond screens — from
          content and SEO to events, F&amp;B, customer engagement and on-ground execution.
        </motion.p>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-8">
          <ExpBlock
            num="01"
            org="Shalom Backpackers"
            role="Social Media Intern"
            duration="2 MONTHS · JUNE 2025 — JULY 2025"
            locations="Rishikesh"
            image={content.experience.shalom}
            imageAlt="Shalom Backpackers — hostel and travel work"
            tags={["Reels", "Posts", "Stories", "SEO", "Google Business", "Influencers", "Events", "Reviews"]}
            bullets={[
              "Created engaging reels, posts & stories for social media platforms",
              "Conducted SEO optimization and improved Google Business listing ranking",
              "Coordinated with property managers for marketing campaigns, influencer tie-ups, and on-ground event promotions across Rishikesh, Shimla, and McLeodganj",
            ]}
            testId="exp-shalom"
          />
          <ExpBlock
            num="02"
            org="Moustache Escapes"
            role="Marketing Executive"
            duration="3 MONTHS · MARCH 2026 — JUNE 2026"
            locations="Indian Hostel Pvt. Ltd"
            image={content.experience.moustache}
            imageAlt="Moustache Escapes — F&B marketing work"
            tilt
            metric
            tags={["F&B Social", "Events", "Photoshoots", "Agency Mgmt", "Listings & OTAs", "Content Creation", "Influencer Collab", "Loyalty Program"]}
            bullets={[
              "Managed all F&B social media accounts across brands and outlets",
              "Successfully executed monthly events across all outlets with positive P&L",
              "Conducted 1 professional photoshoot per month for all Verandah, Bayleaf, and The 7 outlets",
              "Managed and ensured timely delivery of all external marketing agency deliverables",
              "Managed and optimized OTA platforms (Zomato, Swiggy Dineout, EazyDiner) for events, offers, launches, menus, and promotions",
              "Drove customer retention through CRM campaigns, event promotions, and automated marketing journeys",
            ]}
            testId="exp-moustache"
          />
        </div>
      </div>
    </section>
  );
}
