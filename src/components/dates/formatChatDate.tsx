import type { AllMessageType } from "@/types";
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
} from "date-fns";

const formatChatDate = (date: Date): string => {
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEEE");
  
  // Agar boshqa yil bo‘lsa: July 25, 2023
  const now = new Date();
  if (now.getFullYear() !== date.getFullYear()) {
    return format(date, "MMMM d, yyyy");
  }

  return format(date, "MMMM d"); // July 25
};

export const groupMessagesByDate = (messages: AllMessageType[]) => {
  const grouped: Record<string, AllMessageType[]> = {};

  messages.forEach((msg) => {
    let date: Date;
    if (typeof msg.createAt === "string") {
      date = new Date(msg.createAt);
    } else if (
      msg.createAt &&
      typeof (msg.createAt as { seconds: number }).seconds === "number"
    ) {
      date = new Date((msg.createAt as { seconds: number }).seconds * 1000);
    } else {
      date = new Date();
    }
    const key = formatChatDate(date);

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(msg);
  });

  return grouped;
};
