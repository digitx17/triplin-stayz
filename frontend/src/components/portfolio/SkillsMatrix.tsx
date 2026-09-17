import { motion } from "motion/react";
import { fadeUp, staggerParent } from "@/lib/anim";
import { SKILL_CLUSTERS, TOOLS } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function SkillsMatrix() {
  return (
    <section id="skills" className="py-24 sm:py-32" data-testid="skills-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="08 — Skills" title="A system of skills." testId="skills-heading" />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="-mt-6 mb-14 max-w-2xl text-base leading-relaxed text-muted-foreground"
        >
          Not a software engineer — someone who identifies travel and hospitality problems and
          builds practical digital solutions with modern tools.
        </motion.p>

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-5 md:grid-cols-2"
        >
          {SKILL_CLUSTERS.map((cluster, i) => (
            <motion.div
              key={cluster.title}
              variants={fadeUp}
              className="rounded-md border border-sand bg-card p-7 sm:p-9"
              data-testid={`skill-cluster-${i}`}
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-heading text-2xl font-medium tracking-tight">{cluster.title}</h3>
                <span className="font-mono text-xs text-terracotta">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <motion.ul variants={staggerParent} className="mt-6 flex flex-wrap gap-2">
                {cluster.items.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={fadeUp}
                    className="rounded-full border border-sand px-3.5 py-1.5 text-sm text-ink/75 transition-colors duration-300 hover:border-terracotta hover:bg-terracotta hover:text-white"
                  >
                    {skill}
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 border-t border-sand pt-8"
          data-testid="tools-row"
        >
          <p className="mb-5 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Everyday toolkit
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            {TOOLS.map((t) => (
              <span key={t} className="font-mono text-xs uppercase tracking-[0.15em] text-ink/60 transition-colors duration-300 hover:text-terracotta">
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
