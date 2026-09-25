import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { IMG, SKILL_CLUSTERS, TOOLS } from "@/lib/data";

export interface SkillCluster {
  title: string;
  items: string[];
}

export interface ExperienceImages {
  shalom: string;
  moustache: string;
}

export interface SiteContent {
  skills: SkillCluster[];
  toolkit: string[];
  categories: string[];
  experience: ExperienceImages;
}

export const DEFAULT_CATEGORIES = [
  "Photoshoot",
  "Website & CRM",
  "Graphic Design / Content",
  "Events",
  "Influencer Collab",
  "Listings",
];

const DEFAULT_CONTENT: SiteContent = {
  skills: SKILL_CLUSTERS.map((c) => ({ title: c.title, items: [...c.items] })),
  toolkit: [...TOOLS],
  categories: [...DEFAULT_CATEGORIES],
  experience: { shalom: IMG.rishikeshRiver, moustache: IMG.chefPlating },
};

export function useSiteContent() {
  const q = useQuery({
    queryKey: ["site-content"],
    queryFn: () => apiGet<Partial<SiteContent>>("/content"),
    staleTime: 30_000,
    retry: 1,
  });
  const content: SiteContent = {
    skills: q.data?.skills?.length ? (q.data.skills as SkillCluster[]) : DEFAULT_CONTENT.skills,
    toolkit: q.data?.toolkit?.length ? q.data.toolkit : DEFAULT_CONTENT.toolkit,
    categories: q.data?.categories?.length ? q.data.categories : DEFAULT_CONTENT.categories,
    experience: q.data?.experience?.shalom
      ? (q.data.experience as ExperienceImages)
      : DEFAULT_CONTENT.experience,
  };
  return { content, isError: q.isError };
}
