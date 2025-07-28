import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import type { AllMessageType } from "@/types";
import { db } from "@/firebase";

export const getMessages = async (
  userId: string,
  lastDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ messages: AllMessageType[]; lastVisible: any }> => {
  const baseRef = collection(db, "messages", userId, "allMessages");
  let q = query(baseRef, orderBy("createAt", "desc"), limit(100));
  if (lastDoc) {
    q = query(baseRef, orderBy("createAt", "desc"), startAfter(lastDoc), limit(100));
  }
  const snap = await getDocs(q);
  
  const messages = snap.docs.map((doc) => ({
    ...doc.data() ,
    docId: doc.id,
  })) as AllMessageType[];

  const lastVisible = snap.docs[snap.docs.length - 1];

  return { messages: messages.reverse(), lastVisible };
};
