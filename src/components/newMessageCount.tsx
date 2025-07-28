import {
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/firebase";

export const getNewMessageCountForUser = async (userId: string) => {
  const q = query(
    collection(db, "messages", userId, "allMessages"),
    where("newMessage", "==", true)
  );

  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
};
