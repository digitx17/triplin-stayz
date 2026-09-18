import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { EASE, fadeUp } from "@/lib/anim";
import { IMG } from "@/lib/data";
import { MaskedLine } from "./Reveal";
import { CountUp, ORANGE, Tag, WordReveal } from "./story/shared";

function HandNote({ children }: { children: string }) {
  return (
    <span className="relative ml-3 inline-block -rotate-3 align-middle" data-testid={`hand-note-${children.replace(/\s/g, "-")}`}>
      <span className="font-hand text-2xl font-semibold" style={{ color: ORANGE }}>
        {children}
      </span>
      <svg viewBox="0 0 90 12" className="absolute -bottom-1.5 left-0 w-full" fill="none" aria-hidden="true">
        <path d="M3 8 C 25 3, 60 3, 87 7" stroke={ORANGE} strokeWidth={2} strokeLinecap="round" />
      </svg>
    </span>
  );
}

function ExpBlock({
  seen,
  delay,
  num,
  org,
  role,
  duration,
  note,
  locations,
  image,
  imageAlt,
  tilt = false,
  tags,
  bullets,
  metric = false,
  testId,
}: {
  seen: boolean;
  delay: number;
  num: string;
  org: string;
  role: string;
  duration: string;
  note: string;
  locations?: string;
  image: string;
  imageAlt: string;
  tilt?: boolean;
  tags: string[];
  bullets: string[];
  metric?: boolean;
  testId: string;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      animate={seen ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      className="relative"
      data-testid={testId}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 right-0 select-none font-heading text-8xl leading-none text-ink/[0.06] md:text-9xl"
      >
        {num}
      </span>
      <span
        aria-hidden="true"
        className="absolute -left-[25px] top-1.5 h-3 w-3 rounded-full border-2 bg-[#F7F2E8] md:hidden"
        style={{ borderColor: ORANGE }}
      />
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
        {role}
      </p>
      <h3 className="mt-2 font-heading text-3xl font-medium tracking-tight sm:text-4xl">{org}</h3>
      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
        {duration}
        <HandNote>{note}</HandNote>
      </p>
      {locations && (
        <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{locations}</p>
      )}
      <div className={`img-frame group mt-6 aspect-[4/3] rounded-sm ${tilt ? "rotate-[1.2deg] border-4 border-white shadow-lg" : ""}`}>
        <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover group-hover:scale-105" />
      </div>
      {metric && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={seen ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
          transition={{ duration: 0.8, delay: delay + 0.5, ease: EASE }}
          className="mt-7 flex items-baseline gap-3"
          data-testid="exp-metric-100"
        >
          <CountUp
            to={100}
            suffix="%"
            className="text-6xl font-bold tracking-tight sm:text-7xl"
          />
          <span className="max-w-[140px] font-mono text-[9px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
            F&amp;B Bar &amp; À La Carte revenue target
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
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-140px" });

  return (
    <section id="experience" className="grain relative overflow-hidden bg-[#F7F2E8] py-24 text-ink sm:py-28" data-testid="experience-section">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-mono text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: ORANGE }}
        >
          Section 03
        </motion.p>
        <h2 className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl" data-testid="experience-heading">
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

        {/* journey line + two experiences */}
        <div ref={ref} className="relative mt-14">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={seen ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 2.2, ease: EASE }}
            aria-hidden="true"
            className="absolute -left-6 -right-6 top-0 hidden h-[2px] origin-left rounded-full md:block"
            style={{ background: ORANGE }}
            data-testid="exp-line"
          />
          {[
            { x: "25%", d: 0.9, id: "exp-node-shalom" },
            { x: "75%", d: 1.9, id: "exp-node-moustache" },
          ].map((n) => (
            <motion.span
              key={n.id}
              initial={{ scale: 0 }}
              animate={seen ? { scale: 1 } : { scale: 0 }}
              transition={{ duration: 0.35, delay: n.d }}
              aria-hidden="true"
              className="absolute top-0 z-10 hidden h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] bg-[#F7F2E8] md:block"
              style={{ left: n.x, borderColor: ORANGE }}
              data-testid={n.id}
            />
          ))}
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={seen ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.5, delay: 2.4 }}
            aria-hidden="true"
            className="absolute -right-6 top-0 hidden -translate-y-1/2 font-heading text-2xl md:block"
            style={{ color: ORANGE }}
            data-testid="exp-line-arrow"
          >
            →
          </motion.span>

          {/* mobile vertical rail */}
          <div aria-hidden="true" className="absolute bottom-0 left-3 top-0 w-px bg-ink/10 md:hidden">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={seen ? { scaleY: 1 } : { scaleY: 0 }}
              transition={{ duration: 1.6, ease: EASE }}
              className="h-full w-px origin-top"
              style={{ background: ORANGE }}
            />
          </div>

          <div className="grid gap-16 pl-8 pt-14 md:grid-cols-2 md:gap-14 md:pl-0 md:pt-16">
            <ExpBlock
              seen={seen}
              delay={1.0}
              num="01"
              org="Shalom Backpackers"
              role="Social Media Marketing Intern"
              duration="2 MONTHS · JUNE 2025 — JULY 2025"
              note="2 months"
              locations="Rishikesh · Shimla · McLeodganj"
              image={IMG.rishikeshRiver}
              imageAlt="The Ganges flowing through Rishikesh valley, backpacker country"
              tags={["Reels", "Posts", "Stories", "SEO", "Google Business", "Influencers", "Events", "Reviews"]}
              bullets={[
                "Created engaging reels, posts and stories",
                "Conducted SEO optimization",
                "Improved Google Business listing visibility",
                "Coordinated marketing campaigns",
                "Worked on influencer tie-ups",
                "Supported on-ground event promotions",
                "Managed online reviews across hostel properties",
                "Maintained brand-consistent communication across Google and OTAs",
              ]}
              testId="exp-shalom"
            />
            <ExpBlock
              seen={seen}
              delay={2.1}
              num="02"
              org="Moustache Escapes"
              role="Marketing Executive — F&B"
              duration="3 MONTHS · MARCH 2026 — MAY 2026"
              note="3 months"
              image={IMG.chefPlating}
              imageAlt="Chef plating a dish in a restaurant kitchen"
              tilt
              metric
              tags={["F&B Social", "Events", "Photoshoots", "Agency Mgmt", "Zomato", "Swiggy Dineout", "EazyDiner", "CRM"]}
              bullets={[
                "Managed F&B social media accounts across brands and outlets",
                "Executed monthly events across outlets with positive P&L",
                "Coordinated one professional photoshoot per month across Verandah, Bayleaf and The 7",
                "Managed external marketing agency deliverables",
                "Managed and optimized Zomato, Swiggy Dineout and EazyDiner",
                "Managed events, offers, launches, menus and promotions",
                "Drove customer retention through CRM campaigns",
                "Worked with automated marketing journeys",
              ]}
              testId="exp-moustache"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
