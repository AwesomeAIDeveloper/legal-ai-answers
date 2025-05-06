
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LegalTopic, UserProfile } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [topicName, setTopicName] = useState("");
  const [topicDescription, setTopicDescription] = useState("");
  const [topicIcon, setTopicIcon] = useState("");
  const [topicPrompt, setTopicPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTopic, setEditingTopic] = useState<LegalTopic | null>(null);

  // Check if user is authenticated and is admin
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to access the admin panel");
        navigate("/auth");
        return;
      }
      
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (!data || !data.is_admin) {
        toast.error("You don't have permission to access the admin panel");
        navigate("/");
        return;
      }
      
      setUser(data as UserProfile);
      setIsAdmin(true);
    };
    
    checkUser();
  }, [navigate]);

  // Fetch legal topics
  const { data: topics, isLoading: isLoadingTopics, refetch: refetchTopics } = useQuery({
    queryKey: ['adminLegalTopics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('legal_topics')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as LegalTopic[];
    },
    enabled: isAdmin,
  });

  // Fetch users
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as UserProfile[];
    },
    enabled: isAdmin,
  });

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
      
      // Reset form and refresh topics
      setTopicName("");
      setTopicDescription("");
      setTopicIcon("");
      setTopicPrompt("");
      setEditingTopic(null);
      refetchTopics();
    } catch (error: any) {
      toast.error(error.message || "Failed to save legal topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditTopic = (topic: LegalTopic) => {
    setEditingTopic(topic);
    setTopicName(topic.name);
    setTopicDescription(topic.description || "");
    setTopicIcon(topic.icon || "");
    setTopicPrompt(topic.prompt_template);
  };

  const handleDeleteTopic = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this topic? This action cannot be undone.")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('legal_topics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Legal topic deleted successfully");
      refetchTopics();
      
      if (editingTopic?.id === id) {
        setTopicName("");
        setTopicDescription("");
        setTopicIcon("");
        setTopicPrompt("");
        setEditingTopic(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete legal topic");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container max-w-screen-xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage legal topics, users, and application settings
          </p>
        </div>
        
        <Tabs defaultValue="topics">
          <TabsList className="mb-6">
            <TabsTrigger value="topics">Legal Topics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">App Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="topics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Legal Topics</CardTitle>
                    <CardDescription>
                      Manage legal topics and their AI prompt templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTopics ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : topics && topics.length > 0 ? (
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Icon</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {topics.map((topic) => (
                              <TableRow key={topic.id}>
                                <TableCell className="font-medium">{topic.name}</TableCell>
                                <TableCell>{topic.icon}</TableCell>
                                <TableCell className="max-w-[300px] truncate">
                                  {topic.description || "-"}
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleEditTopic(topic)}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => handleDeleteTopic(topic.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No legal topics found. Create your first topic.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div>
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
                          onClick={() => {
                            setEditingTopic(null);
                            setTopicName("");
                            setTopicDescription("");
                            setTopicIcon("");
                            setTopicPrompt("");
                          }}
                        >
                          Cancel Editing
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage registered users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : users && users.length > 0 ? (
                  <div className="border rounded-md overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Role</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : "-"
                              }
                            </TableCell>
                            <TableCell>
                              {new Date(user.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {user.is_subscribed ? (
                                <span className="text-green-600 font-medium">
                                  {user.subscription_tier}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">Free</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.is_admin ? (
                                <span className="font-semibold text-primary">Admin</span>
                              ) : (
                                "User"
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No users have registered yet.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Configure global application settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">AI Configuration</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            OpenAI API Model
                          </label>
                          <select className="w-full bg-background border border-input rounded-md h-10 px-3">
                            <option value="gpt-4-turbo">GPT-4 Turbo</option>
                            <option value="gpt-4">GPT-4</option>
                            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Response Temperature
                          </label>
                          <Input type="number" min="0" max="1" step="0.1" defaultValue="0.7" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Default System Prompt
                        </label>
                        <Textarea 
                          className="min-h-[120px]"
                          defaultValue="You are a legal AI assistant helping people with legal issues. Provide clear, concise advice based on the information given. Always clarify that this is not a substitute for professional legal advice."
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Payment Settings</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Single Query Price (€)
                          </label>
                          <Input type="number" min="0" step="0.01" defaultValue="10.00" />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">
                            Monthly Subscription Price (€)
                          </label>
                          <Input type="number" min="0" step="0.01" defaultValue="29.00" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
