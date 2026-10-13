import { HeroSection } from "@/components/home/HeroSection";
import { SignatureProductSection } from "@/components/home/SignatureProductSection";
import { BeforeYouOrderSection } from "@/components/home/BeforeYouOrderSection";
import { CulinaryHeritageSection } from "@/components/home/CulinaryHeritageSection";
import { FreshOutOfKitchenSection } from "@/components/home/FreshOutOfKitchenSection";
import { FAQSection } from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <HeroSection />
      <SignatureProductSection />
      <BeforeYouOrderSection />
      <CulinaryHeritageSection />
      <FreshOutOfKitchenSection />
      <FAQSection />
    </main>
  );
}
