import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";

export const useFileUpload = (userId?: number) => {
  const upload = async (file: File, type: "img" | "file" | "voice") => {
    const fileRef = ref(storage, `admin_${userId}_${Date.now()}.${type}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  return { upload };
};
