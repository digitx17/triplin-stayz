import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImageUp, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useSiteContent } from "@/lib/content";
import type { SkillCluster } from "@/lib/content";

function ExperienceImageField({
  label,
  value,
  uploading,
  onPick,
  testId,
}: {
  label: string;
  value: string;
  uploading: boolean;
  onPick: (file: File) => void;
  testId: string;
}) {
  return (
    <div className="rounded-md border border-sand bg-white p-5" data-testid={testId}>
      <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label} photo
      </span>
      <div className="flex items-center gap-4">
        <img
          src={value}
          alt={`${label} experience`}
          className="h-20 w-24 shrink-0 rounded-sm border border-sand object-cover"
          data-testid={`${testId}-preview`}
        />
        <label className="flex cursor-pointer items-center gap-2 rounded-full border border-sand px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em] transition-colors hover:border-terracotta">
          {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageUp className="h-3.5 w-3.5" />}
          {uploading ? "Uploading…" : "Change photo"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
              e.target.value = "";
            }}
            data-testid={`${testId}-input`}
          />
        </label>
      </div>
    </div>
  );
}

export function ContentEditor({ token }: { token: string }) {
  const qc = useQueryClient();
  const { content } = useSiteContent();
  const [skills, setSkills] = useState<SkillCluster[] | null>(null);
  const [toolkit, setToolkit] = useState<string | null>(null);
  const [categories, setCategories] = useState<string | null>(null);
  const [experience, setExperience] = useState<{ shalom: string; moustache: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const currentSkills = skills ?? content.skills;
  const currentToolkit = toolkit ?? content.toolkit.join(", ");
  const currentCategories = categories ?? content.categories.join(", ");
  const currentExp = experience ?? content.experience;

  const uploadAsset = async (file: File, key: "shalom" | "moustache") => {
    setUploading(key);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", "Listings");
      fd.append("brand", "site-assets");
      fd.append("caption", "experience image");
      const res = await fetch("/api/media/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const item = await res.json();
      setExperience({ ...currentExp, [key]: item.url });
      toast.success("Image uploaded — press Save content to publish");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          skills: currentSkills.map((c) => ({
            title: c.title,
            items: c.items.map((i) => i.trim()).filter(Boolean),
          })),
          toolkit: currentToolkit.split(",").map((t) => t.trim()).filter(Boolean),
          categories: currentCategories.split(",").map((t) => t.trim()).filter(Boolean),
          experience: currentExp,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Content updated — live on the site");
      await qc.invalidateQueries({ queryKey: ["site-content"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const setCluster = (i: number, patch: Partial<SkillCluster>) => {
    const next = currentSkills.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    setSkills(next);
  };

  return (
    <div className="mt-14 border-t border-sand pt-10" data-testid="content-editor">
      <h2 className="font-heading text-2xl font-medium tracking-tight">Edit site content</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Experience photos, gallery categories, skills clusters and the toolkit strip — changes go live when you save.
      </p>

      <h3 className="mt-8 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Experience photos
      </h3>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        <ExperienceImageField
          label="Shalom Backpackers"
          value={currentExp.shalom}
          uploading={uploading === "shalom"}
          onPick={(f) => uploadAsset(f, "shalom")}
          testId="exp-image-shalom"
        />
        <ExperienceImageField
          label="Moustache Escapes"
          value={currentExp.moustache}
          uploading={uploading === "moustache"}
          onPick={(f) => uploadAsset(f, "moustache")}
          testId="exp-image-moustache"
        />
      </div>

      <label className="mt-6 block rounded-md border border-sand bg-white p-5">
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Gallery categories (comma separated)
        </span>
        <textarea
          rows={2}
          value={currentCategories}
          onChange={(e) => setCategories(e.target.value)}
          className="w-full resize-none rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
          data-testid="content-categories-input"
        />
        <span className="mt-2 block text-xs text-muted-foreground">
          These are the categories you can tag uploads with, and the buckets shown in the Marketing work gallery.
        </span>
      </label>

      <h3 className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        Skills clusters
      </h3>
      <div className="mt-4 grid gap-5 md:grid-cols-2">
        {currentSkills.map((cluster, i) => (
          <div key={i} className="rounded-md border border-sand bg-white p-5" data-testid={`content-cluster-${i}`}>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Cluster {i + 1} title
              </span>
              <input
                value={cluster.title}
                onChange={(e) => setCluster(i, { title: e.target.value })}
                className="w-full rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                data-testid={`content-skill-title-${i}`}
              />
            </label>
            <label className="mt-4 block">
              <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Skills (comma separated)
              </span>
              <textarea
                rows={4}
                value={cluster.items.join(", ")}
                onChange={(e) => setCluster(i, { items: e.target.value.split(",") })}
                className="w-full resize-none rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
                data-testid={`content-skill-items-${i}`}
              />
            </label>
          </div>
        ))}
      </div>

      <label className="mt-6 block rounded-md border border-sand bg-white p-5">
        <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Toolkit strip items (comma separated)
        </span>
        <textarea
          rows={3}
          value={currentToolkit}
          onChange={(e) => setToolkit(e.target.value)}
          className="w-full resize-none rounded-md border border-sand bg-paper px-3 py-2.5 text-sm outline-none focus:border-terracotta"
          data-testid="content-toolkit-input"
        />
      </label>

      <button
        onClick={save}
        disabled={saving}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-paper transition-opacity disabled:opacity-50"
        data-testid="content-save-button"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Saving…" : "Save content"}
      </button>
    </div>
  );
}
