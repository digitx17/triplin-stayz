import { useState } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { ImagePlus, Loader2, LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { useMedia } from "@/lib/media";
import { ContentEditor } from "@/components/admin/ContentEditor";

const TOKEN_KEY = "vk_admin_token";

export default function Admin() {
  const qc = useQueryClient();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [section, setSection] = useState("travel");
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
      throw new Error(body?.detail ?? `Request failed (${res.status})`);
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
    if (!file) {
      toast.error("Choose a file first");
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("section", section);
      fd.append("caption", caption);
      await authFetch("/media/upload", { method: "POST", body: fd });
      toast.success("Uploaded — it's live on the site");
      setFile(null);
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
            <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight" data-testid="admin-title">Add photos & videos</h1>
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
          <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
            <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-sand bg-paper px-6 py-10 text-center transition-colors hover:border-terracotta">
              <ImagePlus className="h-8 w-8 text-terracotta" />
              <span className="text-sm text-muted-foreground">
                {file ? file.name : "Click to choose an image or video (max 60MB)"}
              </span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                data-testid="admin-file-input"
              />
            </label>
            <div className="flex flex-col gap-3">
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Section</span>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                  data-testid="admin-section-select"
                >
                  <option value="travel">Travel — On the road</option>
                  <option value="marketing">Marketing — Work gallery</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Caption</span>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Rishikesh evening"
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
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {busy ? "Uploading…" : "Upload"}
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
              {m.kind === "video" ? (
                <video src={m.url} controls preload="metadata" className="aspect-square w-full object-cover" />
              ) : (
                <img src={m.url} alt={m.caption || "Uploaded media"} loading="lazy" className="aspect-square w-full object-cover" />
              )}
              <figcaption className="flex items-center justify-between gap-2 px-3 py-2">
                <span className="truncate text-xs text-muted-foreground">{m.caption || m.section}</span>
                <button
                  onClick={() => remove(m.id)}
                  aria-label="Delete"
                  className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-600"
                  data-testid={`admin-delete-${m.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </figcaption>
              <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-white">
                {m.section}
              </span>
            </figure>
          ))}
        </div>
        {media.data?.length === 0 && (
          <p className="mt-6 rounded-md border border-dashed border-sand p-10 text-center text-sm text-muted-foreground">
            Nothing uploaded yet — your first photo or video will appear here and on the site.
          </p>
        )}

        <ContentEditor token={token} />
      </div>
      <Toaster />
    </div>
  );
}
