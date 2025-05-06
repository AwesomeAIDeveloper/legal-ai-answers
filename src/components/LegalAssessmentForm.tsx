
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LegalTopic } from "@/types";
import LegalAssessmentFormInput from "./legal/LegalAssessmentFormInput";
import LegalAssessmentSummary from "./legal/LegalAssessmentSummary";

// Fetch legal topics function
const fetchLegalTopics = async () => {
  const { data, error } = await supabase
    .from('legal_topics')
    .select('*');
  
  if (error) throw error;
  return data as LegalTopic[];
};

// Create edge function to call OpenAI API
const generateAISummary = async (text: string, topicId?: string) => {
  try {
    let prompt = "You are a helpful legal assistant. Provide a brief, clear summary of the legal situation and potential options.";
    
    if (topicId) {
      const { data: topic } = await supabase
        .from('legal_topics')
        .select('prompt_template')
        .eq('id', topicId)
        .single();
        
      if (topic && topic.prompt_template) {
        prompt = topic.prompt_template.replace('{{query}}', text);
      }
    }
    
    // Since this is just a prototype, we'll simulate the AI response
    // In production, you would call the OpenAI API through an edge function
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(`Based on the information provided, it appears you're dealing with a legal issue related to ${topicId ? 'a specific category' : 'general law'}. 

Here's a summary of your situation:
1. The facts you've presented suggest potential legal implications.
2. You may have certain rights under applicable laws.
3. There are several options available to you.

To get more detailed advice including specific legal provisions, remedies, and a formal legal assessment letter, consider upgrading to our full analysis.`);
      }, 2000);
    });
  } catch (error) {
    console.error("Error generating AI summary:", error);
    throw new Error("Failed to generate AI summary");
  }
};

const LegalAssessmentForm = () => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [queryId, setQueryId] = useState<string | null>(null);
  
  const { data: topics } = useQuery({
    queryKey: ['legalTopics'],
    queryFn: fetchLegalTopics,
  });

  const handleFormSubmit = async (topicId: string | undefined, queryText: string) => {
    try {
      // 1. Save the query to the database
      const { data: queryData, error: queryError } = await supabase
        .from('legal_queries')
        .insert({
          topic_id: topicId || null,
          query_text: queryText,
        })
        .select()
        .single();
      
      if (queryError) throw queryError;
      
      // 2. Generate AI summary
      const summary = await generateAISummary(queryText, topicId);
      
      // 3. Update the query with the AI summary
      const { error: updateError } = await supabase
        .from('legal_queries')
        .update({ ai_summary: summary })
        .eq('id', queryData.id);
      
      if (updateError) throw updateError;
      
      // 4. Display the summary to the user
      setAiSummary(summary);
      setQueryId(queryData.id);
      
      return summary;
    } catch (error) {
      console.error("Error submitting form:", error);
      throw error;
    }
  };

  const resetForm = () => {
    setAiSummary(null);
    setQueryId(null);
  };

  return (
    <section className="py-16 bg-muted/30" id="free-assessment">
      <div className="container max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Free Legal Assessment</h2>
          <p className="text-lg text-muted-foreground">
            Get a quick AI assessment of your legal situation
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {aiSummary ? (
            <LegalAssessmentSummary 
              summary={aiSummary} 
              onReset={resetForm}
            />
          ) : (
            <LegalAssessmentFormInput 
              topics={topics || []} 
              onSubmit={handleFormSubmit}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default LegalAssessmentForm;
