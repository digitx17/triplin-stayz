import { motion, useInView } from "motion/react";
import { useRef } from "react";
import type { ReactNode } from "react";
import { EASE, fadeUp } from "@/lib/anim";

export function MaskedLine({
  children,
  delay = 0,
  inView = false,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  inView?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-60px" });
  const show = inView ? seen : true;
  return (
    <span ref={ref} className={`block overflow-hidden pb-[0.1em] -mb-[0.1em] ${className}`}>
      <motion.span
        className="block will-change-transform"
        initial={{ y: "115%" }}
        animate={show ? { y: "0%" } : { y: "115%" }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function SectionHeading({
  title,
  dark = false,
  testId,
}: {
  eyebrow?: string;
  title: string;
  dark?: boolean;
  testId?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="mb-10"
      data-testid={testId}
    >
      <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight leading-snug">
        {title}
      </h2>
    </motion.div>
  );
}
