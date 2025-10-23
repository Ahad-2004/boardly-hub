import { supabase } from "@/integrations/supabase/client";

export type Notice = any;

type FetchOptions = {
  createdBy?: string | null;
  onlyActive?: boolean;
};

/**
 * Fetch notices and attach creator profile (full_name) by doing two queries.
 * This avoids requiring a DB foreign-key relationship for REST joins.
 */
export const fetchNoticesWithProfiles = async (opts: FetchOptions = {}) => {
  const today = new Date().toISOString().split("T")[0];

  const builder = supabase.from("notices").select("*").order("created_at", { ascending: false });
  if (opts.onlyActive) {
    builder.gte("expiry_date", today);
  }
  if (opts.createdBy) {
    builder.eq("created_by", opts.createdBy);
  }

  const { data: noticesData, error: noticesError } = await builder;
  if (noticesError) throw noticesError;

  const notices = noticesData || [];
  if (notices.length === 0) return notices;

  const creatorIds = Array.from(new Set(notices.map((n: any) => n.created_by).filter(Boolean)));
  if (creatorIds.length === 0) return notices;

  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", creatorIds);

  if (profilesError) {
    // Log and continue with unknown names
    console.warn("fetchNoticesWithProfiles: failed to fetch profiles", profilesError);
    return notices.map((n: any) => ({ ...n, profiles: { full_name: "Unknown" } }));
  }

  const profilesMap = (profilesData || []).reduce((acc: Record<string, any>, p: any) => {
    acc[p.id] = p;
    return acc;
  }, {});

  return notices.map((n: any) => ({ ...n, profiles: profilesMap[n.created_by] || { full_name: "Unknown" } }));
};

export default fetchNoticesWithProfiles;
