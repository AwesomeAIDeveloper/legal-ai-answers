
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-muted-foreground mb-6">Last updated: May 7, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                <p>
                  Legal AI Assistant ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-medium mb-2">2.1 Personal Information</h3>
                <p className="mb-4">
                  We may collect personal information that you voluntarily provide to us, including but not limited to:
                </p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Name and contact information</li>
                  <li>Account credentials</li>
                  <li>Payment information</li>
                  <li>Information contained in your legal queries</li>
                </ul>
                
                <h3 className="text-xl font-medium mb-2">2.2 Usage Data</h3>
                <p>
                  We may automatically collect certain information about your device and how you interact with our services, including:
                </p>
                <ul className="list-disc pl-6">
                  <li>IP address and browser type</li>
                  <li>Pages viewed and features used</li>
                  <li>Time spent on the platform</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                <p className="mb-4">
                  We may use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc pl-6">
                  <li>Providing and maintaining our services</li>
                  <li>Processing payments and subscriptions</li>
                  <li>Improving our AI's performance and accuracy</li>
                  <li>Communicating with you about our services</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <p className="mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6">
                  <li>Right to access and receive a copy of your data</li>
                  <li>Right to rectification of inaccurate data</li>
                  <li>Right to erasure ('right to be forgotten')</li>
                  <li>Right to restrict processing</li>
                  <li>Right to data portability</li>
                  <li>Right to object to processing</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy, please contact us at support@legal-ai-assistant.com.
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

export default PrivacyPolicy;
