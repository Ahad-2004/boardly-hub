import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

type UserRole = "faculty" | "student" | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First, check for existing session (synchronous init)
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        console.debug('[Auth] initial getSession', session?.user?.id ?? null);
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .maybeSingle();
          if (error) console.error("Error fetching user role:", error);
          setUserRole(data?.role ?? null);
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error('[Auth] initial getSession error', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    // Then set up auth state listener for subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.debug('[Auth] onAuthStateChange event:', event, session?.user?.id ?? null);
      setSession(session);
      setUser(session?.user ?? null);
      // Fetch role asynchronously; don't block UI initialization
      (async () => {
        if (session?.user) {
          const { data, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .maybeSingle();
          if (error) console.error("Error fetching user role:", error);
          setUserRole(data?.role ?? null);
        } else {
          setUserRole(null);
        }
      })();
    });

    // Listen to storage events to debug cross-tab session changes and rehydrate
    const storageHandler = async (e: StorageEvent) => {
      if (!e.key) return;
      if (e.key.includes('supabase') || e.key.includes('Supabase')) {
        // storage event: another tab changed the auth state
        // console.debug('[Auth] storage event', e.key, e.oldValue ? 'old' : null, e.newValue ? 'new' : null);
        try {
          const { data: { session } } = await supabase.auth.getSession();
          // rehydrated session from storage event
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            const { data, error } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .maybeSingle();
            if (!error) setUserRole(data?.role ?? null);
          } else {
            setUserRole(null);
          }
        } catch (err) {
          console.error('[Auth] failed to rehydrate session', err);
        }
      }
    };
    window.addEventListener('storage', storageHandler);

    // When the tab becomes visible or window gains focus, re-check session to avoid logout on tab switches
    const rehydrate = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();
          if (!error) setUserRole(data?.role ?? null);
        } else {
          setUserRole(null);
        }
      } catch (err) {
        console.error('[Auth] rehydrate on visibility failed', err);
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') rehydrate();
    });
    window.addEventListener('focus', rehydrate);

    // Periodic session check as a fallback to keep session fresh (every 5 minutes)
    const intervalId = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        // If session exists and in-memory/user is null, rehydrate
        if (session?.user && !user) {
          setSession(session);
          setUser(session.user);
          const { data, error } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();
          if (!error) setUserRole(data?.role ?? null);
        }
      } catch (err) {
        // silently ignore
      }
    }, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('storage', storageHandler);
      document.removeEventListener('visibilitychange', rehydrate as any);
      window.removeEventListener('focus', rehydrate as any);
      clearInterval(intervalId);
    };
  }, []);

  const signOut = async () => {
    console.debug('[Auth] signing out');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, session, userRole, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
