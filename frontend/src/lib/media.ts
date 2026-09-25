import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface MediaItem {
  id: string;
  category: string;
  brand: string;
  caption: string;
  kind: "image" | "video" | "embed";
  provider: string;
  content_type: string;
  size: number;
  url: string;
  created_at: string;
}

export function useMedia(section?: string) {
  return useQuery({
    queryKey: ["media", section ?? "all"],
    queryFn: () => apiGet<MediaItem[]>(`/media${section ? `?section=${section}` : ""}`),
    staleTime: 60_000,
    retry: 1,
  });
}

export function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
  return m ? m[1] : null;
}

export function embedSrc(m: MediaItem): string {
  if (m.provider === "youtube") {
    const id = youtubeId(m.url);
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : m.url;
  }
  const ig = m.url.match(/instagram\.com\/(p|reels?)\/([^/?#]+)/);
  return ig ? `https://www.instagram.com/${ig[1] === "reels" ? "reel" : ig[1]}/${ig[2]}/embed` : m.url;
}

export function embedThumb(m: MediaItem): string | null {
  if (m.provider !== "youtube") return null;
  const id = youtubeId(m.url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
