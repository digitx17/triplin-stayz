import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export interface MediaItem {
  id: string;
  section: string;
  caption: string;
  kind: "image" | "video";
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
