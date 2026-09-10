import { useRef } from "react";
import { motion, useScroll } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/anim";
import { JOURNEY_STEPS } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function JourneyPathway() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.85", "end 0.55"],
  });

  return (
    <section id="story" className="py-24 sm:py-32" data-testid="story-section">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading eyebrow="01 — About" title="How I got here." testId="story-heading" />
            <motion.div
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="space-y-5 text-base leading-relaxed text-muted-foreground"
            >
              <motion.p variants={fadeUp}>
                My background sits at an unusual intersection: marketing on one side, tourism and
                hospitality on the other. Working inside hostels, restaurants and travel brands
                showed me how these businesses actually run — and where they struggle.
              </motion.p>
              <motion.p variants={fadeUp}>
                That led me somewhere most marketers don't go: building the practical digital
                systems behind travel businesses — vendor databases, costing engines, quotation
                workflows, hospitality CRMs.
              </motion.p>
              <motion.p variants={fadeUp} className="font-heading text-lg italic text-ink">
                I market travel businesses — and I build the systems behind them.
              </motion.p>
            </motion.div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <motion.ol
            ref={listRef}
            variants={staggerParent}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative space-y-10 border-l border-sand pl-8 sm:pl-12"
            data-testid="journey-path"
          >
            <motion.span
              style={{ scaleY: scrollYProgress }}
              className="absolute -left-px top-0 h-full w-px origin-top bg-terracotta"
              aria-hidden="true"
            />
            {JOURNEY_STEPS.map((s, i) => (
              <motion.li key={s.title} variants={fadeUp} className="relative">
                <span
                  className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-terracotta bg-paper sm:-left-[53px]"
                  aria-hidden="true"
                />
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">{s.title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{s.note}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
