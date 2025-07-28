import { useEffect } from "react";
import { useData } from "@/context";

export const useEmoji = (value: string, setValue: (v: string) => void) => {
  const { emojiSelect, setEmojiSelect } = useData();

  useEffect(() => {
    setValue(value + emojiSelect);
    setEmojiSelect("");
  }, [emojiSelect]);
};
