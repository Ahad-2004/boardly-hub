import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { GraduationCap, Bell, Users, Shield } from "lucide-react";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { user, userRole, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && userRole) {
      navigate(userRole === "faculty" ? "/faculty" : "/student");
    }
  }, [user, userRole, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Digital Notice Board</h1>
          </div>
          <Button onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Stay Updated with Campus Notices
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern platform for managing and viewing departmental notices efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 bg-card rounded-xl shadow-card border border-border hover:shadow-hover transition-all">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Notices</h3>
            <p className="text-muted-foreground">
              Get instant access to all notices relevant to your department and year
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-card border border-border hover:shadow-hover transition-all">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Role-based Access</h3>
            <p className="text-muted-foreground">
              Faculty can create and manage notices, students can view relevant updates
            </p>
          </div>

          <div className="p-6 bg-card rounded-xl shadow-card border border-border hover:shadow-hover transition-all">
            <div className="bg-gradient-primary p-3 rounded-lg w-fit mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Organized</h3>
            <p className="text-muted-foreground">
              Notices automatically expire and are organized by department and year
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="px-8">
            Sign In to Get Started
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Index;
