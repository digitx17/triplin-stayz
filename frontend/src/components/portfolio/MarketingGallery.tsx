import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EASE } from "@/lib/anim";
import { WORK_FILTERS, WORK_ITEMS } from "@/lib/data";
import type { WorkItem } from "@/lib/data";
import { useMedia } from "@/lib/media";
import { SectionHeading } from "./Reveal";

export function MarketingGallery() {
  const [filter, setFilter] = useState("All");
  const uploads = (useMedia().data ?? []).map<WorkItem>((m) => ({
    title: m.caption || "Uploaded work",
    categories: ["Graphic Design / Content"],
    medium: m.kind === "video" ? "Video — my upload" : "Photo — my upload",
    image: m.url,
    note: "Added from the media dashboard",
    kind: m.kind,
  }));
  const all = [...uploads, ...WORK_ITEMS];
  const items = filter === "All" ? all : all.filter((w) => w.categories.includes(filter));

  return (
    <section id="gallery" className="py-24 sm:py-32" data-testid="work-gallery">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="04 — Marketing Work" title="Marketing work." testId="gallery-heading" />

        <div className="mb-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter work">
          {WORK_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              role="tab"
              aria-selected={filter === f}
              data-testid={`filter-${f.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={`rounded-full border px-5 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                filter === f
                  ? "border-ink bg-ink text-paper"
                  : "border-sand text-muted-foreground hover:border-ink hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {items.map((it, i) => (
              <motion.figure
                layout
                key={it.title}
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
                data-testid={`work-item-${it.title.toLowerCase().replace(/[^a-z]+/g, "-").slice(0, 30)}`}
              >
                <div className="img-frame group aspect-[4/3] rounded-sm">
                  {it.kind === "video" ? (
                    <video src={it.image} controls preload="metadata" className="h-full w-full object-cover" />
                  ) : (
                    <img
                      src={it.image}
                      alt={it.title}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105"
                    />
                  )}
                </div>
                <figcaption className="mt-4">
                  <div className="flex flex-wrap gap-1.5">
                    {it.categories.map((c) => (
                      <span key={c} className="rounded-full bg-stone px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">
                        {c}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-3 font-heading text-xl font-medium tracking-tight">{it.title}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-terracotta">{it.medium}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{it.note}</p>
                </figcaption>
              </motion.figure>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground" data-testid="gallery-placeholder-note">
          Visuals shown are curated placeholder imagery — original campaign creatives can be dropped in.
        </p>
      </div>
    </section>
  );
}
