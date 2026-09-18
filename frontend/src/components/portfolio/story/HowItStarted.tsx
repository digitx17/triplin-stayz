import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { EASE, fadeUp, staggerParent } from "@/lib/anim";
import { MaskedLine } from "../Reveal";
import { CountUp, ORANGE, Tag, WordReveal } from "./shared";

function Chapter({
  num,
  meta,
  title,
  tags,
  visual,
  order = "",
  children,
  testId,
}: {
  num: string;
  meta: string;
  title: string;
  tags?: string[];
  visual?: ReactNode;
  order?: string;
  children: ReactNode;
  testId: string;
}) {
  return (
    <motion.article
      variants={staggerParent}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={`relative pt-14 md:pt-16 ${order}`}
      data-testid={testId}
    >
      <span
        aria-hidden="true"
        className="absolute -left-[25px] top-[62px] h-3 w-3 rounded-full border-2 bg-[#F7F2E8] md:hidden"
        style={{ borderColor: ORANGE }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-4 select-none font-heading text-7xl leading-none text-ink/[0.06] md:text-8xl"
      >
        {num}
      </span>
      <motion.p variants={fadeUp} className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
        {meta}
      </motion.p>
      <motion.h3 variants={fadeUp} className="mt-2 font-heading text-2xl font-medium tracking-tight sm:text-[1.65rem]">
        {title}
      </motion.h3>
      <motion.div variants={fadeUp} className="mt-3 text-sm leading-relaxed text-ink/65">
        {children}
      </motion.div>
      {tags && (
        <motion.div variants={staggerParent} className="mt-4 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </motion.div>
      )}
      {visual && <motion.div variants={fadeUp} className="mt-5">{visual}</motion.div>}
    </motion.article>
  );
}

function Row({
  reverse = false,
  dots,
  end,
  turn,
  children,
}: {
  reverse?: boolean;
  dots: number[];
  end?: number;
  turn?: "right" | "left";
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, margin: "-140px" });
  const delays = reverse ? [0.95, 0.55, 0.2] : [0.2, 0.55, 0.95];
  return (
    <div ref={ref} className={`relative ${turn ? "mb-16 md:mb-28" : ""}`}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={seen ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, ease: EASE }}
        aria-hidden="true"
        className={`absolute left-0 right-0 top-6 hidden h-[2px] rounded-full md:block ${reverse ? "origin-right" : "origin-left"}`}
        style={{ background: ORANGE, ...(end ? { right: `${100 - end}%` } : {}) }}
      />
      {dots.map((x, i) => (
        <motion.span
          key={x}
          initial={{ scale: 0 }}
          animate={seen ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.35, delay: delays[Math.min(i, 2)] ?? 0.4 }}
          aria-hidden="true"
          className="absolute top-[19px] z-10 hidden h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] bg-[#F7F2E8] md:block"
          style={{ left: `${x}%`, borderColor: ORANGE }}
        />
      ))}
      {turn && (
        <svg
          aria-hidden="true"
          viewBox="0 0 64 100"
          preserveAspectRatio="none"
          className={`absolute top-6 hidden h-[calc(100%+112px)] w-16 overflow-visible md:block ${turn === "right" ? "right-0" : "left-0"}`}
        >
          <motion.path
            d={turn === "right" ? "M 62 0 C 100 25, 100 75, 62 100" : "M 2 0 C -36 25, -36 75, 2 100"}
            stroke={ORANGE}
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={seen ? { pathLength: 1 } : { pathLength: 0 }}
            transition={{ duration: 1.1, delay: 1.2, ease: "easeInOut" }}
          />
        </svg>
      )}
      <div className="grid gap-12 pl-8 md:grid-cols-3 md:gap-8 md:pl-0">{children}</div>
    </div>
  );
}

function MetricChip({ value, label }: { value: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 rounded-full border border-ink/15 bg-white px-3 py-1.5">
      <span className="font-mono text-xs font-bold tracking-tight">{value}</span>
      <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-muted-foreground">{label}</span>
    </span>
  );
}

