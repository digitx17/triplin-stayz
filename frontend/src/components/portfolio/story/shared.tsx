import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE, fadeUp, staggerParent } from "@/lib/anim";

export const ORANGE = "#FF6B1A";

export function WordReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.span
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.055, delayChildren: delay } } }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
    >
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: "115%" }, visible: { y: "0%", transition: { duration: 0.7, ease: EASE } } }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setVal(to);
      return;
    }
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => setVal(v) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <motion.span
      variants={fadeUp}
      className={`rounded-full px-3.5 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] transition-transform duration-300 hover:-translate-y-0.5 ${
        dark ? "border border-white/15 bg-white/10 text-white" : "bg-ink text-paper"
      }`}
    >
      {children}
    </motion.span>
  );
}

export function TagRow({ tags, dark = false }: { tags: string[]; dark?: boolean }) {
  return (
    <motion.div variants={staggerParent} className="mt-7 flex flex-wrap gap-2">
      {tags.map((t) => (
        <Tag key={t} dark={dark}>
          {t}
        </Tag>
      ))}
    </motion.div>
  );
}

export function DetailList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <motion.ul variants={staggerParent} className="mt-6 space-y-2.5">
      {items.map((d) => (
        <motion.li
          key={d}
          variants={fadeUp}
          className={`flex items-start gap-3 text-sm leading-relaxed ${dark ? "text-white/70" : "text-ink/70"}`}
        >
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ORANGE }} />
          {d}
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function SquiggleArrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" fill="none" className={className} aria-hidden="true">
      <motion.path
        d="M6 8 C 40 42, 72 44, 104 24"
        stroke={ORANGE}
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.path
        d="M93 14 L 106 23 L 94 34"
        stroke={ORANGE}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.9 }}
      />
    </svg>
  );
}

export function ParallaxImg({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  return (
    <div ref={ref} className={`img-frame ${className}`}>
      <motion.img
        style={{ y, scale: 1.18 }}
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

export function BodyText({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <motion.p
      variants={fadeUp}
      className={`mt-5 text-sm leading-relaxed sm:text-base ${dark ? "text-white/70" : "text-ink/70"}`}
    >
      {children}
    </motion.p>
  );
}

export { fadeUp, staggerParent };
