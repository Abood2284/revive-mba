// app/page.tsx
import FaqSection from "@/components/sections/FaqSection";
import { ExpertGuidanceSection } from "@/components/sections/ExpertGuidanceSection";
import { FeaturedUniversitiesSection } from "./(site)/components/featured-universities";
import { FeesCalculatorTeaser } from "./(site)/components/fees-calculator-teaser";
import { HeroNew } from "./(site)/components/hero-new";
import { HowItWorksSection } from "./(site)/components/how-it-works";
import { ProgramsSection } from "./(site)/components/programs";
import { SpecializationsSection } from "./(site)/components/specializations";
import { TestimonialsSection } from "./(site)/components/testimonials";
import { TrustApprovalsSection } from "./(site)/components/trust-approvals";
import { WhyUsSection } from "./(site)/components/why-us";
import { FAQsSection } from "./(site)/components/faq";
import { ContactUsSection } from "./(site)/components/contact-us";

export default function Home() {
  return (
    <>
      <HeroNew />
      <FeaturedUniversitiesSection />
      <SpecializationsSection />
      <ProgramsSection />
      {/* <FeesCalculatorTeaser /> */}
      <HowItWorksSection />
      <WhyUsSection />
      <ExpertGuidanceSection />
      <TestimonialsSection />
      <FAQsSection
        title="Frequently asked questions"
        subtitle="Quick, honest answers about programs, eligibility, and fees."
      />
      <ContactUsSection />
      {/* <TrustApprovalsSection
        title="Approvals & quality signals"
        subtitle="We list only accredited programs and surface the right badges clearly."
      /> */}
    </>
  );
}
