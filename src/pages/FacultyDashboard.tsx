import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { NoticeCard } from "@/components/NoticeCard";
import { NoticeForm } from "@/components/NoticeForm";
import { Button } from "@/components/ui/button";
import { LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const FacultyDashboard = () => {
  const { user, userRole, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && (!user || userRole !== "faculty")) {
      navigate("/auth");
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (user && userRole === "faculty") {
      fetchNotices();
    }
  }, [user, userRole]);

  const fetchNotices = async () => {
    try {
      const { data, error } = await supabase
        .from("notices")
        .select(`
          *,
          profiles:created_by (full_name)
        `)
        .eq("created_by", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = async (data: any) => {
    try {
      const { error } = await supabase.from("notices").insert({
        ...data,
        created_by: user?.id,
      });

      if (error) throw error;

      toast.success("Notice created successfully!");
      setIsDialogOpen(false);
      fetchNotices();
    } catch (error: any) {
      toast.error(error.message || "Failed to create notice");
    }
  };

  const handleEditNotice = async (data: any) => {
    try {
      const { error } = await supabase
        .from("notices")
        .update(data)
        .eq("id", editingNotice.id);

      if (error) throw error;

      toast.success("Notice updated successfully!");
      setIsDialogOpen(false);
      setEditingNotice(null);
      fetchNotices();
    } catch (error: any) {
      toast.error(error.message || "Failed to update notice");
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    try {
      const { error } = await supabase.from("notices").delete().eq("id", id);

      if (error) throw error;

      toast.success("Notice deleted successfully!");
      fetchNotices();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete notice");
    }
  };

  const openEditDialog = (notice: any) => {
    setEditingNotice(notice);
    setIsDialogOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your notices</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Your Notices</h2>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) setEditingNotice(null);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNotice ? "Edit Notice" : "Create New Notice"}</DialogTitle>
              </DialogHeader>
              <NoticeForm
                onSubmit={editingNotice ? handleEditNotice : handleCreateNotice}
                initialData={editingNotice}
                submitLabel={editingNotice ? "Update Notice" : "Create Notice"}
              />
            </DialogContent>
          </Dialog>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No notices yet. Create your first notice!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                showActions
                onEdit={openEditDialog}
                onDelete={handleDeleteNotice}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
