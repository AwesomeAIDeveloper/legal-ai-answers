
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    description: "Get a quick assessment of your legal situation",
    price: "€0",
    duration: "per query",
    features: [
      "AI Summary of Legal Situation",
      "Basic Options Analysis",
      "No Login Required"
    ],
    limitations: [
      "No Detailed Advice",
      "No Legal Letter",
      "No Dashboard"
    ],
    buttonText: "Get Free Advice",
    buttonAction: () => {
      document.getElementById("free-assessment")?.scrollIntoView({ behavior: "smooth" });
    },
    highlight: false
  },
  {
    name: "One-Time",
    description: "Comprehensive analysis for a single legal issue",
    price: "€10",
    duration: "per query",
    features: [
      "Everything in Free",
      "Detailed Legal Analysis",
      "Downloadable Legal Letter",
      "Email Delivery Option"
    ],
    limitations: [
      "No Dashboard Access",
      "Single Issue Only"
    ],
    buttonText: "Upgrade for €10",
    buttonAction: () => {
      toast.info("Stripe payment integration would be implemented here");
    },
    highlight: true
  },
  {
    name: "Subscription",
    description: "Unlimited legal assistance at your fingertips",
    price: "€29",
    duration: "per month",
    features: [
      "Everything in One-Time",
      "Unlimited Queries",
      "Full Dashboard Access",
      "Query History & Documents",
      "Priority Support"
    ],
    limitations: [],
    buttonText: "Subscribe Now",
    buttonAction: () => {
      toast.info("Stripe subscription integration would be implemented here");
    },
    highlight: false
  }
];

const Pricing = () => {
  return (
    <section className="py-16 bg-background" id="pricing">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Pricing Plans</h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that works for your legal needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`flex flex-col ${
                plan.highlight 
                  ? "border-primary shadow-lg" 
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">{plan.duration}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="h-4 w-4 text-green-500 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, i) => (
                    <li key={`lim-${i}`} className="flex items-center text-muted-foreground">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                      </svg>
                      <span>{limitation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={plan.buttonAction}
                  variant={plan.highlight ? "default" : "outline"}
                  className="w-full"
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
