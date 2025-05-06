
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2 } from "lucide-react";
import { LegalTopic } from "@/types";

interface AdminTopicsListProps {
  topics: LegalTopic[];
  isLoading: boolean;
  onEdit: (topic: LegalTopic) => void;
  onDelete: (id: string) => void;
}

const AdminTopicsList = ({ topics, isLoading, onEdit, onDelete }: AdminTopicsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Legal Topics</CardTitle>
        <CardDescription>
          Manage legal topics and their AI prompt templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : topics.length > 0 ? (
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
                          onClick={() => onEdit(topic)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onDelete(topic.id)}
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
  );
};

export default AdminTopicsList;
