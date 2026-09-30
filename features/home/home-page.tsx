import { BenefitsSection } from "@/features/home/benefits-section";
import { CategoriesSection } from "@/features/home/categories-section";
import { FaqSection } from "@/features/home/faq-section";
import { FeaturedToolsSection } from "@/features/home/featured-tools-section";
import { HeroSection } from "@/features/home/hero-section";
import { PopularToolsSection } from "@/features/home/popular-tools-section";

export function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedToolsSection />
      <CategoriesSection />
      <PopularToolsSection />
      <BenefitsSection />
      <FaqSection />
    </>
  );
}
