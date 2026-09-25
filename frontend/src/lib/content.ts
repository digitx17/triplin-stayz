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

export interface ContactInfo {
  headingA: string;
  headingB: string;
  intro: string;
  email: string;
  linkedin: string;
  whatsapp: string;
  basedIn: string;
  focus: string;
  footerTagline: string;
}

export interface SiteContent {
  skills: SkillCluster[];
  toolkit: string[];
  categories: string[];
  experience: ExperienceImages;
  contact: ContactInfo;
}

export const DEFAULT_CATEGORIES = [
  "Photoshoot",
  "Website & CRM",
  "Graphic Design / Content",
  "Events",
  "Influencer Collab",
  "Listings",
];

export const DEFAULT_CONTACT_INFO: ContactInfo = {
  headingA: "Have a travel, hospitality",
  headingB: "or marketing project?",
  intro:
    "I'm open to opportunities in tourism, hospitality marketing, travel content, freelance projects and travel product building.",
  email: "hello@vaibhavkanhere.com",
  linkedin: "https://www.linkedin.com/in/vaibhav-kanhere",
  whatsapp: "https://wa.me/910000000000",
  basedIn: "India · open to remote & on-site",
  focus: "Tourism & hospitality marketing · content · travel systems",
  footerTagline: "I market travel businesses — and I build the systems behind them.",
};

const DEFAULT_CONTENT: SiteContent = {
  skills: SKILL_CLUSTERS.map((c) => ({ title: c.title, items: [...c.items] })),
  toolkit: [...TOOLS],
  categories: [...DEFAULT_CATEGORIES],
  experience: { shalom: IMG.rishikeshRiver, moustache: IMG.chefPlating },
  contact: DEFAULT_CONTACT_INFO,
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
    contact: q.data?.contact?.email
      ? { ...DEFAULT_CONTACT_INFO, ...(q.data.contact as Partial<ContactInfo>) }
      : DEFAULT_CONTENT.contact,
  };
  return { content, isError: q.isError };
}
