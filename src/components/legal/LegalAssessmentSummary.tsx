
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface LegalAssessmentSummaryProps {
  summary: string;
  onReset: () => void;
}

const LegalAssessmentSummary = ({ summary, onReset }: LegalAssessmentSummaryProps) => {
  const handlePurchaseFullReport = () => {
    // In a real app, you'd integrate with Stripe here
    toast.info("Stripe payment integration would be implemented here");
  };

  return (
    <div className="space-y-6">
      <Card className="border border-primary/20 shadow-md">
        <CardContent className="pt-6">
          <div className="mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
              <path d="M12 8V4H8"></path>
              <rect width="16" height="12" x="4" y="8" rx="2"></rect>
              <path d="M2 14h2"></path>
              <path d="M20 14h2"></path>
              <path d="M15 13v2"></path>
              <path d="M9 13v2"></path>
            </svg>
            <h3 className="text-xl font-semibold">AI Legal Assessment</h3>
          </div>
          <div className="whitespace-pre-wrap bg-muted/50 p-4 rounded-md text-left">
            {summary}
          </div>
        </CardContent>
      </Card>

      <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
        <h3 className="text-xl font-semibold mb-2">Want a detailed legal opinion?</h3>
        <p className="mb-4 text-muted-foreground">
          Upgrade to receive a comprehensive analysis including specific laws, next steps, and a formal legal letter.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handlePurchaseFullReport}>
            Unlock Full Analysis for €10
          </Button>
          <Button variant="outline" onClick={onReset}>
            Ask Another Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LegalAssessmentSummary;
