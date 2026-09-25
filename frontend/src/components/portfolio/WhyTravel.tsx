import { useRef } from "react";
import type { ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/anim";

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

export function WhyTravel() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["5%", "-8%"]);
  const compassRotate = useTransform(scrollYProgress, [0, 1], [-40, 140]);

  return (
    <section
      id="why"
      ref={ref}
      className="grain relative overflow-hidden border-y border-sand bg-white py-24 sm:py-32"
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
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-8 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-terracotta"
        >
          06 — Why travel?
        </motion.p>

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

        <div className="mt-12 grid gap-10 text-base leading-relaxed text-muted-foreground sm:grid-cols-2">
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

        <div className="relative mt-12 pl-6">
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="absolute left-0 top-0 h-full w-[2px] origin-top bg-terracotta"
          />
          <span className="block overflow-hidden">
            <motion.p
              initial={{ y: "60%", opacity: 0 }}
              whileInView={{ y: "0%", opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.25, ease: EASE }}
              className="font-heading text-lg italic text-ink"
            >
              I'm not chasing a title. I'm building toward something simple: travel businesses that
              market beautifully and run properly.
            </motion.p>
          </span>
        </div>
      </div>
    </section>
  );
}
