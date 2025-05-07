
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HowItWorks from "@/components/HowItWorks";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">How Our Legal AI Assistant Works</h1>
            <p className="text-muted-foreground text-lg">
              Get affordable, accurate legal answers with our AI-powered platform.
            </p>
          </div>
          <HowItWorks />
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">How accurate is the legal advice?</h3>
                <p className="mt-2 text-muted-foreground">
                  Our AI provides general information based on legal resources and common scenarios. For specific legal situations, we recommend consulting with a qualified attorney.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Is my data kept confidential?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, we take privacy seriously. Your queries and personal information are encrypted and handled according to our privacy policy. We don't share your data with third parties.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Can I use this for my business?</h3>
                <p className="mt-2 text-muted-foreground">
                  Absolutely! Our subscription plan includes commercial use. Many small businesses use our platform for preliminary legal guidance and document preparation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
