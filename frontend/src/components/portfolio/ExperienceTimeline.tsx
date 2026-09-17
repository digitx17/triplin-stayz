import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { EASE, fadeUp, staggerParent } from "@/lib/anim";
import { EXPERIENCE } from "@/lib/data";
import { SectionHeading } from "./Reveal";

export function ExperienceTimeline() {
  return (
    <section id="experience" className="bg-stone py-24 sm:py-32" data-testid="experience-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="03 — Experience" title="Where I've worked." testId="experience-heading" />
        <div className="space-y-20 sm:space-y-28">
          {EXPERIENCE.map((job, i) => (
            <article
              key={job.org}
              className="grid items-center gap-10 lg:grid-cols-12"
              data-testid={`experience-${job.org.toLowerCase().replace(/[^a-z]+/g, "-")}`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 1.06 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.1, ease: EASE }}
                className={`img-frame group aspect-[4/3] rounded-sm lg:col-span-7 ${i % 2 === 1 ? "lg:order-2" : ""}`}
              >
                <img
                  src={job.image}
                  alt={job.imageAlt}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105"
                />
              </motion.div>
              <motion.div
                variants={staggerParent}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                className="lg:col-span-5"
              >
                <motion.p variants={fadeUp} className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-terracotta">
                  <MapPin className="h-3.5 w-3.5" /> {job.location} · {job.tag}
                </motion.p>
                <motion.h3 variants={fadeUp} className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                  {job.org}
                </motion.h3>
                <motion.p variants={fadeUp} className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {job.role}
                </motion.p>
                <motion.p variants={fadeUp} className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {job.intro}
                </motion.p>
                <motion.ul variants={staggerParent} className="mt-6 flex flex-wrap gap-2">
                  {job.items.map((item) => (
                    <motion.li
                      key={item}
                      variants={fadeUp}
                      className="rounded-full border border-sand bg-paper px-3.5 py-1.5 text-xs text-ink/80 transition-colors duration-300 hover:border-terracotta hover:text-terracotta"
                    >
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
