import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { ArrowDown, ArrowUpRight, Building2, Clapperboard, Megaphone, Plane, Star } from "lucide-react";
import { EASE } from "@/lib/anim";
import { scrollToId } from "@/lib/smoothScroll";
import { MaskedLine } from "./Reveal";

interface Tag {
  label: string;
  icon: LucideIcon;
  className: string;
  delay: number;
  float: number;
  hideOnMobile?: boolean;
}

const TAGS: Tag[] = [
  { label: "Social Media", icon: Megaphone, className: "left-[2%] top-[14%] sm:left-[6%] sm:top-[20%]", delay: 1.5, float: 0 },
  { label: "Hospitality", icon: Building2, className: "left-[1%] top-[44%] sm:left-[3%] sm:top-[48%]", delay: 1.65, float: 0.6, hideOnMobile: true },
  { label: "Brand Strategy", icon: Star, className: "left-[6%] bottom-[28%] sm:left-[12%] sm:bottom-[26%]", delay: 1.8, float: 1.2 },
  { label: "Content", icon: Clapperboard, className: "right-[3%] top-[46%] sm:right-[7%] sm:top-[50%]", delay: 1.95, float: 0.9 },
  { label: "Travel Marketing", icon: Plane, className: "right-[2%] top-[10%] sm:right-[5%] sm:bottom-[20%] sm:top-auto", delay: 2.1, float: 1.5 },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh flex-col overflow-hidden bg-paper pt-20 sm:pt-24"
      data-testid="hero-section"
    >
      {/* headline block */}
      <motion.div style={{ opacity: fade }} className="relative z-20 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
          className="inline-block rounded-full border border-ink/25 px-5 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-ink/70"
          data-testid="hero-eyebrow"
        >
          Hello!
        </motion.span>
        <h1 className="mt-6 font-heading font-medium tracking-tight text-ink" data-testid="hero-headline">
          <MaskedLine delay={0.5} className="text-4xl sm:text-5xl lg:text-6xl">
            I'm <em className="not-italic text-terracotta">Vaibhav</em> 👋,
          </MaskedLine>
          <MaskedLine delay={0.68} className="mt-2 text-2xl sm:text-4xl lg:text-5xl">
            A Tourism &amp; Hospitality
          </MaskedLine>
          <MaskedLine delay={0.82} className="text-2xl sm:text-4xl lg:text-5xl">
            Marketing Professional
          </MaskedLine>
        </h1>
      </motion.div>

      {/* portrait + orbit */}
      <div className="relative z-10 mx-auto mt-2 w-full max-w-6xl flex-1 px-4 sm:px-6">
        <motion.div style={reduce ? undefined : { y: portraitY }} className="relative mx-auto h-[400px] max-w-3xl sm:h-[460px]">
          {/* terracotta sun */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.9, ease: EASE }}
            className="absolute bottom-0 left-1/2 aspect-square w-[280px] -translate-x-1/2 rounded-full bg-[#E87A54] sm:w-[400px]"
            aria-hidden="true"
          />
          {/* portrait — background-removed cutout */}
          <motion.img
            src="/portrait.png"
            alt="Vaibhav Kanhere"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.05, ease: EASE }}
            className="absolute bottom-0 left-1/2 h-[92%] -translate-x-1/2 object-contain object-bottom"
            data-testid="hero-portrait"
          />

          {/* floating tags */}
          {TAGS.map((t) => (
            <motion.span
              key={t.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: t.delay, ease: EASE }}
              className={`absolute z-20 ${t.className} ${t.hideOnMobile ? "hidden sm:block" : ""}`}
              data-testid={`hero-tag-${t.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <motion.span
                animate={reduce ? undefined : { y: [0, -9, 0] }}
                transition={{ repeat: Infinity, duration: 3.4 + t.float, ease: "easeInOut", delay: t.float }}
                className="flex items-center gap-2 rounded-full bg-night px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-white shadow-lg sm:text-[11px]"
              >
                <t.icon className="h-3.5 w-3.5 text-[#E87A54]" />
                {t.label}
              </motion.span>
            </motion.span>
          ))}

          {/* left positioning note */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.9, ease: EASE }}
            className="absolute bottom-[30%] -left-6 z-20 hidden w-40 lg:block xl:-left-10 xl:w-44"
            data-testid="hero-positioning-note"
          >
            <span className="font-heading text-5xl leading-none text-terracotta">“</span>
            <p className="-mt-3 text-[13px] leading-relaxed text-ink/70">
              I market travel businesses — and I build the systems behind them.
            </p>
          </motion.div>

          {/* right experience note */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 2.05, ease: EASE }}
            className="absolute right-0 top-[6%] z-20 hidden w-52 text-right lg:block"
            data-testid="hero-experience-note"
          >
            <p className="font-heading text-3xl font-medium tracking-tight text-ink">3 Systems</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Triplin · Travel CRM · Hospitality CRM
            </p>
            <p className="mt-5 font-heading text-3xl font-medium tracking-tight text-ink">2 Brands</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
              Shalom Backpackers · Moustache Escapes
            </p>
          </motion.div>

          {/* CTA pill overlapping the circle */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2, ease: EASE }}
            className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2"
          >
            <div className="flex overflow-hidden rounded-full border border-ink/70 bg-paper/80 backdrop-blur-sm">
              <button
                onClick={() => scrollToId("built")}
                className="flex items-center gap-2 whitespace-nowrap bg-[#E87A54] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-night transition-colors duration-300 hover:bg-terracotta hover:text-white sm:px-6 sm:py-3.5 sm:text-[11px]"
                data-testid="hero-cta-work"
              >
                Explore my work <ArrowUpRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollToId("contact")}
                className="whitespace-nowrap px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper sm:px-6 sm:py-3.5 sm:text-[11px]"
                data-testid="hero-cta-connect"
              >
                Let's connect
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* mobile facts strip */}
      <p className="relative z-20 mx-auto mt-4 px-6 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground lg:hidden" data-testid="hero-facts-mobile">
        3 Systems built · 2 hospitality brands · Content creator
      </p>

      <motion.button
        onClick={() => scrollToId("story")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="relative z-20 mx-auto mb-6 mt-4 flex flex-col items-center gap-1.5 text-ink/50 transition-colors hover:text-ink"
        aria-label="Scroll to story"
        data-testid="hero-scroll-cue"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}>
          <ArrowDown className="h-4 w-4" />
        </motion.span>
      </motion.button>
    </section>
  );
}
