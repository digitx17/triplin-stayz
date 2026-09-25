import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
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

function Tile({ m }: { m: MediaItem }) {
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
  return <img src={m.url} alt={m.caption || m.brand} loading="lazy" className="aspect-video w-full rounded-sm object-cover" />;
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
              {[...brands.entries()].map(([brand, items]) => {
                const groups = new Map<string, MediaItem[]>();
                const loose: MediaItem[] = [];
                for (const m of items) {
                  if (m.group) {
                    const list = groups.get(m.group) ?? [];
                    list.push(m);
                    groups.set(m.group, list);
                  } else {
                    loose.push(m);
                  }
                }
                const tileGrid = (list: MediaItem[]) => (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((m) => (
                      <figure key={m.id} data-testid={`project-media-${m.id}`}>
                        <Tile m={m} />
                        {m.caption && <figcaption className="mt-2 text-xs text-muted-foreground">{m.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                );
                return (
                  <section key={brand} className="mb-12" data-testid={`project-brand-${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                    <div className="mb-5 flex items-baseline gap-3 border-b border-sand pb-3">
                      <h3 className="font-heading text-2xl font-medium tracking-tight">{brand}</h3>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                    {loose.length > 0 && tileGrid(loose)}
                    {[...groups.entries()].map(([g, gitems]) => (
                      <div key={g} className="mt-8 first:mt-0" data-testid={`project-group-${g.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                        <h4 className="mb-4 flex items-center gap-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-terracotta">
                          <span className="h-[2px] w-6 bg-terracotta" />
                          {g}
                          <span className="font-normal text-ink/40">{gitems.length}</span>
                        </h4>
                        {tileGrid(gitems)}
                      </div>
                    ))}
                  </section>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
