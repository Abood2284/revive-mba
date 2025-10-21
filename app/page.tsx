import HeroSection from "@/components/sections/HeroSection";
import TrustStrip from "@/components/sections/TrustStrip";
import WhyReviveSection from "@/components/sections/WhyReviveSection";
import ProgramDiscoverySection from "@/components/sections/ProgramDiscoverySection";
import GuidanceToolsSection from "@/components/sections/GuidanceToolsSection";
import LeadFormSection from "@/components/sections/LeadFormSection";
import FaqSection from "@/components/sections/FaqSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--surface-base)] text-[color:var(--color-secondary)]">
      <HeroSection />
      <TrustStrip />
      <WhyReviveSection />
      <ProgramDiscoverySection />
      <GuidanceToolsSection />
      <LeadFormSection />
      <FaqSection />
    </div>
  );
}
