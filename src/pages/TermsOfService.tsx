
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: May 7, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                <p>
                  By accessing or using Legal AI Assistant ("the Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you do not have permission to access or use the Service.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p>
                  Legal AI Assistant provides AI-powered legal information and analysis. The Service is intended for informational purposes only and does not constitute legal advice. No attorney-client relationship is created through the use of this Service.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p className="mb-4">
                  When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password. You agree to notify us immediately of any unauthorized access or use of your account.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Subscription and Payments</h2>
                <p className="mb-4">
                  Certain features of the Service require a subscription or one-time payment. By subscribing to our Service:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>You agree to pay all fees applicable to your chosen plan</li>
                  <li>Subscriptions will automatically renew unless cancelled</li>
                  <li>You may cancel your subscription at any time through your account settings</li>
                  <li>We may change our fees with reasonable notice</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Limitations of Service</h2>
                <p className="mb-4">
                  You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6">
                  <li>The Service provides general legal information, not personalized legal advice</li>
                  <li>Our AI's analysis is not a substitute for professional legal counsel</li>
                  <li>The accuracy and completeness of our AI responses cannot be guaranteed</li>
                  <li>Important legal decisions should be made in consultation with a qualified attorney</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by Legal AI Assistant and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Disclaimer of Warranties</h2>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
                <p>
                  IN NO EVENT SHALL LEGAL AI ASSISTANT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at support@legal-ai-assistant.com.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
