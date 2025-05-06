
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

const AdminSettings = () => {
  return (
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
  );
};

export default AdminSettings;
