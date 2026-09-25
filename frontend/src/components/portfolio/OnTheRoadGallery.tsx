import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ROAD_ITEMS } from "@/lib/data";
import { useMedia } from "@/lib/media";

type RoadCard = { image: string; caption: string; tag: string; kind: "image" | "video" };

export function OnTheRoadGallery() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const uploads = (useMedia("travel").data ?? []).filter((m) => m.kind !== "embed");
  const cards: RoadCard[] = [
    ...uploads.map((m) => ({ image: m.url, caption: m.caption || "On the road", tag: "My upload", kind: m.kind as "image" | "video" })),
    ...ROAD_ITEMS.map((r) => ({ ...r, kind: "image" as const })),
  ];

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setRange(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [cards.length]);

  const heading = (
    <div className="mx-auto mb-10 flex max-w-7xl flex-wrap items-end justify-between gap-6 px-4 sm:px-6 lg:px-8">
      <div>
        <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">
          05 — Travel
        </p>
        <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl lg:text-4xl">On the road.</h2>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        Destinations, architecture, spiritual travel and slow routes — the field notes behind the work.
        Placeholder photography, ready to be replaced with my own shots and films.
      </p>
    </div>
  );

  const card = (item: RoadCard, i: number) => (
    <figure
      key={`${item.caption}-${i}`}
      className="group w-[74vw] shrink-0 sm:w-[44vw] lg:w-[30vw]"
      data-testid={`road-card-${i}`}
    >
      <div className="img-frame aspect-[3/4] rounded-sm">
        {item.kind === "video" ? (
          <video src={item.image} controls preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <img
            src={item.image}
            alt={item.caption}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105"
          />
        )}
      </div>
      <figcaption className="mt-3 flex items-baseline justify-between">
        <span className="font-heading text-lg">{item.caption}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terracotta">{item.tag}</span>
      </figcaption>
    </figure>
  );

  if (reduce) {
    return (
      <section id="road" className="bg-paper py-24 sm:py-32" data-testid="road-section">
        {heading}
        <div className="flex gap-6 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-8">
          {cards.map(card)}
        </div>
      </section>
    );
  }

  return (
    <section id="road" ref={sectionRef} className="relative h-[320vh] bg-paper" data-testid="road-section">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {heading}
        <motion.div ref={trackRef} style={{ x }} className="flex w-max gap-6 pl-4 sm:pl-6 lg:pl-8">
          {cards.map(card)}
        </motion.div>
        <div className="mx-auto mt-12 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-sand">
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left bg-terracotta" />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Keep scrolling — the gallery moves with you
          </p>
        </div>
      </div>
    </section>
  );
}
