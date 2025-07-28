import { db } from "@/firebase";
import type { BackendDataType } from "@/types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUsersRealtime = () => {
  const [users, setUsers] = useState<BackendDataType[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as BackendDataType);
      setUsers(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { users, loading };
};
