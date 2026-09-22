import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { EASE } from "@/lib/anim";
import { useMedia } from "@/lib/media";
import type { MediaItem } from "@/lib/media";
import { SectionHeading } from "./Reveal";

const CATEGORIES = ["Photoshoot", "Website & CRM", "Graphic Design / Content", "Events", "Influencer Collab", "Listings"];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

function MediaCard({ m, i }: { m: MediaItem; i: number }) {
  return (
    <motion.figure
      key={m.id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
      data-testid={`work-media-${m.id}`}
    >
      <div className="img-frame group aspect-[4/3] rounded-sm">
        {m.kind === "video" ? (
          <video src={m.url} controls preload="metadata" className="h-full w-full object-cover" />
        ) : (
          <img src={m.url} alt={m.caption || m.brand} loading="lazy" className="h-full w-full object-cover group-hover:scale-105" />
        )}
      </div>
      {m.caption && <figcaption className="mt-3 text-sm text-muted-foreground">{m.caption}</figcaption>}
    </motion.figure>
  );
}

export function MarketingGallery() {
  const media = (useMedia().data ?? []).filter((m) => m.brand !== "site-assets");
  const [cat, setCat] = useState<string | null>(null);
  const [brand, setBrand] = useState<string | null>(null);

  const catMedia = cat ? media.filter((m) => m.category === cat) : [];
  const brands = Array.from(new Set(catMedia.map((m) => m.brand)));
  const brandMedia = brand ? catMedia.filter((m) => m.brand === brand) : [];

  return (
    <section id="gallery" className="py-24 sm:py-32" data-testid="work-gallery">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="04 — Marketing Work" title="Marketing work." testId="gallery-heading" />

        <div className="mb-10 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground" data-testid="work-breadcrumb">
          <button
            onClick={() => { setCat(null); setBrand(null); }}
            className={!cat ? "text-ink" : "transition-colors hover:text-terracotta"}
            data-testid="work-crumb-all"
          >
            All work
          </button>
          {cat && (
            <>
              <span>/</span>
              <button
                onClick={() => setBrand(null)}
                className={!brand ? "text-ink" : "transition-colors hover:text-terracotta"}
                data-testid="work-crumb-cat"
              >
                {cat}
              </button>
            </>
          )}
          {brand && (
            <>
              <span>/</span>
              <span className="text-ink">{brand}</span>
            </>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!cat && (
            <motion.div key="cats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((c) => {
                const n = media.filter((m) => m.category === c).length;
                return (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="group rounded-md border border-sand bg-card p-7 text-left transition-colors duration-300 hover:border-terracotta"
                    data-testid={`cat-${slug(c)}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="font-heading text-2xl font-medium tracking-tight">{c}</p>
                      <ArrowUpRight className="h-5 w-5 text-terracotta opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </div>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {n > 0 ? `${n} ${n === 1 ? "piece" : "pieces"}` : "Add work via dashboard"}
                    </p>
                  </button>
                );
              })}
            </motion.div>
          )}

          {cat && !brand && (
            <motion.div key="brands" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="brand-list">
                {brands.map((b) => {
                  const n = catMedia.filter((m) => m.brand === b).length;
                  return (
                    <button
                      key={b}
                      onClick={() => setBrand(b)}
                      className="group rounded-md border border-sand bg-card p-7 text-left transition-colors duration-300 hover:border-terracotta"
                      data-testid={`brand-${slug(b)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="font-heading text-2xl font-medium tracking-tight">{b}</p>
                        <ArrowUpRight className="h-5 w-5 text-terracotta opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>
                      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {n} {n === 1 ? "piece" : "pieces"}
                      </p>
                    </button>
                  );
                })}
              </div>
              {brands.length === 0 && (
                <p className="rounded-md border border-dashed border-sand p-10 text-center text-sm text-muted-foreground" data-testid="brand-empty">
                  Nothing here yet — add {cat} work from the dashboard.
                </p>
              )}
            </motion.div>
          )}

          {cat && brand && (
            <motion.div key="media" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              <button
                onClick={() => setBrand(null)}
                className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-terracotta"
                data-testid="work-back-brands"
              >
                <ArrowLeft className="h-4 w-4" /> All {cat} brands
              </button>
              <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {brandMedia.map((m, i) => (
                  <MediaCard key={m.id} m={m} i={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground" data-testid="gallery-note">
          Real deliverables only — added from the private dashboard.
        </p>
      </div>
    </section>
  );
}
