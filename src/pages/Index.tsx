
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import LegalTopics from "@/components/LegalTopics";
import LegalAssessmentForm from "@/components/LegalAssessmentForm";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <LegalAssessmentForm />
        <LegalTopics />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
