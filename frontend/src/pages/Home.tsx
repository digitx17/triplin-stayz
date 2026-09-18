import { useEffect } from "react";
import { MotionConfig } from "motion/react";
import { Toaster } from "@/components/ui/sonner";
import { initSmoothScroll } from "@/lib/smoothScroll";
import { NavigationHeader } from "@/components/portfolio/NavigationHeader";
import { HeroSection } from "@/components/portfolio/HeroSection";
import { Marquee } from "@/components/portfolio/Marquee";
import { HowItStarted } from "@/components/portfolio/story/HowItStarted";
import { ExperienceTimeline } from "@/components/portfolio/ExperienceTimeline";
import { MarketingGallery } from "@/components/portfolio/MarketingGallery";
import { SkillsMatrix } from "@/components/portfolio/SkillsMatrix";
import { ToolkitStrip } from "@/components/portfolio/ToolkitStrip";
import { WhyTravel } from "@/components/portfolio/WhyTravel";
import { ContactSection } from "@/components/portfolio/ContactSection";

export default function Home() {
  useEffect(() => initSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper text-ink antialiased">
        <NavigationHeader />
        <main>
          <HeroSection />
          <Marquee />
          <HowItStarted />
          <ExperienceTimeline />
          <MarketingGallery />
          <SkillsMatrix />
          <ToolkitStrip />
          <WhyTravel />
          <ContactSection />
        </main>
        <Toaster />
      </div>
    </MotionConfig>
  );
}
