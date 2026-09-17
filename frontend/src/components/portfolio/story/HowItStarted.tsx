import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { IMG } from "@/lib/data";
import { MaskedLine } from "../Reveal";
import {
  BodyText,
  CountUp,
  DetailList,
  ORANGE,
  SquiggleArrow,
  TagRow,
  WordReveal,
  fadeUp,
  staggerParent,
} from "./shared";
import {
  DeskVisual,
  EcomVisual,
  EventsVisual,
  HospitalityCard,
  IndiaMapVisual,
  MbaVisual,
  SocialVisual,
  TriplinDiagram,
} from "./visuals";

function Chapter({
  num,
  year,
  label,
  title,
  flip = false,
  dark = false,
  wide = false,
  bg = "",
  visual,
  children,
  testId,
}: {
  num: string;
  year: string;
  label?: string;
  title: string;
  flip?: boolean;
  dark?: boolean;
  wide?: boolean;
  bg?: string;
  visual?: ReactNode;
  children: ReactNode;
  testId: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const numY = useTransform(scrollYProgress, [0, 1], [110, -110]);

  return (
    <article
      ref={ref}
      data-testid={testId}
      className={`relative flex min-h-screen items-center overflow-hidden py-24 md:py-28 ${
        dark ? "bg-night text-[#F5F5F3]" : ""
      } ${bg}`}
    >
      <motion.span
        aria-hidden="true"
        style={{ y: numY }}
        className={`pointer-events-none absolute top-4 select-none font-heading leading-none ${
          flip ? "-right-6 md:-right-12" : "-left-6 md:-left-12"
        } text-[38vw] md:text-[24vw] ${dark || bg ? "text-black/[0.07]" : "text-ink/[0.05]"}`}
      >
        {num}
      </motion.span>
      <motion.span
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-35%" }}
        transition={{ duration: 0.4 }}
        className="absolute left-3 top-1/2 z-10 h-3 w-3 -translate-x-[5px] -translate-y-1/2 rounded-full border-2 md:left-1/2 md:-translate-x-1.5"
        style={{ borderColor: ORANGE, background: dark ? "#121415" : "#F7F2E8" }}
        aria-hidden="true"
      />
      <div
        className={`relative z-10 mx-auto w-full px-6 pl-10 md:px-10 ${
          wide ? "max-w-5xl" : "grid max-w-6xl items-center gap-12 md:grid-cols-2 md:gap-16"
        }`}
      >
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={flip ? "md:order-2" : ""}
        >
          <motion.p
            variants={fadeUp}
            className="font-mono text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: ORANGE }}
          >
            {year}
            {label ? ` · ${label}` : ""}
          </motion.p>
          <h3 className="mt-4 font-heading text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">
            <WordReveal text={title} />
          </h3>
          {children}
        </motion.div>
        {visual && !wide && <div className={flip ? "md:order-1" : ""}>{visual}</div>}
      </div>
    </article>
  );
}

function Statement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45, 1], [0.85, 1, 1.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.8, 1], [0, 1, 1, 0.15]);
  return (
    <div ref={ref} className="relative h-[170vh]" data-testid="story-statement">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h3
          style={{ scale, opacity }}
          className="font-heading text-4xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
        >
          8 CHAPTERS.
          <br />
          ONE DIRECTION <span style={{ color: ORANGE }}>→ TRAVEL.</span>
        </motion.h3>
        <SquiggleArrow className="mt-10 w-28 rotate-12" />
      </div>
    </div>
  );
}

