
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LegalTopic, UserProfile } from "@/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminTopicsList from "@/components/admin/AdminTopicsList";
import AdminTopicForm from "@/components/admin/AdminTopicForm";
import AdminUsersList from "@/components/admin/AdminUsersList";
import AdminSettings from "@/components/admin/AdminSettings";

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingTopic, setEditingTopic] = useState<LegalTopic | null>(null);

  // Memoized check user function
  const checkUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to access the admin panel");
        navigate("/auth");
        return false;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error || !data || !data.is_admin) {
        toast.error("You don't have permission to access the admin panel");
        navigate("/");
        return false;
      }
      
      setUser(data as UserProfile);
      setIsAdmin(true);
      return true;
    } catch (error) {
      toast.error("An error occurred while checking permissions");
      navigate("/");
      return false;
    }
  }, [navigate]);

  // Effect for auth check
  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Fetch legal topics with caching and error handling
  const { 
    data: topics, 
    isLoading: isLoadingTopics, 
    refetch: refetchTopics 
  } = useQuery({
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
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  // Fetch users with caching and optimization
  const { 
    data: users, 
    isLoading: isLoadingUsers 
  } = useQuery({
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
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  // Memoized event handlers
  const handleEditTopic = useCallback((topic: LegalTopic) => {
    setEditingTopic(topic);
  }, []);

  const handleDeleteTopic = useCallback(async (id: string) => {
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
        setEditingTopic(null);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete legal topic");
    }
  }, [editingTopic, refetchTopics]);

  const handleTopicSuccess = useCallback(() => {
    refetchTopics();
    setEditingTopic(null);
  }, [refetchTopics]);

  // Loading state component
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

  // Memoized sorted topics list
  const memoizedTopics = useMemo(() => topics || [], [topics]);

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
                <AdminTopicsList 
                  topics={memoizedTopics}
                  isLoading={isLoadingTopics}
                  onEdit={handleEditTopic}
                  onDelete={handleDeleteTopic}
                />
              </div>
              
              <div>
                <AdminTopicForm 
                  editingTopic={editingTopic} 
                  onSuccess={handleTopicSuccess}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <AdminUsersList users={users || []} isLoading={isLoadingUsers} />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
