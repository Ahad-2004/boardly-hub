import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

// Import pages with lazy loading
import { lazy, Suspense } from 'react';

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Auth = lazy(() => import("./pages/Auth"));
const FacultyDashboard = lazy(() => import("./pages/FacultyDashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const FirebaseTest = lazy(() => import("./pages/FirebaseTest"));
const SetupRole = lazy(() => import("./pages/SetupRole"));

// Import global styles
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component with animation
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <p className="text-lg font-medium text-gray-700">Loading...</p>
    </div>
  </div>
);

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Main App Layout
const AppLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className={`min-h-screen flex flex-col ${isAuthPage ? 'bg-gray-50' : ''}`}>
      {/* Navigation can be added here */}
      
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/firebase-test" element={<FirebaseTest />} />
              <Route path="/setup-role" element={<SetupRole />} />
              <Route path="/faculty" element={<FacultyDashboard />} />
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </Suspense>
      </main>
      
      {/* Footer can be added here */}
      {!isAuthPage && (
        <footer className="bg-white border-t border-gray-200 py-6 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>© {new Date().getFullYear()} Digital Notice Board. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <AppLayout />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
