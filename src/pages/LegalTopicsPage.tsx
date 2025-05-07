
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LegalTopics from "@/components/LegalTopics";

const LegalTopicsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h1 className="text-4xl font-bold mb-4">Legal Topics</h1>
            <p className="text-muted-foreground text-lg">
              Explore our comprehensive range of legal areas where our AI assistant can provide guidance.
            </p>
          </div>
          <LegalTopics />
          
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Need Help with Another Legal Topic?</h2>
            <p className="text-muted-foreground mb-6">
              If you don't see your specific legal concern listed above, you can still submit your question. 
              Our AI is trained on a wide range of legal subjects and can provide general guidance on many topics.
            </p>
            <div className="flex justify-center">
              <a 
                href="/#free-assessment" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-foreground hover:text-primary transition duration-150 ease-in-out"
              >
                Ask Your Legal Question
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LegalTopicsPage;
