import { format, isToday, isThisWeek, isThisYear, isValid } from "date-fns";
import { enUS } from "date-fns/locale";

export const formatDateForPreview = (dateString: string): string => {
  if (!dateString) return ""; // null, undefined, yoki "" bo‘lsa

  const date = new Date(dateString);

  if (!isValid(date)) return ""; // noto‘g‘ri sana bo‘lsa

  if (isToday(date)) {
    return format(date, "h:mm a"); // Masalan: 3:27 PM
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return format(date, "EEE", { locale: enUS }); // Masalan: Mon, Tue
  }

  if (isThisYear(date)) {
    return format(date, "M/d"); // Masalan: 7/12
  }

  return format(date, "M/d/yyyy"); // Masalan: 7/12/2024
};


export const formatChatDate = (date: Date) => {
  if (date) return format(date, "h:mm a");
};
