import {
  FileUploadIcon,
  VoiceStoppedIcon,
  VoiceUploadIcon,
} from "@/assets/icons";
import React, { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase";
import { useData } from "@/context";
import { useParams } from "react-router-dom";
import Waveform from "./voiceRecorder/Waveform";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/api";
import { FaRegFileAlt } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import type { BackendDataType } from "@/types";
import { useUsersRealtime } from "@/hooks/useUsers";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { FaRegFaceSmile } from "react-icons/fa6";

const InputDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [imageUrl, setImageUrl] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const {
    setOpenModal,
    setEmojiOpen,
    setEmojiSelect,
    emojiSelect,
    setEditMessage,
    editMessage,
    setUpdateMessage
  } = useData();
  const [imageName, setImageName] = useState("");
  const [fileName, setFileName] = useState("");
  const [modalFile, setModalFile] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const chunks = useRef<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textareaRefCaption = useRef<HTMLTextAreaElement>(null);
  const [captionValue, setCaptionValue] = useState("");
  const [value, setValue] = useState("");
  const [userState, setUserState] = useState<BackendDataType | undefined>(undefined);
  const { users } = useUsersRealtime();

  useEffect(() => {
    if (!users || !id) return;
    const user = users.find((item) => item.userId === Number(id));
    setUserState(user);
  }, [users, id]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(stream); 

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    chunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      chunks.current = [];

      // Firebase'ga yuklash
      const audioRef = ref(
        storage,
        `admin_${userState?.userId}_${Date.now()}.voice`
      );
      await uploadBytes(audioRef, blob);

      const url = await getDownloadURL(audioRef);
      setAudioURL(url); 

      stream.getTracks().forEach((track) => track.stop());
      setStream(null); 
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleUploadImg = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedImg = event.target.files?.[0];
    if (!selectedImg) {
      alert("Iltimos, rasm fayl yuklang!");
      return;
    }
    setImageName(selectedImg.name);

    try {
      const storageRef = ref(
        storage,
        `admin_${userState?.userId}_${Date.now()}.img`
      );
      await uploadBytes(storageRef, selectedImg);

      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL);
      setModalFile(true);
      setOpenModal(true);
    } catch (error) {
      console.error("PDF yuklashda xatolik:", error);
    }
  };

  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      alert("Iltimos, PDF fayl yuklang!");
      return;
    }

    setFileName(selectedFile.name);
    try {
      const storageRef = ref(
        storage,
        `admin_${userState?.userId}_${Date.now()}.file`
      );
      await uploadBytes(storageRef, selectedFile);

      const downloadURL = await getDownloadURL(storageRef);
      setFileUrl(downloadURL);
      setModalFile(true);
      setOpenModal(true);
    } catch (error) {
      console.error("PDF yuklashda xatolik:", error);
    }
  };

  useEffect(() => {
    setValue(value + emojiSelect);
    setEmojiSelect("");
  }, [emojiSelect]);

  useEffect(() => {
    setValue(editMessage?.message ?? "");
  }, [editMessage]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let { value } = e.target;
    setValue(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInputChangeCaption = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setCaptionValue(value);
    if (textareaRefCaption.current) {
      textareaRefCaption.current.style.height = "auto";
      textareaRefCaption.current.style.height = `${textareaRefCaption.current.scrollHeight}px`;
    }
  };

  const postItem = async (newItem: any) => {
    const response = await request.post(`send-message`, newItem, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("📦 Response headers:", response.data);
    return response.data;
  };

  const patchItem = async (newItem: any) => {
    const response = await request.post(`edit-message`, newItem, {
      headers: { "Content-Type": "application/json" },
    });
    if(response.data){
      setUpdateMessage(response.data.data)
      setEditMessage(undefined);
    }
    else{
      setEditMessage(editMessage)
    }
    console.log("📦 Response headers:", response.data);
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: postItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  const mutationEdit = useMutation({
    mutationFn: patchItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editMessage"]})
    }
  })

  const handleSubmit = () => {
    if (editMessage) {
      const editItem = {
        message: value,
        messageId: Number(editMessage.docId),
        role: "admin",
        newMessage: false,
        userId: userState?.userId,
        editMessage: "edit_message",
        link: {
          type: editMessage.link?.type,
          url: editMessage.link?.url,
          name: editMessage.link?.name,
        },
        createAt: editMessage.createAt,
      };
      mutationEdit.mutate(editItem);
      setValue("");
      console.log(editItem , "edit message");
      return
    }

    let urlType = "";
    let urls = "";
    if (imageUrl) {
      urlType += "img";
      urls += imageUrl;
    }
    if (fileUrl) {
      urlType += "file";
      urls += fileUrl;
    }
    if (audioURL) {
      urlType += "voice";
      urls += audioURL;
    }

    function formatDate() {
      dayjs.extend(utc);
      dayjs.extend(timezone);
      return dayjs().tz("Asia/Tashkent").format();
    }

    const newItem = {
      message: value || captionValue,
      role: "admin",
      messageId: 0,
      userId: userState?.userId,
      newMessage: true,
      link: {
        type: urlType,
        url: urls,
        name: fileName ? fileName : "",
      },
      createAt: formatDate(),
    };

    mutation.mutate(newItem);
    setModalFile(false);
    setValue("");
    setOpenModal(false);
    console.log(newItem, "malumot yuborildi");
  };

  return (
    <div
      className={`w-full pb-[10px] flex flex-col bg-white overflow-y-auto transition-all duration-200 ${
        isRecording && stream ? "min-h-[90px]" : "min-h-[90px] max-h-[400px]"
      }`}
    >
      {isRecording && stream && <Waveform stream={stream} />}
      {!isRecording && (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInputChange}
          placeholder="Xabar yozing..."
          rows={1}
          className="w-full px-4 py-2 rounded resize-none overflow-hidden border-gray-300 focus:outline-none"
        />
      )}

      <div className="flex items-center justify-between gap-[10px] h-[40px] px-[10px]">
        <div className="flex gap-[10px]">
          <div>
            <input
              onChange={handleUploadImg}
              name="imgUpload"
              className="hidden"
              id="imgUpload"
              type="file"
              accept="image/*"
            />
            <label
              className="p-[6px] flex justify-center border border-[#0000004b] rounded-[7px]"
              htmlFor="imgUpload"
            >
              <FileUploadIcon />
            </label>
          </div>
          <div>
            <button
              className="p-[6px] flex justify-center border border-[#0000004b] rounded-[7px]"
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? <VoiceStoppedIcon /> : <VoiceUploadIcon />}
            </button>
          </div>
          <div>
            <input
              onChange={handleUploadFile}
              name="fileUpload"
              className="hidden"
              id="fileUpload"
              type="file"
            />
            <label
              className="p-[6px] flex justify-center border border-[#0000004b] rounded-[7px]"
              htmlFor="fileUpload"
            >
              <FaRegFileAlt />
            </label>
          </div>
        </div>
        <div className="flex items-center gap-[25px]">
          <button
            onClick={() => setEmojiOpen(true)}
            className="w-[20px] h-[20px]"
          >
            <FaRegFaceSmile className="w-[20px] h-[20px]" />
          </button>
          <button
            onClick={handleSubmit}
            className="py-[7px] px-[20px] rounded-[5px] bg-blue-400 text-white "
          >
            Send
          </button>
        </div>
      </div>
      {modalFile && (
        <div
          className={`absolute z-50 w-[400px] py-[10px] top-[20%] px-[20px] min-h-[220px] text-blue-400 rounded-[10px] left-[20%] bg-white $ ${
            isRecording && stream ? "" : "max-h-[600px]"
          }`}
        >
          <p className="">Send {imageUrl ? "an image" : "as a file"}</p>
          <div className="">
            {imageUrl ? (
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline w-[80%]"
              >
                <div className="flex item-center gap-[20px] bg-white rounded-[10px]  p-[10px]">
                  <div className="bg-blue-400 flex justify-center items-center rounded-[50%] w-[30px] h-[30px]">
                    <AiOutlinePicture className="text-white w-[15px] h-[15px]" />
                  </div>
                  <div>
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis w-[280px] text-black">
                      {imageName}
                    </p>
                  </div>
                </div>
              </a>
            ) : (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline w-[80%]"
              >
                <div className="flex item-center gap-[20px] bg-white rounded-[10px]  p-[10px]">
                  <div className="bg-blue-400 flex justify-center items-center rounded-[50%] w-[30px] h-[30px]">
                    <FaRegFileAlt className="text-white w-[15px] h-[15px]" />
                  </div>
                  <div>
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis w-[280px] text-black">
                      {fileName}
                    </p>
                  </div>
                </div>
              </a>
            )}
          </div>
          <div className="flex flex-col justify-between gap-[20px]">
            <div>
              <label htmlFor="modalArea">Caption</label>
              <textarea
                ref={textareaRefCaption}
                value={captionValue}
                onChange={handleInputChangeCaption}
                placeholder="Xabar yozing..."
                id="modalArea"
                rows={1}
                className={`w-full px-4 py-2 text-black resize-none bg-white focus:outline-none max-h-[80px]  overflow-y-scroll border-b border-blue-400`}
              />
            </div>
            <div className="flex justify-between">
              <button
                className="bg-white text-blue-400 py-[5px] px-[15px] rounded-[9999px]"
                onClick={() => {
                  setModalFile(false), setOpenModal(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-white text-blue-400 py-[5px] px-[15px] rounded-[9999px]"
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InputDetail;