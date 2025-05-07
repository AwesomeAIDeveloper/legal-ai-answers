
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Imprint = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Imprint</h1>
            
            <div className="prose prose-slate max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Company Information</h2>
                <p className="mb-2">Legal AI Assistant GmbH</p>
                <p className="mb-2">Musterstraße 123</p>
                <p className="mb-2">10115 Berlin</p>
                <p className="mb-2">Germany</p>
                <p className="mb-6">Registration Number: HRB 123456 B</p>
                
                <p className="mb-2">VAT ID: DE123456789</p>
                <p className="mb-2">Tax ID: 29/123/12345</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <p className="mb-2">Email: contact@legal-ai-assistant.com</p>
                <p className="mb-2">Phone: +49 30 1234567</p>
                <p className="mb-2">Fax: +49 30 7654321</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Management</h2>
                <p className="mb-2">CEO: Jane Doe</p>
                <p className="mb-2">CTO: John Smith</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Responsible for Content</h2>
                <p>According to § 55 Abs. 2 RStV:</p>
                <p className="mb-2">Jane Doe</p>
                <p className="mb-2">Legal AI Assistant GmbH</p>
                <p className="mb-2">Musterstraße 123</p>
                <p>10115 Berlin, Germany</p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
                <p className="mb-4">
                  The European Commission provides a platform for online dispute resolution (OS) which is accessible at https://ec.europa.eu/consumers/odr/
                </p>
                <p>
                  We are not obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Liability for Content</h2>
                <p>
                  As a service provider, we are responsible for our own content on these pages according to general laws. However, we are not obliged to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information according to general laws remain unaffected. However, liability in this respect is only possible from the time of knowledge of a concrete infringement. If we become aware of such infringements, we will remove this content immediately.
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

export default Imprint;
