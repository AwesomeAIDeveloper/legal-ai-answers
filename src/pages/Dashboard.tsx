
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LegalQuery, UserProfile } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to access the dashboard");
        navigate("/auth");
        return;
      }
      
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      setUser(data as UserProfile);
    };
    
    checkUser();
  }, [navigate]);

  // Fetch user's legal queries
  const { data: queries, isLoading: isLoadingQueries } = useQuery({
    queryKey: ['userQueries', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('legal_queries')
        .select('*, legal_topics(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as (LegalQuery & { legal_topics: { name: string } | null })[];
    },
    enabled: !!user,
  });

  const handleDownloadLetter = (query: LegalQuery) => {
    if (!query.legal_letter_url) {
      toast.error("Legal letter is not available for this query");
      return;
    }
    
    // In a real app, you would download the file from Supabase storage
    toast.info("Downloading legal letter...");
  };

  if (!user) {
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back{user.first_name ? `, ${user.first_name}` : ""}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {user.is_subscribed ? (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-3 py-1">
                {user.subscription_tier} Subscription
              </Badge>
            ) : (
              <Button onClick={() => navigate("/#pricing")}>
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="queries">
          <TabsList className="mb-6">
            <TabsTrigger value="queries">My Legal Queries</TabsTrigger>
            <TabsTrigger value="account">Account Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="queries">
            <Card>
              <CardHeader>
                <CardTitle>Your Legal Queries</CardTitle>
                <CardDescription>
                  View and manage your previous legal inquiries
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingQueries ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : queries && queries.length > 0 ? (
                  <div className="space-y-6">
                    {queries.map((query) => (
                      <div key={query.id} className="border rounded-md p-4">
                        <div className="flex flex-col md:flex-row justify-between md:items-center">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                {query.legal_topics?.name || "General Legal Question"}
                              </h3>
                              {query.is_paid && (
                                <Badge variant="secondary" className="text-xs">
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {new Date(query.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="mt-3 md:mt-0 space-x-2">
                            {query.legal_letter_url && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex items-center gap-1"
                                onClick={() => handleDownloadLetter(query)}
                              >
                                <Download className="h-4 w-4" />
                                <span>Download Letter</span>
                              </Button>
                            )}
                            {!query.is_paid && (
                              <Button size="sm">
                                Upgrade to Premium
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Your Question:</p>
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {query.query_text}
                          </p>
                          
                          {query.ai_summary && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-1">AI Summary:</p>
                              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                {query.ai_summary.length > 200 
                                  ? `${query.ai_summary.substring(0, 200)}...` 
                                  : query.ai_summary
                                }
                              </p>
                            </div>
                          )}
                          
                          {query.ai_detailed_advice && query.is_paid && (
                            <div className="mt-3">
                              <p className="text-sm font-medium mb-1">Detailed Advice:</p>
                              <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded flex items-start gap-2">
                                <FileText className="h-4 w-4 mt-1 text-primary" />
                                <span>
                                  {query.ai_detailed_advice.length > 150 
                                    ? `${query.ai_detailed_advice.substring(0, 150)}...` 
                                    : query.ai_detailed_advice
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      You haven't submitted any legal queries yet.
                    </p>
                    <Button onClick={() => navigate("/#free-assessment")}>
                      Get Your First Assessment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Manage your personal details and subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Personal Information</h3>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : "Not provided"
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium">Subscription</h3>
                    <div className="mt-3">
                      <p className="text-sm text-muted-foreground">Current Plan</p>
                      <p className="font-medium">
                        {user.is_subscribed 
                          ? `${user.subscription_tier} (Active until ${user.subscription_ends_at 
                              ? new Date(user.subscription_ends_at).toLocaleDateString() 
                              : "Unknown"})`
                          : "No active subscription"
                        }
                      </p>
                    </div>
                    <div className="mt-4">
                      {user.is_subscribed ? (
                        <Button variant="outline">
                          Manage Subscription
                        </Button>
                      ) : (
                        <Button onClick={() => navigate("/#pricing")}>
                          View Subscription Plans
                        </Button>
                      )}
                    </div>
                  </div>
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

export default Dashboard;
