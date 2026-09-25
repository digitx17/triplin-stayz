import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { EASE } from "@/lib/anim";
import { apiGet } from "@/lib/api";
import type { MediaItem } from "@/lib/media";
import { embedSrc } from "@/lib/media";
import { startPageScroll, stopPageScroll } from "@/lib/smoothScroll";

export interface ProjectRef {
  num: string;
  title: string;
  category: string;
}

function Tile({ m, onZoom }: { m: MediaItem; onZoom?: () => void }) {
  if (m.kind === "video") {
    return <video src={m.url} controls preload="metadata" className="aspect-video w-full rounded-sm bg-black object-cover" />;
  }
  if (m.kind === "embed") {
    const tall = m.provider === "instagram";
    return (
      <iframe
        src={embedSrc(m)}
        title={m.caption || m.brand}
        loading="lazy"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className={`w-full rounded-sm border border-ink/10 bg-white ${tall ? "aspect-[4/5]" : "aspect-video"}`}
      />
    );
  }
  return (
    <button
      onClick={onZoom}
      className="group relative block w-full cursor-zoom-in"
      aria-label={`View ${m.caption || m.brand} full screen`}
      data-testid={`project-zoom-${m.id}`}
    >
      <img src={m.url} alt={m.caption || m.brand} loading="lazy" className="aspect-video w-full rounded-sm object-cover" />
      <span className="absolute inset-0 flex items-center justify-center rounded-sm bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/25 group-hover:opacity-100">
        <ZoomIn className="h-6 w-6 text-white" />
      </span>
    </button>
  );
}

function Lightbox({ items, index, onClose, onNav }: { items: MediaItem[]; index: number; onClose: () => void; onNav: (d: 1 | -1) => void }) {
  const m = items[index];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 sm:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      data-testid="lightbox"
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/80 transition-colors hover:border-white hover:text-white"
        data-testid="lightbox-close"
      >
        <X className="h-4 w-4" /> Close
      </button>
      {items.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onNav(-1); }}
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white sm:left-6"
            aria-label="Previous photo"
            data-testid="lightbox-prev"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNav(1); }}
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 text-white/80 transition-colors hover:border-white hover:text-white sm:right-6"
            aria-label="Next photo"
            data-testid="lightbox-next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <figure onClick={(e) => e.stopPropagation()} className="flex max-h-full max-w-5xl flex-col items-center">
        <motion.img
          key={m.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: EASE }}
          src={m.url}
          alt={m.caption || m.brand}
          className="max-h-[78vh] w-auto max-w-full rounded-md object-contain"
        />
        {(m.group || m.caption) && (
          <figcaption className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/70">
            {[m.group, m.caption].filter(Boolean).join("  —  ")}
          </figcaption>
        )}
      </figure>
      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/50" data-testid="lightbox-counter">
        {index + 1} / {items.length}
      </span>
    </motion.div>
  );
}

function BrandSection({ brand, items }: { brand: string; items: MediaItem[] }) {
  const [filter, setFilter] = useState("All");
  const [zoom, setZoom] = useState<number | null>(null);
  const groups = [...new Set(items.map((m) => m.group).filter(Boolean))];
  const loose = items.some((m) => !m.group);
  const pills = ["All", ...groups, ...(loose ? ["More"] : [])];
  const visible = filter === "All" ? items : filter === "More" ? items.filter((m) => !m.group) : items.filter((m) => m.group === filter);
  const photos = visible.filter((m) => m.kind === "image");

  return (
    <section className="mb-12" data-testid={`project-brand-${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      <div className="mb-5 flex items-baseline gap-3 border-b border-sand pb-3">
        <h3 className="font-heading text-2xl font-medium tracking-tight">{brand}</h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>
      {pills.length > 2 && (
        <div className="mb-6 flex flex-wrap gap-2" data-testid="project-filters">
          {pills.map((p) => (
            <button
              key={p}
              onClick={() => { setFilter(p); setZoom(null); }}
              className={`rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors duration-300 ${
                filter === p
                  ? "bg-terracotta text-white"
                  : "border border-ink/20 bg-white/70 text-ink/60 hover:border-ink hover:text-ink"
              }`}
              data-testid={`project-filter-${p.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((m) => (
          <figure key={m.id} data-testid={`project-media-${m.id}`}>
            <Tile m={m} onZoom={m.kind === "image" ? () => setZoom(photos.indexOf(m)) : undefined} />
            {m.caption && <figcaption className="mt-2 text-xs text-muted-foreground">{m.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <AnimatePresence>
        {zoom !== null && photos[zoom] && (
          <Lightbox
            items={photos}
            index={zoom}
            onClose={() => setZoom(null)}
            onNav={(d) => setZoom((z) => (z === null ? null : (z + d + photos.length) % photos.length))}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

export function ProjectMediaModal({ project, onClose }: { project: ProjectRef | null; onClose: () => void }) {
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

  const q = useQuery({
    queryKey: ["media", "project", project?.category ?? ""],
    queryFn: () => apiGet<MediaItem[]>(`/media?category=${encodeURIComponent(project!.category)}`),
    enabled: !!project,
    staleTime: 30_000,
  });

  const brands = new Map<string, MediaItem[]>();
  for (const m of q.data ?? []) {
    const list = brands.get(m.brand) ?? [];
    list.push(m);
    brands.set(m.brand, list);
  }

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key={project.num}
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 32 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed inset-0 z-[90] flex flex-col bg-[#FAFAF8] text-ink"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} project media`}
          data-testid="project-modal"
        >
          <header className="flex items-center justify-between border-b border-sand px-4 py-4 sm:px-8">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-sm text-terracotta">{project.num}</span>
              <span className="font-heading text-xl font-medium tracking-tight sm:text-2xl">{project.title}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                {project.category} · Project media
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 rounded-full border border-sand px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors hover:border-ink"
              data-testid="project-modal-close"
            >
              <X className="h-4 w-4" /> Close
            </button>
          </header>

          <div className="flex-1 overflow-y-auto" data-testid="project-modal-scroll">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
              {q.isLoading && (
                <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">Loading media…</p>
              )}
              {q.isError && (
                <p className="py-16 text-center text-sm text-destructive" data-testid="project-modal-error">
                  Couldn't load media right now — please try again.
                </p>
              )}
              {q.data && brands.size === 0 && (
                <div className="rounded-md border border-dashed border-sand py-16 text-center" data-testid="project-modal-empty">
                  <p className="font-heading text-xl text-ink/80">Nothing uploaded for {project.category} yet.</p>
                  <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
                    Photos, videos and Instagram / YouTube embeds for this category can be added from the admin
                    dashboard — they'll appear here grouped by brand.
                  </p>
                </div>
              )}
              {[...brands.entries()].map(([brand, items]) => (
                <BrandSection key={brand} brand={brand} items={items} />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
