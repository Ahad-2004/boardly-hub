import { format } from "date-fns";
import { Calendar, User, Trash2, Edit } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NoticeCardProps {
  notice: {
    id: string;
    title: string;
    description: string;
    department: string;
    year: string;
    expiry_date: string;
    created_at: string;
    created_by: string;
    profiles?: {
      full_name: string;
    };
  };
  onEdit?: (notice: any) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

const getDepartmentColor = (dept: string) => {
  const colors: Record<string, string> = {
    CSE: "bg-dept-cse text-white",
    IT: "bg-dept-it text-white",
    ECE: "bg-dept-ece text-white",
    MECH: "bg-dept-mech text-white",
    CIVIL: "bg-dept-civil text-white",
  };
  return colors[dept] || "bg-primary text-white";
};

export const NoticeCard = ({ notice, onEdit, onDelete, showActions }: NoticeCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-all duration-300 border-border bg-gradient-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getDepartmentColor(notice.department)}>
                {notice.department}
              </Badge>
              <Badge variant="outline">{notice.year} Year</Badge>
            </div>
            <CardTitle className="text-xl">{notice.title}</CardTitle>
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(notice)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(notice.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-1 text-sm mt-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{notice.profiles?.full_name || "Unknown"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Expires: {format(new Date(notice.expiry_date), "PPP")}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap">{notice.description}</p>
      </CardContent>
    </Card>
  );
};
