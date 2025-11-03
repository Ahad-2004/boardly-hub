import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NoticeCard } from "@/components/NoticeCard";
import { Button } from "@/components/ui/button";
import { LogOut, Filter } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { subscribeToNoticesWithProfiles } from "@/lib/notices";

const StudentDashboard = () => {
  const { user, userRole, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState<any[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState<string>("CSE");
  const [year, setYear] = useState<string>("1st");

  useEffect(() => {
    if (!authLoading && (!user || userRole !== "student")) {
      navigate("/auth");
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (!(user && userRole === "student")) return;
    setLoading(true);
    const unsub = subscribeToNoticesWithProfiles(
      { onlyActive: true },
      (data) => {
        setNotices(data || []);
        setLoading(false);
      },
      (err) => {
        console.error('Realtime notices error:', err);
        toast.error('Failed to subscribe to notices');
        setLoading(false);
      }
    );
    return () => unsub();
  }, [user, userRole]);

  useEffect(() => {
    filterNotices();
  }, [notices, department, year]);

  // real-time subscription above keeps notices in sync

  const filterNotices = () => {
    const filtered = notices.filter(
      (notice) => notice.department === department && notice.year === year
    );
    setFilteredNotices(filtered);
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
            <h1 className="text-2xl font-bold">Student Dashboard</h1>
            <p className="text-sm text-muted-foreground">View notices for your department</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-card border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Filter Notices</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">CSE</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="ECE">ECE</SelectItem>
                  <SelectItem value="MECH">MECH</SelectItem>
                  <SelectItem value="CIVIL">CIVIL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Year</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6">
            Active Notices ({filteredNotices.length})
          </h2>
          
          {filteredNotices.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-lg shadow-card">
              <p className="text-muted-foreground">
                No active notices for {department} - {year} Year
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
