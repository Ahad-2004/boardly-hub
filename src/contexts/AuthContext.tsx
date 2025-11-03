import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";

type UserRole = "faculty" | "student" | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          console.log("[Auth] Fetching role for user:", firebaseUser.uid);
          const roleDoc = await getDoc(doc(db, "user_roles", firebaseUser.uid));
          if (roleDoc.exists()) {
            const role = (roleDoc.data() as any).role as UserRole;
            console.log("[Auth] User role found:", role);
            setUserRole(role);
          } else {
            console.log("[Auth] No role document found for user");
            setUserRole(null);
          }
        } catch (err: any) {
          console.error("[Auth] failed to fetch user role:", err.code, err.message);
          if (err.code === 'permission-denied') {
            console.error("[Auth] Firestore rules are blocking access to user_roles collection");
          }
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const doSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole(null);
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, signOut: doSignOut }}>
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
