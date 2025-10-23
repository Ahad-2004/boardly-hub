import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const TestSupabase = () => {
  const [result, setResult] = useState<any>(null);
  const { session } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        // Minimal fetch: get 1 notice without joins
        const { data, error, status } = await supabase
          .from('notices')
          .select('*')
          .limit(1);

        setResult({ data, error: error ? { message: error.message, code: (error as any).code, details: (error as any).details } : null, status });
        console.log('TestSupabase result', { data, error, status });
      } catch (err) {
        console.error('TestSupabase uncaught', err);
        setResult({ uncaught: String(err) });
      }
    };

    run();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Supabase connectivity test</h1>
      <pre className="whitespace-pre-wrap bg-card p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-primary text-white rounded"
          onClick={async () => {
            try {
              // Build the raw REST URL similar to the failing logs
              const userId = session?.user?.id || '';
              const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/notices?select=*,profiles:created_by(full_name)&created_by=eq.${userId}&order=created_at.desc`;
              console.debug('REST test url', url);

              const headers: Record<string,string> = {
                apikey: String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY),
                Authorization: session?.access_token ? `Bearer ${session.access_token}` : '' ,
                Accept: '*/*'
              };

              const res = await fetch(url, { headers, method: 'GET' });
              const text = await res.text();
              console.debug('REST fetch raw response:', { status: res.status, headers: Object.fromEntries(res.headers.entries()), text });
              setResult({ rest: { status: res.status, text } });
            } catch (err) {
              console.error('REST test uncaught', err);
              setResult({ restUncaught: String(err) });
            }
          }}
        >
          Run raw REST test
        </button>
      </div>
    </div>
  );
};

export default TestSupabase;
