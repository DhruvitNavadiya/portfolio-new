import { Hero3D } from "@/components/Hero3D";
import { AboutSection } from "@/components/AboutSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

import { ChatAssistant } from "@/components/ChatAssistant";

export default function Home() {
  return (
    <main>
      <Hero3D />
      <div className="h-12 md:h-16 bg-black" />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
      <ChatAssistant />
    </main>
  );
}
