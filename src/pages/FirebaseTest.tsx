import { useState } from "react";
import { auth, db } from "@/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FirebaseTest = () => {
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testFirestoreConnection = async () => {
    setLoading(true);
    setTestResult("Testing Firestore connection...\n");
    
    try {
      // Test 1: Check if we can connect to Firestore
      setTestResult(prev => prev + "✓ Firestore instance created\n");
      
      // Test 2: Check current user
      const user = auth.currentUser;
      if (user) {
        setTestResult(prev => prev + `✓ Current user: ${user.uid}\n`);
        
        // Test 3: Try to write a test document
        const testDocRef = doc(db, "test", "connection");
        await setDoc(testDocRef, {
          timestamp: new Date().toISOString(),
          message: "Firebase connection test"
        });
        setTestResult(prev => prev + "✓ Test document written successfully\n");
        
        // Test 4: Try to read the test document
        const testDoc = await getDoc(testDocRef);
        if (testDoc.exists()) {
          setTestResult(prev => prev + "✓ Test document read successfully\n");
        } else {
          setTestResult(prev => prev + "✗ Test document not found\n");
        }
        
        // Test 5: Try to access user_roles collection
        const roleDocRef = doc(db, "user_roles", user.uid);
        try {
          const roleDoc = await getDoc(roleDocRef);
          if (roleDoc.exists()) {
            setTestResult(prev => prev + "✓ User role document exists\n");
            setTestResult(prev => prev + `  Role: ${roleDoc.data()?.role}\n`);
          } else {
            setTestResult(prev => prev + "! User role document doesn't exist\n");
          }
        } catch (roleError: any) {
          setTestResult(prev => prev + `✗ Error reading user role: ${roleError.code} - ${roleError.message}\n`);
        }
        
      } else {
        setTestResult(prev => prev + "! No user currently signed in\n");
      }
      
    } catch (error: any) {
      setTestResult(prev => prev + `✗ Error: ${error.code} - ${error.message}\n`);
    }
    
    setLoading(false);
  };

  const checkFirebaseConfig = () => {
    setTestResult("Firebase Configuration:\n");
    setTestResult(prev => prev + `Project ID: ${import.meta.env.VITE_FIREBASE_PROJECT_ID}\n`);
    setTestResult(prev => prev + `Auth Domain: ${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}\n`);
    setTestResult(prev => prev + `API Key: ${import.meta.env.VITE_FIREBASE_API_KEY ? 'Set' : 'Missing'}\n`);
    setTestResult(prev => prev + `Current User: ${auth.currentUser?.uid || 'None'}\n`);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Firebase Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={checkFirebaseConfig}>
              Check Config
            </Button>
            <Button onClick={testFirestoreConnection} disabled={loading}>
              {loading ? "Testing..." : "Test Firestore"}
            </Button>
          </div>
          
          {testResult && (
            <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
              {testResult}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FirebaseTest;