export function HowItStarted() {
  const chaptersRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ["start 0.8", "end 0.85"] });

  return (
    <section id="story" className="grain relative bg-[#F7F2E8] text-ink" data-testid="story-section">
      {/* intro — left title, right statement */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-6 pb-12 pt-16 sm:pt-20 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl" data-testid="story-heading">
            <WordReveal text="HOW IT STARTED" />
          </h2>
          <div className="mt-5 font-heading text-base italic leading-snug text-ink/80 sm:text-lg">
            <MaskedLine inView>“From learning digital marketing in 2020</MaskedLine>
            <MaskedLine inView delay={0.15}>to building a travel company today.”</MaskedLine>
          </div>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-5 max-w-md text-sm leading-relaxed text-ink/60"
          >
            I started with digital marketing, experimented with e-commerce and SEO, moved into
            travel content and tourism, worked with events and hospitality brands, and eventually
            began building my own travel business.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="md:text-right"
          data-testid="story-statement"
        >
          <p className="font-heading text-3xl leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl">
            8 CHAPTERS.
            <br />
            ONE DIRECTION
            <span className="my-1 block leading-none" style={{ color: ORANGE }} aria-hidden="true">↓</span>
            <span style={{ color: ORANGE }}>TRAVEL.</span>
          </p>
        </motion.div>
      </div>

      {/* journey */}
      <div ref={chaptersRef} className="relative mx-auto max-w-6xl px-6 pb-24 md:pb-28">
        {/* mobile vertical rail */}
        <div aria-hidden="true" className="absolute bottom-0 left-3 top-0 w-px bg-ink/10 md:hidden">
          <motion.div style={{ scaleY: scrollYProgress }} className="h-full w-px origin-top" >
            <div className="h-full w-full" style={{ background: ORANGE }} />
          </motion.div>
        </div>

        {/* RUN 1 — left to right */}
        <Row dots={[16.7, 50, 83.3]} turn="right">
          <Chapter num="01" meta="2020" title="Digital Marketing" tags={["Digital Marketing", "SEO", "Freelancing"]} testId="chapter-01">
            Started learning digital marketing independently and freelancing — social media, SEO,
            advertising and online brand building.
          </Chapter>
          <Chapter
            num="02"
            meta="March 2022"
            title="E-commerce"
            tags={["Amazon", "Flipkart", "IndiaMART"]}
            visual={
              <div className="flex flex-wrap gap-1.5">
                <MetricChip value={<CountUp to={20} prefix="₹" suffix="K" />} label="Sales" />
                <MetricChip value={<CountUp to={2.5} prefix="₹" suffix="K" decimals={1} />} label="Ad spend" />
                <MetricChip value={<CountUp to={2} />} label="Months" />
              </div>
            }
            testId="chapter-02"
          >
            Helped a home-appliance brand go online — listings, search ranking, ads, orders and
            fulfillment.
          </Chapter>
          <Chapter
            num="03"
            meta="2022"
            title="Website &amp; SEO"
            tags={["Wix", "SEO"]}
            testId="chapter-03"
          >
            Built my first website on Wix and owned its SEO — ranked for location keywords across{" "}
            <span className="font-semibold text-ink">13+ cities</span>.
          </Chapter>
        </Row>

        {/* RUN 2 — right to left (visual order reversed) */}
        <Row reverse dots={[16.7, 50, 83.3]} turn="left">
          <Chapter
            num="04"
            meta="2023"
            title="Travel Content"
            order="md:order-3"
            tags={["Reels", "Storytelling"]}
            visual={
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.instagram.com/nagpurtraveler"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-nagpurtraveler"
                  className="inline-flex items-center gap-3 rounded-full border-2 border-ink bg-night px-4 py-2 text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="font-mono text-[10px] font-semibold tracking-[0.08em]">@nagpurtraveler</span>
                  <span className="h-3 w-px bg-white/20" />
                  <CountUp to={10} suffix="K+" className="font-mono text-[10px] font-bold" />
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/50">followers</span>
                </a>
                <a
                  href="https://www.instagram.com/par_yatanwala"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="link-par-yatanwala"
                  className="inline-flex items-center gap-3 rounded-full border-2 border-ink bg-night px-4 py-2 text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="font-mono text-[10px] font-semibold tracking-[0.08em]">@par_yatanwala</span>
                  <span className="h-3 w-px bg-white/20" />
                  <span className="font-mono text-[10px] font-bold">1.5K</span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/50">followers</span>
                </a>
              </div>
            }
            testId="chapter-04"
          >
            “Travel became more than an interest.” Started @nagpurtraveler — destinations and
            experiences from a local traveler's perspective.
          </Chapter>
          <Chapter
            num="05"
            meta="2024–2026"
            title="Tourism Education"
            order="md:order-2"
            tags={["MBA", "Travel & Tourism"]}
            visual={
              <div>
                <div className="inline-block -rotate-2 rounded-md border border-ink/10 bg-white px-4 py-3 shadow-md">
                  <p className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: ORANGE }}>
                    Admission · 2024–2026
                  </p>
                  <p className="mt-1 font-heading text-base font-medium leading-tight">
                    IITTM — Indian Institute of Travel &amp; Tourism Management
                  </p>
                </div>
                <img
                  src="/mot-stamp.webp"
                  alt="An autonomous body under Ministry of Tourism, Government of India"
                  loading="lazy"
                  className="mt-4 w-52 mix-blend-multiply opacity-90"
                  data-testid="mot-stamp"
                />
              </div>
            }
            testId="chapter-05"
          >
            Moved from learning travel independently to studying it professionally — MBA in Travel
            &amp; Tourism Management.
          </Chapter>
          <Chapter
            num="06"
            meta="Events"
            title="UrbanHook Events"
            order="md:order-1"
            tags={["Event Marketing", "Creatives", "Influencer Collabs"]}
            visual={
              <div className="flex items-start gap-3">
                <img
                  src="/event-standup.webp"
                  alt="UrbanHook Events poster — Ladies Aadmi stand-up comedy ft. Vivek Samtani"
                  loading="lazy"
                  className="h-40 w-auto -rotate-3 rounded-sm border-2 border-white object-cover shadow-lg"
                  data-testid="event-poster-standup"
                />
                <img
                  src="/event-jam.jpg"
                  alt="Saaz jamming session poster — Gwalior, Teagather Grand"
                  loading="lazy"
                  className="mt-4 h-40 w-auto rotate-2 rounded-sm border-2 border-white object-cover shadow-lg"
                  data-testid="event-poster-jam"
                />
              </div>
            }
            testId="chapter-06"
          >
            Where marketing met the real world — marketing and execution for stand-up comedy and
            music-jamming shows.
          </Chapter>
        </Row>

        {/* RUN 3 — left to right, ending at Triplin */}
        <Row dots={[16.7, 50]} end={50}>
          <Chapter
            num="07"
            meta="Hospitality"
            title="Shalom Backpackers &amp; Moustache Escapes"
            tags={["Social Media", "Content Creation", "Local SEO", "Photoshoot", "Events", "Loyalty Program", "Agency Management", "Influencer Collab"]}
            visual={
              <span className="inline-flex items-baseline gap-2 rounded-full border border-ink/15 bg-white px-4 py-2 shadow-sm">
                <span className="font-mono text-sm font-bold tracking-tight">₹1.4Cr</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Monthly revenue target</span>
              </span>
            }
            testId="chapter-07"
          >
            Social media &amp; SEO for backpacker hostels across Rishikesh, Shimla and McLeodganj —
            then F&amp;B marketing for restaurant and bar brands, from photoshoots to retention.
          </Chapter>
          <Chapter
            num="08"
            meta="2026 · The Turn"
            title="I'm building Triplin."
            tags={["Travel Systems", "Triplin"]}
            visual={
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-4 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute h-full w-full animate-ping rounded-full opacity-60" style={{ background: ORANGE }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: ORANGE }} />
                  </span>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em]">Currently building</span>
                </span>
                <a
                  href="https://triplin.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-paper transition-transform duration-300 hover:-translate-y-0.5"
                  data-testid="triplin-cta"
                >
                  triplin.co.in <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            }
            testId="chapter-08"
          >
            A travel company built for travelers — bringing together everything from marketing,
            content, events and hospitality into one journey.
          </Chapter>
        </Row>
      </div>
    </section>
  );
}
