
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LegalTopic } from "@/types";

interface AdminTopicFormProps {
  editingTopic: LegalTopic | null;
  onSuccess: () => void;
}

const AdminTopicForm = ({ editingTopic, onSuccess }: AdminTopicFormProps) => {
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicIcon, setTopicIcon] = useState("");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTopic) {
      setTopicName(editingTopic.name);
      setTopicDescription(editingTopic.description || "");
      setTopicIcon(editingTopic.icon || "");
      setTopicPrompt(editingTopic.prompt_template);
    } else {
      setTopicName("");
      setTopicDescription("");
      setTopicIcon("");
      setTopicPrompt("");
    }
  }, [editingTopic]);

  const handleCreateTopic = async () => {
    if (!topicName || !topicPrompt) {
      toast.error("Topic name and prompt template are required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (editingTopic) {
        // Update existing topic
        const { error } = await supabase
          .from('legal_topics')
          .update({
            name: topicName,
            description: topicDescription || null,
            icon: topicIcon || null,
            prompt_template: topicPrompt,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingTopic.id);
          
        if (error) throw error;
        toast.success("Legal topic updated successfully");
      } else {
        // Create new topic
        const { error } = await supabase
          .from('legal_topics')
          .insert({
            name: topicName,
            description: topicDescription || null,
            icon: topicIcon || null,
            prompt_template: topicPrompt,
          });
          
        if (error) throw error;
        toast.success("Legal topic created successfully");
      }
      
      // Reset form and notify parent
      setTopicName("");
      setTopicDescription("");
      setTopicIcon("");
      setTopicPrompt("");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to save legal topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setTopicName("");
    setTopicDescription("");
    setTopicIcon("");
    setTopicPrompt("");
    onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingTopic ? "Edit Topic" : "Create Topic"}</CardTitle>
        <CardDescription>
          {editingTopic ? "Update an existing legal topic" : "Add a new legal topic and prompt template"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="name">
              Topic Name *
            </label>
            <Input
              id="name"
              placeholder="e.g. Employment Law"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="description">
              Description
            </label>
            <Input
              id="description"
              placeholder="e.g. Workplace rights and issues"
              value={topicDescription}
              onChange={(e) => setTopicDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="icon">
              Icon Name
            </label>
            <Input
              id="icon"
              placeholder="e.g. briefcase"
              value={topicIcon}
              onChange={(e) => setTopicIcon(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use Lucide icon names: home, briefcase, users, etc.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="prompt">
              Prompt Template *
            </label>
            <Textarea
              id="prompt"
              className="min-h-[120px]"
              placeholder="You are a legal assistant specializing in {{topic}}. The user has the following issue: {{query}}. Provide a clear summary of the legal situation and potential remedies."
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Use {{query}} where the user's question should be inserted
            </p>
          </div>
          
          <Button 
            className="w-full"
            onClick={handleCreateTopic}
            disabled={isSubmitting || !topicName || !topicPrompt}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {editingTopic ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {editingTopic ? "Update Topic" : "Create Topic"}
              </>
            )}
          </Button>
          
          {editingTopic && (
            <Button 
              variant="outline"
              className="w-full"
              onClick={handleCancel}
            >
              Cancel Editing
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminTopicForm;