export function HowItStarted() {
  const chaptersRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: chaptersRef, offset: ["start 0.75", "end 0.9"] });

  return (
    <section id="story" className="grain relative bg-[#F7F2E8] text-ink" data-testid="story-section">

      {/* section intro */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 pb-8 pt-28 text-center sm:pt-36">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-mono text-xs font-semibold uppercase tracking-[0.3em]"
          style={{ color: ORANGE }}
        >
          Section 02
        </motion.p>
        <h2 className="mt-5 font-heading text-5xl font-medium tracking-tight sm:text-6xl lg:text-7xl" data-testid="story-heading">
          <WordReveal text="HOW IT STARTED" />
        </h2>
        <div className="mx-auto mt-8 max-w-3xl font-heading text-xl italic leading-snug text-ink/80 sm:text-2xl">
          <MaskedLine inView>“From learning digital marketing in 2020</MaskedLine>
          <MaskedLine inView delay={0.15}>to building a travel company today.”</MaskedLine>
        </div>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-ink/60 sm:text-base"
        >
          I started with digital marketing, experimented with e-commerce and SEO, moved into travel
          content and tourism, worked with events and hospitality brands, and eventually began
          building my own travel business.
        </motion.p>
      </div>

      <Statement />

      {/* chapters + progress rail */}
      <div ref={chaptersRef} className="relative">
        <div aria-hidden="true" className="absolute inset-y-0 left-3 z-[6] w-px bg-ink/10 md:left-1/2">
          <motion.div style={{ scaleY: scrollYProgress }} className="h-full w-px origin-top bg-[#FF6B1A]" />
        </div>

      {/* CH 01 — 2020 Digital Marketing */}
      <Chapter num="01" year="2020" title="I started with Digital Marketing" visual={<DeskVisual />} testId="chapter-01">
        <BodyText>
          I started learning digital marketing independently and began working as a freelance
          digital marketer.
        </BodyText>
        <motion.p variants={fadeUp} className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
          Social media. SEO. Advertising. Online brand building.
        </motion.p>
        <TagRow tags={["Digital Marketing", "SEO", "Social Media", "Freelancing"]} />
      </Chapter>

      {/* CH 02 — Mar 2022 E-commerce */}
      <Chapter num="02" year="March 2022" title="My first E-commerce project" flip wide testId="chapter-02">
        <BodyText>
          While pursuing my Bachelor's degree in Marketing, I helped a home-appliance brand
          establish its online presence.
        </BodyText>
        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-14">
          <EcomVisual />
          <motion.div variants={staggerParent}>
            <motion.p variants={fadeUp} className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              What I handled
            </motion.p>
            <DetailList
              items={[
                "Registered the brand on Amazon, Flipkart and IndiaMART",
                "Created and optimized product listings",
                "Worked on product visibility and search ranking",
                "Managed incoming orders and delivery fulfillment",
                "Tracked sales and overall performance",
                "Ran advertising campaigns for product visibility",
                "Identified opportunities to improve sales",
              ]}
            />
          </motion.div>
        </div>
        <motion.div variants={staggerParent} className="mt-14 grid gap-4 sm:grid-cols-3" data-testid="ecom-metrics">
          {[
            { to: 20, prefix: "₹", suffix: "K", decimals: 0, label: "Sales" },
            { to: 2.5, prefix: "₹", suffix: "K", decimals: 1, label: "Ad Spend" },
            { to: 2, prefix: "", suffix: "", decimals: 0, label: "Months · Project" },
          ].map((m) => (
            <motion.div
              key={m.label}
              variants={fadeUp}
              className="rounded-md border border-ink/10 bg-white p-6 text-center shadow-sm"
            >
              <CountUp
                to={m.to}
                prefix={m.prefix}
                suffix={m.suffix}
                decimals={m.decimals}
                className="text-3xl font-bold tracking-tight sm:text-4xl"
              />
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{m.label}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.p variants={fadeUp} className="mt-8 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50">
          My first experience managing an online business — listing → marketing → order → fulfillment → analysis.
        </motion.p>
      </Chapter>

      {/* CH 03 — 2022 First website */}
      <Chapter num="03" year="2022" title="I built my first website" visual={<IndiaMapVisual />} testId="chapter-03">
        <BodyText>I built my first website using Wix and took responsibility for its SEO.</BodyText>
        <motion.p variants={fadeUp} className="mt-8 flex items-baseline gap-3">
          <CountUp to={13} suffix="+" className="text-6xl font-bold tracking-tight sm:text-7xl" />
          <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: ORANGE }}>
            Cities ranked
          </span>
        </motion.p>
        <BodyText>
          The website ranked for location-specific keywords across 13+ cities, giving me my first
          hands-on experience combining website building with search visibility.
        </BodyText>
      </Chapter>

      {/* CH 04 — 2023 Travel stories */}
      <Chapter num="04" year="2023" title="I started telling travel stories" flip visual={<SocialVisual />} testId="chapter-04">
        <motion.p variants={fadeUp} className="mt-5 font-heading text-xl italic text-ink/85 sm:text-2xl">
          “Travel became more than an interest.”
        </motion.p>
        <BodyText>
          I started creating travel content under @nagpurtaveler, documenting destinations,
          experiences and places from a local traveler's perspective.
        </BodyText>
        <SquiggleArrow className="mt-8 w-24 -rotate-6" />
      </Chapter>

      {/* CH 05 — 2023–2026 Tourism */}
      <Chapter num="05" year="2023–2026" title="I went deeper into Tourism" visual={<MbaVisual />} testId="chapter-05">
        <BodyText>I moved from learning about travel independently to studying it professionally.</BodyText>
        <motion.p variants={fadeUp} className="mt-8 font-bold leading-[1.05] tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
          <span className="block text-5xl sm:text-6xl">MBA</span>
          <span className="mt-1 block text-2xl sm:text-3xl" style={{ color: ORANGE }}>
            Travel &amp; Tourism
          </span>
          <span className="block text-2xl sm:text-3xl">Management</span>
        </motion.p>
        <motion.p variants={fadeUp} className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink/50">
          Indian Institute of Travel and Tourism Management (IITTM)
        </motion.p>
      </Chapter>

      {/* CH 06 — Events */}
      <Chapter num="06" year="Events" label="UrbanHook" title="UrbanHook Events" flip visual={<EventsVisual />} testId="chapter-06">
        <motion.p variants={fadeUp} className="mt-4 font-heading text-xl italic text-ink/85">
          Where marketing met the real world.
        </motion.p>
        <BodyText>
          I worked on marketing and event execution for live experiences including stand-up comedy
          and music-jamming shows.
        </BodyText>
        <TagRow tags={["Event Marketing", "Creative Design", "Social Media", "Influencer Collabs", "Brand Partnerships", "Event Operations"]} />
        <DetailList
          items={[
            "Planned and executed marketing strategies for live events",
            "Designed posters, banners and promotional creatives",
            "Created reels, posts, stories and teaser videos",
            "Collaborated with local and regional influencers",
            "Worked on event promotions and brand partnerships",
            "Assisted with venue coordination and branding setup",
            "Supported audience management and event operations",
          ]}
        />
      </Chapter>

      {/* CH 07 — Hospitality (dark, biggest) */}
      <Chapter
        num="07"
        year="Hospitality"
        title="My work moved from promoting businesses online to understanding how travel businesses actually operate."
        dark
        wide
        testId="chapter-07"
      >
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <HospitalityCard
            org="Shalom Backpackers"
            role="Social Media Marketing Intern"
            locations="Rishikesh · Shimla · McLeodganj"
            image={IMG.rishikeshRiver}
            imageAlt="Backpacker hostel country — the Ganges through Rishikesh"
            tags={["Reels", "Posts", "Stories", "SEO", "Google Business", "Influencers", "Events", "Reviews"]}
            details={[
              "Created engaging reels, posts and stories",
              "Conducted SEO optimization",
              "Improved Google Business listing visibility",
              "Coordinated marketing campaigns",
              "Worked on influencer tie-ups",
              "Supported on-ground event promotions",
              "Managed online reviews across hostel properties",
              "Maintained brand-consistent communication across Google and OTAs",
            ]}
            from={-60}
            testId="story-card-shalom"
          />
          <HospitalityCard
            org="Moustache Escapes"
            role="Marketing Executive — F&B"
            image={IMG.chefPlating}
            imageAlt="Chef plating a dish in a restaurant kitchen"
            metric={
              <div className="mt-5 rounded-md border border-white/10 bg-white/5 p-4">
                <p className="flex items-baseline gap-2">
                  <CountUp to={100} suffix="%" className="text-4xl font-bold tracking-tight" />
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
                    F&amp;B Bar &amp; À La Carte revenue target
                  </span>
                </p>
              </div>
            }
            tags={["F&B Social", "Events", "Photoshoots", "Agency Mgmt", "Zomato · Swiggy · EazyDiner", "CRM Campaigns"]}
            details={[
              "Managed F&B social media accounts across brands and outlets",
              "Executed monthly events across outlets with positive P&L",
              "Coordinated one professional photoshoot per month across Verandah, Bayleaf and The 7",
              "Managed external marketing agency deliverables",
              "Managed and optimized Zomato, Swiggy Dineout and EazyDiner",
              "Managed events, offers, launches, menus and promotions",
              "Drove customer retention through CRM campaigns",
              "Worked with automated marketing journeys",
            ]}
            from={60}
            testId="story-card-moustache"
          />
        </div>
      </Chapter>

      {/* CH 08 — The Turn (orange climax) */}
      <Chapter num="08" year="2026" label="The Turn" title="I'm building Triplin." wide bg="bg-[#FF6B1A] text-[#141414]" testId="chapter-08">
        <motion.p variants={fadeUp} className="mt-6 font-heading text-2xl italic leading-snug sm:text-4xl">
          “A travel company built for travelers.”
        </motion.p>
        <BodyText dark={false}>
          <span className="block text-[#141414]/75">
            After working across digital marketing, e-commerce, content, events and hospitality, I
            wanted to bring everything together.
          </span>
          <span className="mt-3 block text-[#141414]/75">
            So I started building Triplin — a travel company focused on making travel easier.
          </span>
        </BodyText>
        <motion.div variants={fadeUp} className="mt-12 text-center">
          <p className="font-bold tracking-tight text-[#141414]" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "clamp(3rem, 9vw, 6rem)", lineHeight: 1 }}>
            TRIPLIN
          </p>
          <p className="mt-2 font-mono text-xs font-semibold uppercase tracking-[0.3em] text-[#141414]/70">
            Travel Made Easier
          </p>
        </motion.div>
        <div className="mt-12">
          <TriplinDiagram />
        </div>
        <motion.div variants={fadeUp} className="mt-12 flex flex-col items-center gap-4">
          <a
            href="https://triplin.co.in"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#141414] px-9 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#F7F2E8] shadow-xl transition-transform duration-300 hover:-translate-y-1"
            data-testid="triplin-cta"
          >
            Explore Triplin <ArrowUpRight className="h-4 w-4" />
          </a>
          <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#141414]/60">triplin.co.in</span>
        </motion.div>
      </Chapter>
      </div>
    </section>
  );
}
