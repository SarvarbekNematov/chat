import { db } from "@/firebase";
import type { AllMessageType, BackendDataType, LastMessagesType } from "@/types";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";

export const useUsersLastMessagesRealtime = (users?: BackendDataType[]) => {
  const [lastMessages, setLastMessages] = useState<LastMessagesType[]>([]);

  useEffect(() => {
    if (!users) return;

    const unsubscribes: (() => void)[] = [];

    users.forEach((user) => {
      const q = query(
        collection(db, "messages", String(user.userId), "allMessages"),
        orderBy("createAt", "desc"),
        limit(1)
      );

      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const lastMsg = snapshot.docs[0].data() as AllMessageType;
          setLastMessages((prev) => {
            const filtered = prev.filter((m) => m.userId !== user.userId);
            return [
              ...filtered,
              {
                userId: user.userId,
                message: lastMsg.message,
                link: {
                  url: lastMsg.link?.url,
                  type: lastMsg.link?.type,
                  name: lastMsg.link?.name
                },
                createAt: lastMsg.createAt,
                role: lastMsg.role,
                newMessage: lastMsg.newMessage,
                docId: String(snapshot.docs[0].id),
              },
            ];
          });
        }
      });

      unsubscribes.push(unsub);
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [users]);

  return { lastMessages };
};

export const markAllMessagesAsRead = async (userId: string): Promise<void> => {
  const messagesRef = collection(db, "messages", userId, "allMessages");

  const q = query(messagesRef, where("newMessage", "==", true));
  const querySnapshot = await getDocs(q);

  const updates = querySnapshot.docs.map((docSnap) => {
    return updateDoc(doc(messagesRef, docSnap.id), { newMessage: false });
  });

  await Promise.all(updates);
};
