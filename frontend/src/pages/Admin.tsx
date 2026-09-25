import { useState } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ImagePlus, Instagram, Link2, Loader2, LogOut, Trash2, Youtube } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useMedia, embedThumb } from "@/lib/media";
import type { MediaItem } from "@/lib/media";
import { useSiteContent } from "@/lib/content";
import { SKILL_CARD_BRANDS } from "@/lib/marketingData";
import { ContentEditor } from "@/components/admin/ContentEditor";

const TOKEN_KEY = "vk_admin_token";

function MediaThumb({ m }: { m: MediaItem }) {
  if (m.kind === "video") {
    return <video src={m.url} controls preload="metadata" className="aspect-square w-full object-cover" />;
  }
  if (m.kind === "embed") {
    const thumb = embedThumb(m);
    const inner = (
      <>
        {thumb ? (
          <img src={thumb} alt={m.caption || m.brand} loading="lazy" className="aspect-square w-full object-cover" />
        ) : (
          <span className="flex aspect-square w-full flex-col items-center justify-center gap-2 bg-ink text-paper">
            {m.provider === "instagram" ? <Instagram className="h-6 w-6" /> : <Youtube className="h-6 w-6" />}
            <span className="font-mono text-[9px] uppercase tracking-[0.2em]">{m.provider} embed</span>
          </span>
        )}
        <span className="absolute right-2 top-2 rounded-full bg-terracotta px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white">
          {m.provider}
        </span>
      </>
    );
    return (
      <a href={m.url} target="_blank" rel="noreferrer" className="relative block" data-testid={`admin-embed-${m.id}`}>
        {inner}
      </a>
    );
  }
  return <img src={m.url} alt={m.caption || "Uploaded media"} loading="lazy" className="aspect-square w-full object-cover" />;
}

