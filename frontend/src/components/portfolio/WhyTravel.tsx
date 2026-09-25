import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import type { MotionValue } from "motion/react";
import { EASE } from "@/lib/anim";
import { useMedia } from "@/lib/media";
import { IMAGES, INFLUENCERS, PHOTOSHOOT } from "@/lib/marketingData";

function Word({ children, i, base = 0, accent = false }: { children: string; i: number; base?: number; accent?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} className="inline-block overflow-hidden pb-1 align-bottom">
      <motion.span
        initial={{ y: "115%", rotate: 4 }}
        animate={seen ? { y: "0%", rotate: 0 } : { y: "115%", rotate: 4 }}
        transition={{ duration: 0.7, delay: base + i * 0.05, ease: EASE }}
        className={`inline-block origin-bottom-left will-change-transform ${accent ? "text-terracotta" : ""}`}
      >
        {children}&nbsp;
      </motion.span>
    </span>
  );
}

function Mark({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <span className="relative">
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay, ease: EASE }}
        className="absolute inset-x-[-2px] inset-y-[1px] origin-left rounded-sm bg-terracotta/15"
      />
      <span className="relative font-medium text-ink">{children}</span>
    </span>
  );
}

const STRIP = [
  { src: PHOTOSHOOT[1].src, cap: "Rishikesh mornings", rotate: "-rotate-3", range: [36, -28] as const },
  { src: INFLUENCERS[2].src, cap: "", rotate: "rotate-2", range: [-20, 30] as const },
  { src: IMAGES.eventPhoto, cap: "Good vibes only", rotate: "-rotate-2", range: [44, -36] as const },
  { src: PHOTOSHOOT[3].src, cap: "", rotate: "rotate-3", range: [-30, 22] as const },
  { src: IMAGES.personalHero, cap: "On the road", rotate: "-rotate-1", range: [26, -40] as const },
];

function StripPhoto({ src, cap, rotate, range, progress, i }: { src: string; cap: string; rotate: string; range: readonly [number, number]; progress: MotionValue<number>; i: number }) {
  const y = useTransform(progress, [0, 1], [range[0], range[1]]);
  return (
    <motion.figure
      style={{ y }}
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className={`group bg-white p-1.5 pb-3 shadow-md transition-transform duration-300 hover:z-10 hover:scale-[1.04] hover:rotate-0 ${rotate}`}
      data-testid={`why-photo-${i}`}
    >
      <img src={src} alt={cap || "Travel photograph"} loading="lazy" className="aspect-[3/4] w-full object-cover" />
      {cap && (
        <figcaption className="pt-1.5 text-center font-hand text-sm leading-none text-ink/70">{cap}</figcaption>
      )}
    </motion.figure>
  );
}

export function WhyTravel() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["5%", "-8%"]);
  const compassRotate = useTransform(scrollYProgress, [0, 1], [-40, 140]);
  const media = useMedia();

  const overrides = useMemo(() => {
    const map = new Map<number, string>();
    for (const m of media.data ?? []) {
      if (m.category === "Why Travel" && m.kind === "image" && m.brand.startsWith("Why Travel ")) {
        const slot = parseInt(m.brand.replace("Why Travel ", ""), 10) - 1;
        if (slot >= 0 && slot < STRIP.length && !map.has(slot)) map.set(slot, m.url);
      }
    }
    return map;
  }, [media.data]);

  return (
    <section
      id="why"
      ref={ref}
      className="grain relative overflow-hidden border-y border-sand bg-white pb-16 pt-24 sm:pb-20 sm:pt-28"
      data-testid="why-section"
    >
      {/* parallax watermark */}
      <motion.span
        aria-hidden
        style={{ x: watermarkX }}
        className="pointer-events-none absolute -top-8 left-0 select-none whitespace-nowrap font-heading text-[24vw] font-bold uppercase leading-none tracking-tight text-ink/[0.045]"
      >
        Travel
      </motion.span>

      {/* scroll-spun compass */}
      <motion.svg
        aria-hidden
        style={{ rotate: compassRotate }}
        viewBox="0 0 64 64"
        className="pointer-events-none absolute right-6 top-10 h-14 w-14 text-ink/25 sm:right-12 sm:h-16 sm:w-16"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="32" cy="32" r="28" strokeWidth="1" strokeDasharray="3 4" />
        <circle cx="32" cy="32" r="21" strokeWidth="0.75" opacity="0.6" />
        <path d="M32 12 L36 32 L32 52 L28 32 Z" fill="currentColor" stroke="none" />
        <circle cx="32" cy="32" r="2.5" fill="#E16428" stroke="none" />
      </motion.svg>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl" data-testid="why-headline">
          <span className="block">
            {["Travel", "was", "never", "just", "a", "subject."].map((w, i) => (
              <Word key={w} i={i}>{w}</Word>
            ))}
          </span>
          <span className="block">
            {["It", "became", "the", "lens", "for"].map((w, i) => (
              <Word key={w} i={i} base={0.35}>{w}</Word>
            ))}
            {["everything", "I", "build."].map((w, i) => (
              <Word key={w} i={i + 5} base={0.35} accent>{w}</Word>
            ))}
          </span>
        </h2>
      </div>

      {/* photo strip with staggered parallax — photos changeable from /admin (category: Why Travel) */}
      <div className="relative z-10 mx-auto mt-14 max-w-5xl px-4 sm:px-6 lg:px-8" data-testid="why-photo-strip">
        <div className="grid grid-cols-2 items-center gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-5">
          {STRIP.map((p, i) => (
            <StripPhoto key={i} {...p} src={overrides.get(i) ?? p.src} progress={scrollYProgress} i={i} />
          ))}
        </div>
      </div>

      <div className="relative z-10 mx-auto mt-16 max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 text-base leading-relaxed text-muted-foreground sm:grid-cols-2">
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            It started with <Mark delay={0.3}>tourism education</Mark> — understanding how
            destinations, businesses and travellers fit together. Then hospitality made it real:{" "}
            <Mark delay={0.5}>hostels in Rishikesh</Mark>, restaurants and bars, guests whose
            experience depended on a hundred small operational decisions.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <Mark delay={0.4}>Marketing</Mark> taught me how travel businesses earn attention.{" "}
            <Mark delay={0.55}>Operations</Mark> taught me what happens after they get it.
            Somewhere between the two, I started building systems — because the gap between a great
            story and a working business is usually a{" "}
            <Mark delay={0.7}>spreadsheet held together with hope</Mark>.
          </motion.p>
        </div>

        {/* closing quote */}
        <div className="relative mx-auto mt-16 max-w-2xl text-center">
          <span aria-hidden className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none font-heading text-8xl leading-none text-terracotta/25">
            &ldquo;
          </span>
          <span className="block overflow-hidden">
            <motion.p
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
              className="font-heading text-xl italic leading-snug text-ink sm:text-2xl"
            >
              I'm not chasing a title. I'm building toward something simple: travel businesses that
              market beautifully and run properly.
            </motion.p>
          </span>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
            className="mx-auto mt-6 flex items-center justify-center gap-3"
          >
            <span className="h-[2px] w-10 bg-terracotta" />
            <span className="font-hand text-2xl leading-none text-terracotta">Vaibhav</span>
            <span className="h-[2px] w-10 bg-terracotta" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
