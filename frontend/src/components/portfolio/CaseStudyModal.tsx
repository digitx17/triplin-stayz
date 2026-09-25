import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { EASE } from "@/lib/anim";
import type { Project } from "@/lib/data";
import { startPageScroll, stopPageScroll } from "@/lib/smoothScroll";

export function CaseStudyModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    stopPageScroll();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      startPageScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  const jumpTo = (num: string) => {
    const el = scrollRef.current?.querySelector(`[data-chapter="${num}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-0 z-[90] flex flex-col bg-[#FAFAF8] text-ink"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} case study`}
          data-testid={`case-study-${project.id}`}
        >
          <header className="flex items-center justify-between border-b border-sand px-4 py-4 sm:px-8">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-terracotta">{project.index}</span>
              <span className="font-heading text-xl font-medium tracking-tight sm:text-2xl">{project.title}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                {project.kind} · Case study
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-sand px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors hover:border-ink"
              data-testid="case-study-close"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </header>
          <div className="flex min-h-0 flex-1">
            <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-sand bg-[#F3EFEA] p-6 lg:block">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Chapters</p>
              <nav className="space-y-1" aria-label="Case study chapters">
                {project.chapters.map((ch) => (
                  <button
                    key={ch.num}
                    onClick={() => jumpTo(ch.num)}
                    className="block w-full rounded px-2 py-1.5 text-left text-sm text-ink/70 transition-colors hover:bg-paper hover:text-terracotta"
                    data-testid={`chapter-nav-${project.id}-${ch.num}`}
                  >
                    <span className="mr-2 font-mono text-[10px] text-terracotta">{ch.num}</span>
                    {ch.title}
                  </button>
                ))}
              </nav>
            </aside>
            <div ref={scrollRef} className="flex-1 overflow-y-auto" data-testid="case-study-scroll">
              <div className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-terracotta">{project.tagline}</p>
                <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight sm:text-5xl">{project.title}</h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">{project.intro}</p>

                {project.chapters.map((ch) => (
                  <section key={ch.num} data-chapter={ch.num} className="mt-16 scroll-mt-8 border-t border-sand pt-10">
                    <p className="font-mono text-xs font-semibold tracking-[0.25em] text-terracotta">{ch.num}</p>
                    <h3 className="mt-2 font-heading text-2xl font-medium tracking-tight sm:text-3xl">{ch.title}</h3>
                    {ch.paragraphs.map((para, i) => (
                      <p key={i} className="mt-4 text-base leading-relaxed text-ink/75">
                        {para}
                      </p>
                    ))}
                    {ch.screens && (
                      <div className="mt-8 grid gap-4 sm:grid-cols-2">
                        {ch.screens.map((label) => (
                          <div
                            key={label}
                            className="flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-ink/25 bg-stone/60 p-4 text-center"
                            data-testid={`screen-placeholder-${project.id}-${label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                          >
                            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                              Interface placeholder
                            </span>
                            <span className="font-heading text-lg text-ink/80">{label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))}
                <p className="mt-16 border-t border-sand pt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                  End of case study — {project.title}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
