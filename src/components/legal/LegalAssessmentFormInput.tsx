
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { LegalTopic } from "@/types";

const formSchema = z.object({
  topicId: z.string().optional(),
  queryText: z.string().min(10, "Please provide at least 10 characters describing your legal issue"),
});

interface LegalAssessmentFormInputProps {
  topics: LegalTopic[];
  onSubmit: (topicId: string | undefined, queryText: string) => Promise<string>;
}

const LegalAssessmentFormInput = ({ topics, onSubmit }: LegalAssessmentFormInputProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      queryText: "",
    },
  });

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

  const handleSubmitForm = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values.topicId, values.queryText);
      toast.success("Your legal assessment has been generated!");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to generate legal assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="space-y-6">
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
                  {topics.map((topic) => (
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
  );
};

export default LegalAssessmentFormInput;
