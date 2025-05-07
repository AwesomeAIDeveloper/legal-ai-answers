
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";

const PricingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
            <p className="text-muted-foreground text-lg">
              Affordable legal assistance tailored to your needs.
            </p>
          </div>
          <Pricing />
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold">Can I cancel my subscription anytime?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Is there a refund policy?</h3>
                <p className="mt-2 text-muted-foreground">
                  We offer a 7-day money-back guarantee for subscription plans if you're not satisfied with the service.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Do you offer discounts for teams?</h3>
                <p className="mt-2 text-muted-foreground">
                  Yes, we offer special team pricing for businesses and organizations. Please contact our support team for more details.
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

export default PricingPage;
