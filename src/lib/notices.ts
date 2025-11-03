import { collection, getDocs, query, where, orderBy, onSnapshot, Unsubscribe, documentId } from "firebase/firestore";
import { db } from "@/firebase/config";

export type Notice = any;

type FetchOptions = {
  createdBy?: string | null;
  onlyActive?: boolean;
};

/**
 * Subscribe to notices in real-time and map creator full_name from user_roles.
 * Returns an unsubscribe function.
 */
export const subscribeToNoticesWithProfiles = (
  opts: FetchOptions,
  onData: (notices: any[]) => void,
  onError?: (err: any) => void
): Unsubscribe => {
  const today = new Date().toISOString().split("T")[0];
  const noticesCol = collection(db, "notices");
  const qParts: any[] = [];
  if (opts?.onlyActive) qParts.push(where("expiry_date", ">=", today));
  if (opts?.createdBy) qParts.push(where("created_by", "==", opts.createdBy));
  qParts.push(orderBy("created_at", "desc"));

  const q = qParts.length ? query(noticesCol, ...qParts) : query(noticesCol, orderBy("created_at", "desc"));

  const unsub = onSnapshot(
    q,
    async (snap) => {
      try {
        const notices = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
        if (notices.length === 0) {
          onData([]);
          return;
        }
        const creatorIds = Array.from(new Set(notices.map((n: any) => n.created_by).filter(Boolean)));
        const profilesMap: Record<string, any> = {};
        if (creatorIds.length > 0) {
          const rolesCol = collection(db, "user_roles");
          // Firestore 'in' queries support up to 10 IDs per query
          for (let i = 0; i < creatorIds.length; i += 10) {
            const chunk = creatorIds.slice(i, i + 10);
            const rolesQ = query(rolesCol, where(documentId(), 'in', chunk));
            const rolesSnap = await getDocs(rolesQ);
            rolesSnap.forEach((docSnap) => {
              profilesMap[docSnap.id] = { id: docSnap.id, full_name: (docSnap.data() as any).full_name };
            });
          }
        }
        onData(notices.map((n: any) => ({ ...n, profiles: profilesMap[n.created_by] || { full_name: "Unknown" } })));
      } catch (err) {
        onError?.(err);
      }
    },
    (err) => onError?.(err)
  );

  return unsub;
};

/**
 * Fetch notices and attach creator profile (full_name) by doing two queries.
 * This avoids requiring a DB foreign-key relationship for REST joins.
 */
export const fetchNoticesWithProfiles = async (opts: FetchOptions = {}) => {
  const today = new Date().toISOString().split("T")[0];

  const noticesCol = collection(db, "notices");
  const qParts: any[] = [];
  if (opts.onlyActive) {
    qParts.push(where("expiry_date", ">=", today));
  }
  if (opts.createdBy) {
    qParts.push(where("created_by", "==", opts.createdBy));
  }
  qParts.push(orderBy("created_at", "desc"));

  const q = qParts.length ? query(noticesCol, ...qParts) : query(noticesCol, orderBy("created_at", "desc"));
  const snap = await getDocs(q);
  const notices = snap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
  if (notices.length === 0) return notices;

  const creatorIds = Array.from(new Set(notices.map((n: any) => n.created_by).filter(Boolean)));
  if (creatorIds.length === 0) return notices.map((n: any) => ({ ...n, profiles: { full_name: "Unknown" } }));

  // Fetch user names only for creators using batched IN queries
  const rolesCol = collection(db, "user_roles");
  const profilesMap: Record<string, any> = {};
  for (let i = 0; i < creatorIds.length; i += 10) {
    const chunk = creatorIds.slice(i, i + 10);
    const rolesQ = query(rolesCol, where(documentId(), 'in', chunk));
    const rolesSnap = await getDocs(rolesQ);
    rolesSnap.forEach((docSnap) => {
      profilesMap[docSnap.id] = { id: docSnap.id, full_name: (docSnap.data() as any).full_name };
    });
  }

  return notices.map((n: any) => ({ ...n, profiles: profilesMap[n.created_by] || { full_name: "Unknown" } }));
};

export default fetchNoticesWithProfiles;