export default function Admin() {
  const qc = useQueryClient();
  const { content } = useSiteContent();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"file" | "link">("file");
  const [files, setFiles] = useState<File[]>([]);
  const [linkUrl, setLinkUrl] = useState("");
  const [category, setCategory] = useState("Photoshoot");
  const [brand, setBrand] = useState("");
  const [sectionGroup, setSectionGroup] = useState("");
  const [caption, setCaption] = useState("");
  const [busy, setBusy] = useState(false);

  const media = useMedia();

  const authFetch = async (path: string, init: RequestInit) => {
    const res = await fetch(`/api${path}`, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) },
    });
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        throw new Error("Session expired — log in again");
      }
      const body = await res.json().catch(() => null);
      const detail = body?.detail;
      throw new Error(typeof detail === "string" ? detail : `Request failed (${res.status})`);
    }
    return res.json();
  };

  const login = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.detail ?? "Login failed");
      localStorage.setItem(TOKEN_KEY, body.token);
      setToken(body.token);
      toast.success("Welcome back");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  const upload = async (e: FormEvent) => {
    e.preventDefault();
    if (mode === "link" && !linkUrl.trim()) {
      toast.error("Paste an Instagram or YouTube link first");
      return;
    }
    if (mode === "file" && files.length === 0) {
      toast.error("Choose a file first");
      return;
    }
    setBusy(true);
    try {
      if (mode === "link") {
        await authFetch("/media/link", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: linkUrl.trim(), category, brand: brand || "General", caption, group: sectionGroup }),
        });
        toast.success("Embed added — it's live on the site");
        setLinkUrl("");
      } else {
        let ok = 0;
        let failed = 0;
        for (const f of files) {
          try {
            const fd = new FormData();
            fd.append("file", f);
            fd.append("category", category);
            fd.append("brand", brand || "General");
            fd.append("caption", caption);
            fd.append("group", sectionGroup);
            await authFetch("/media/upload", { method: "POST", body: fd });
            ok += 1;
          } catch {
            failed += 1;
          }
        }
        if (failed === 0) {
          toast.success(ok === 1 ? "Uploaded — it's live on the site" : `${ok} files uploaded — they're live on the site`);
        } else {
          toast.error(`${failed} of ${files.length} files failed — the rest are live`);
        }
        setFiles([]);
      }
      setSectionGroup("");
      setCaption("");
      await qc.invalidateQueries({ queryKey: ["media"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await authFetch(`/media/${id}`, { method: "DELETE" });
      toast.success("Removed from the site");
      await qc.invalidateQueries({ queryKey: ["media"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const patchMedia = async (id: string, body: Record<string, string>) => {
    try {
      await authFetch(`/media/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      toast.success("Section saved");
      await qc.invalidateQueries({ queryKey: ["media"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-4">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={login}
          className="w-full max-w-sm rounded-lg border border-sand bg-white p-8 shadow-sm"
          data-testid="admin-login-form"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">Vaibhav · Media dashboard</p>
          <h1 className="mt-3 font-heading text-2xl font-medium">Admin login</h1>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="mt-6 w-full rounded-md border border-sand bg-paper px-4 py-3 text-sm outline-none focus:border-terracotta"
            data-testid="admin-password-input"
          />
          <button
            type="submit"
            disabled={busy}
            className="mt-4 w-full rounded-full bg-ink py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-opacity disabled:opacity-50"
            data-testid="admin-login-button"
          >
            {busy ? "Checking…" : "Log in"}
          </button>
          <a href="/" className="mt-4 block text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-ink">
            ← Back to site
          </a>
        </motion.form>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-terracotta">Vaibhav · Media dashboard</p>
            <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight" data-testid="admin-title">Add photos, videos & embeds</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Uploads go live instantly in the Marketing work gallery on the site.
            </p>
          </div>
          <div className="flex gap-2">
            <a href="/" className="rounded-full border border-sand px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] hover:border-ink" data-testid="admin-back-link">
              View site
            </a>
            <button
              onClick={() => { localStorage.removeItem(TOKEN_KEY); setToken(null); }}
              className="flex items-center gap-2 rounded-full border border-sand px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] hover:border-ink"
              data-testid="admin-logout-button"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </div>

        <form onSubmit={upload} className="mt-10 rounded-lg border border-sand bg-white p-6 sm:p-8" data-testid="admin-upload-form">
          <div className="mb-5 flex gap-2">
            <button
              type="button"
              onClick={() => setMode("file")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${mode === "file" ? "bg-ink text-paper" : "border border-sand text-muted-foreground hover:border-ink"}`}
              data-testid="admin-mode-file"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Upload file
            </button>
            <button
              type="button"
              onClick={() => setMode("link")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] transition-colors ${mode === "link" ? "bg-ink text-paper" : "border border-sand text-muted-foreground hover:border-ink"}`}
              data-testid="admin-mode-link"
            >
              <Link2 className="h-3.5 w-3.5" /> Instagram / YouTube link
            </button>
          </div>
          <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
            {mode === "file" ? (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-sand bg-paper px-6 py-10 text-center transition-colors hover:border-terracotta">
                <ImagePlus className="h-8 w-8 text-terracotta" />
                <span className="text-sm text-muted-foreground">
                  {files.length > 1
                    ? `${files.length} files selected`
                    : files[0]?.name ?? "Click to choose one or more images or videos (max 60MB each)"}
                </span>
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                  data-testid="admin-file-input"
                />
              </label>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-sand bg-paper px-6 py-10">
                <Link2 className="h-8 w-8 text-terracotta" />
                <input
                  type="url"
                  required
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://www.instagram.com/reel/… or https://youtu.be/…"
                  className="w-full max-w-md rounded-md border border-sand bg-white px-4 py-3 text-sm outline-none focus:border-terracotta"
                  data-testid="admin-link-input"
                />
                <span className="text-xs text-muted-foreground">Reels, posts and videos embed directly on the site</span>
              </label>
            )}
            <div className="flex flex-col gap-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Category</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                  data-testid="admin-category-select"
                >
                  {content.categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Brand</span>
                {category === "Skill Cards" ? (
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                    data-testid="admin-brand-input"
                  >
                    <option value="">Choose a skill card…</option>
                    {SKILL_CARD_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Shalom Backpackers"
                    maxLength={60}
                    list="brand-list"
                    className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                    data-testid="admin-brand-input"
                  />
                )}
                <datalist id="brand-list">
                  {Array.from(new Set((media.data ?? []).map((m) => m.brand))).map((b) => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Section (optional)</span>
                <input
                  value={sectionGroup}
                  onChange={(e) => setSectionGroup(e.target.value)}
                  placeholder="e.g. Cafe, Rooms"
                  maxLength={60}
                  list="group-list"
                  className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                  data-testid="admin-group-input"
                />
                <datalist id="group-list">
                  {Array.from(new Set((media.data ?? []).map((m) => m.group).filter(Boolean))).map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Caption</span>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Rooftop cafe shoot"
                  maxLength={140}
                  className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                  data-testid="admin-caption-input"
                />
              </label>
              <button
                type="submit"
                disabled={busy}
                className="mt-auto flex items-center justify-center gap-2 rounded-full bg-ink py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-opacity disabled:opacity-50"
                data-testid="admin-upload-button"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "link" ? <Link2 className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
                {busy ? "Saving…" : mode === "link" ? "Add embed" : files.length > 1 ? `Upload ${files.length} files` : "Upload"}
              </button>
            </div>
          </div>
        </form>

        <h2 className="mt-12 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Your uploads ({media.data?.length ?? 0})
        </h2>
        {media.isError && (
          <p className="mt-4 text-sm text-destructive" data-testid="admin-media-error">Couldn't load uploads right now.</p>
        )}
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" data-testid="admin-media-grid">
          {(media.data ?? []).map((m) => (
            <figure key={m.id} className="group relative overflow-hidden rounded-md border border-sand bg-white" data-testid={`admin-media-${m.id}`}>
              <MediaThumb m={m} />
              <figcaption className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs text-muted-foreground">{m.caption || m.brand}</span>
                <button
                  onClick={() => remove(m.id)}
                  aria-label="Delete"
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                  data-testid={`admin-delete-${m.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </figcaption>
              <input
                key={`${m.id}-${m.group}`}
                defaultValue={m.group}
                placeholder="Section — e.g. Cafe, Rooms"
                maxLength={60}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v !== m.group) patchMedia(m.id, { group: v });
                }}
                className="w-full border-t border-sand/70 bg-paper/60 px-3 py-1.5 text-[11px] text-muted-foreground outline-none placeholder:text-ink/25 focus:text-ink"
                data-testid={`admin-group-${m.id}`}
              />
              <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white">
                {m.brand} · {m.category}
              </span>
            </figure>
          ))}
        </div>
        {media.data?.length === 0 && (
          <p className="mt-6 rounded-md border border-dashed border-sand p-10 text-center text-sm text-muted-foreground">
            Nothing uploaded yet — your first photo, video or embed will appear here and on the site.
          </p>
        )}

        <ContentEditor token={token} />
      </div>
      <Toaster />
    </div>
  );
}
