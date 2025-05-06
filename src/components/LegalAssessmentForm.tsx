
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { LegalTopic } from "@/types";

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

const formSchema = z.object({
  topicId: z.string().optional(),
  queryText: z.string().min(10, "Please provide at least 10 characters describing your legal issue"),
});

const fetchLegalTopics = async () => {
  const { data, error } = await supabase
    .from('legal_topics')
    .select('*');
  
  if (error) throw error;
  return data as LegalTopic[];
};

const LegalAssessmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [queryId, setQueryId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: topics } = useQuery({
    queryKey: ['legalTopics'],
    queryFn: fetchLegalTopics,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      queryText: "",
    },
  });

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Voice input is not supported in your browser.");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsRecording(true);
      toast.info("Voice recording started. Speak clearly into your microphone.");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      form.setValue('queryText', transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      toast.error("Error recording voice. Please try again.");
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
      toast.success("Voice recording finished.");
    };

    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type. Please upload a PDF, DOCX, or image file.");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum file size is 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      
      // In a real app, you'd extract text from the file and set it as queryText
      // For this prototype, we'll just use the filename as an example
      form.setValue('queryText', `[Document: ${file.name}] Please analyze this legal document for me.`);

      // Simulate file processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // 1. Save the query to the database
      const { data: queryData, error: queryError } = await supabase
        .from('legal_queries')
        .insert({
          topic_id: values.topicId || null,
          query_text: values.queryText,
        })
        .select()
        .single();
      
      if (queryError) throw queryError;
      
      // 2. Generate AI summary
      const summary = await generateAISummary(values.queryText, values.topicId);
      
      // 3. Update the query with the AI summary
      const { error: updateError } = await supabase
        .from('legal_queries')
        .update({ ai_summary: summary })
        .eq('id', queryData.id);
      
      if (updateError) throw updateError;
      
      // 4. Display the summary to the user
      setAiSummary(summary);
      setQueryId(queryData.id);
      
      toast.success("Your legal assessment has been generated!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to generate legal assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePurchaseFullReport = () => {
    // In a real app, you'd integrate with Stripe here
    toast.info("Stripe payment integration would be implemented here");
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
                    {aiSummary}
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
                  <Button variant="outline" onClick={() => {
                    setAiSummary(null);
                    setQueryId(null);
                    form.reset();
                  }}>
                    Ask Another Question
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="topicId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Legal Topic (Optional)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a legal topic" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {topics?.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="queryText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your legal issue</FormLabel>
                      <div className="flex space-x-2 mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={isRecording ? "bg-red-100" : ""}
                          onClick={handleVoiceInput}
                        >
                          <Mic className={isRecording ? "text-red-500" : ""} />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className={isUploading ? "bg-blue-100" : ""}
                          onClick={() => document.getElementById('file-upload')?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <Upload />
                          )}
                        </Button>
                        <input
                          id="file-upload"
                          type="file"
                          className="hidden"
                          onChange={handleFileUpload}
                          accept=".pdf,.docx,.jpg,.jpeg,.png"
                        />
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Enter details about your legal situation here..."
                          className="min-h-[150px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Submit for Free Analysis"
                  )}
                </Button>
              </form>
            </Form>
          )}
        </div>
      </div>
    </section>
  );
};

export default LegalAssessmentForm;
