import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, TriangleAlert } from "lucide-react";
import { fadeUp, staggerParent } from "@/lib/anim";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/lib/data";
import { SectionHeading } from "./Reveal";
import { WorkflowFlow } from "./WorkflowFlow";

export function ThingsIveBuilt({ onOpenCaseStudy }: { onOpenCaseStudy: (p: Project) => void }) {
  const [marginOn, setMarginOn] = useState(false);

  return (
    <section id="built" className="bg-night py-24 text-[#F5F5F3] sm:py-32" data-testid="built-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="03 — Things I've built" title="Things I've built." dark testId="built-heading" />
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="-mt-6 mb-16 max-w-2xl font-heading text-xl italic leading-relaxed text-white/70 sm:text-2xl"
        >
          I don't just market travel businesses. I also build the systems behind them.
        </motion.p>

        <div>
          {PROJECTS.map((p) => (
            <motion.article
              key={p.id}
              variants={staggerParent}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-10 border-t border-white/10 py-16 last:border-b lg:grid-cols-12"
              data-testid={`project-card-${p.id}`}
            >
              <div className="lg:col-span-4">
                <motion.p variants={fadeUp} className="font-mono text-5xl font-light text-white/15">
                  {p.index}
                </motion.p>
                <motion.h3 variants={fadeUp} className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                  {p.title}
                </motion.h3>
                <motion.p variants={fadeUp} className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[#E87A54]">
                  {p.tagline}
                </motion.p>
                <motion.span
                  variants={fadeUp}
                  className="mt-5 inline-block rounded-full border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/60"
                >
                  {p.kind}
                </motion.span>
                <motion.p variants={fadeUp} className="mt-5 text-sm leading-relaxed text-white/65">
                  {p.intro}
                </motion.p>
                <motion.p variants={fadeUp} className="mt-4 font-heading text-base italic text-white/85">
                  “{p.positioning}”
                </motion.p>
                <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
                  {p.features.slice(0, 8).map((f) => (
                    <span key={f} className="rounded-full border border-white/12 px-3 py-1 text-[11px] text-white/55">
                      {f}
                    </span>
                  ))}
                </motion.div>
                <motion.button
                  variants={fadeUp}
                  onClick={() => onOpenCaseStudy(p)}
                  className="group mt-8 inline-flex items-center gap-2 rounded-full border border-[#E87A54] px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E87A54] transition-colors duration-300 hover:bg-[#E87A54] hover:text-night"
                  data-testid={`case-study-open-${p.id}`}
                >
                  Open case study
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </motion.button>
              </div>

              <div className="lg:col-span-8">
                <div className="rounded-lg border border-white/10 bg-coal p-5 sm:p-7">
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
                      System flow — click a node
                    </p>
                    {p.hasMarginWarning && (
                      <button
                        onClick={() => setMarginOn((v) => !v)}
                        data-testid="crm-warning-toggle"
                        className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                          marginOn
                            ? "border-red-400/60 bg-[#451A1A] text-[#FCA5A5]"
                            : "border-white/20 text-white/60 hover:border-white/40 hover:text-white"
                        }`}
                        aria-pressed={marginOn}
                      >
                        {marginOn ? "Reset healthy margin" : "Simulate low margin"}
                      </button>
                    )}
                  </div>
                  <WorkflowFlow
                    steps={p.flow}
                    testId={p.id}
                    warningIndex={p.hasMarginWarning ? 3 : -1}
                    warningOn={p.hasMarginWarning && marginOn}
                  />
                  <AnimatePresence>
                    {p.hasMarginWarning && marginOn && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        className="overflow-hidden"
                      >
                        <div
                          className="mt-4 flex items-center gap-3 rounded-md border border-red-400/50 bg-[#451A1A] px-5 py-4"
                          data-testid="crm-margin-warning"
                          role="alert"
                        >
                          <TriangleAlert className="h-5 w-5 shrink-0 text-red-300" />
                          <div>
                            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#FCA5A5]">
                              Low margin — review pricing
                            </p>
                            <p className="mt-1 text-xs text-red-200/70">
                              The margin check stopped this quotation before it went out. Adjust markup or vendor mix.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
