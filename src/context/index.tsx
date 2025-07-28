// context/data-context.tsx
import type { AllMessageType } from "@/types";
import { createContext, useContext, useState } from "react";

interface DataContextType {
  openModal: boolean;
  emojiOpen: boolean;
  updateMessage: AllMessageType | undefined;
  emojiSelect: string;
  editMessage: AllMessageType | undefined;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEmojiOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateMessage: React.Dispatch<React.SetStateAction<AllMessageType | undefined>>;
  setEmojiSelect: React.Dispatch<React.SetStateAction<string>>;
  setEditMessage: React.Dispatch<React.SetStateAction<AllMessageType | undefined>>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: any }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [emojiOpen , setEmojiOpen] = useState<boolean>(false)
  const [emojiSelect , setEmojiSelect] = useState<string>("")
  const [editMessage , setEditMessage] = useState<AllMessageType | undefined>(undefined)
  const [updateMessage , setUpdateMessage] = useState<AllMessageType | undefined>(undefined)

  return (
    <DataContext.Provider
      value={{
        setOpenModal,
        openModal,
        emojiOpen,
        emojiSelect,
        editMessage,
        updateMessage,
        setEditMessage,
        setUpdateMessage,
        setEmojiOpen,
        setEmojiSelect
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
};
