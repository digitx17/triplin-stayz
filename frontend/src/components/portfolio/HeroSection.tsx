import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { EASE } from "@/lib/anim";
import { IMG } from "@/lib/data";
import { scrollToId } from "@/lib/smoothScroll";
import { MaskedLine } from "./Reveal";

const HEADLINE = ["Travel, hospitality &", "marketing — built", "from experience."];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section ref={ref} id="top" className="relative h-svh min-h-[640px] overflow-hidden bg-night" data-testid="hero-section">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.img
          src={IMG.heroRoad}
          alt="A winding mountain highway under dramatic evening light"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.06 }}
          transition={{ duration: 2.6, ease: EASE }}
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,16,18,0.72) 0%, rgba(14,16,18,0.5) 45%, rgba(14,16,18,0.88) 100%)",
        }}
      />
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-[#E87A54]"
          data-testid="hero-eyebrow"
        >
          Portfolio — Vaibhav Kanhere
        </motion.p>
        <h1 className="max-w-4xl font-heading text-4xl font-normal leading-[1.08] tracking-tight text-[#FDFDFD] sm:text-5xl lg:text-6xl" data-testid="hero-headline">
          {HEADLINE.map((line, i) => (
            <MaskedLine key={line} delay={0.55 + i * 0.14}>
              {i === 2 ? <em className="text-[#E87A54] not-italic">{line}</em> : line}
            </MaskedLine>
          ))}
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.35, ease: EASE }}
          className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div>
            <p className="font-heading text-xl text-[#FDFDFD]" data-testid="hero-name">Vaibhav Kanhere</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-white/70" data-testid="hero-roles">
              Tourism & Hospitality Marketing · Content Creator · Travel Product Builder
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              I work across hospitality marketing, content, travel operations and the digital
              systems that make travel businesses work better.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollToId("built")}
              className="group rounded-full bg-[#E87A54] px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-night transition-transform duration-300 hover:-translate-y-0.5"
              data-testid="hero-cta-work"
            >
              Explore my work
            </button>
            <button
              onClick={() => scrollToId("contact")}
              className="rounded-full border border-white/35 px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-white/10"
              data-testid="hero-cta-connect"
            >
              Let's connect
            </button>
          </div>
        </motion.div>
      </motion.div>
      <motion.button
        onClick={() => scrollToId("story")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-white sm:flex"
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
