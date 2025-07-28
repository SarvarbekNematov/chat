import { useParams } from "react-router-dom";
import InputDetail from "../input";
import type { AllMessageType, BackendDataType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { useUsersRealtime } from "@/hooks/useUsers";
import { getMessages } from "@/hooks/useMessages";
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { useUsersLastMessagesRealtime } from "@/hooks/useLastMessages";
import { AiOutlineScan } from "react-icons/ai";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import Profile from "../profile";
import { useData } from "@/context";
import { EmojiDatas } from "../emojiDatas";
import { MdOutlineCancel } from "react-icons/md";
import { request } from "@/api";
import { formatChatDate } from "../dates/formatDate";
import { groupMessagesByDate } from "../dates/formatChatDate";

const MessageDetail = () => {
  const { id } = useParams();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { users } = useUsersRealtime();
  const [userState, setUserState] = useState<BackendDataType | undefined>(
    undefined
  );
  const { lastMessages } = useUsersLastMessagesRealtime(users);
  const [messages, setMessages] = useState<AllMessageType[]>([]);
  const [lastVisible, setLastVisible] = useState<
    QueryDocumentSnapshot<DocumentData, DocumentData> | undefined
  >(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [openProfile, setOpenProfile] = useState<boolean>(true);
  const {
    setEmojiOpen,
    emojiOpen,
    setEditMessage,
    editMessage,
    updateMessage,
  } = useData();
  const [messageDelete, setMessageDelete] = useState(false);

  const scrollToBottom = () => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  const fetchMessages = async (
    uid: string,
    last?: QueryDocumentSnapshot<DocumentData, DocumentData>
  ) => {
    const { messages: newMsgs, lastVisible: lastDoc } = await getMessages(
      uid,
      last
    );

    // Agar bu scroll orqali chaqirilsa - qo‘shamiz, aks holda replace qilamiz
    setMessages((prev) => (last ? [...newMsgs, ...prev] : [...newMsgs]));
    setLastVisible(lastDoc);
    setHasMore(newMsgs.length > 0);
  };

  useEffect(() => {
    fetchMessages(String(id));
    setMessageDelete(false);
    
    if(!updateMessage){
      scrollToBottom();
    }
  }, [lastMessages, messageDelete, updateMessage]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      if (el.scrollTop === 0 && hasMore && lastVisible) {
        fetchMessages(String(id), lastVisible); // scroll bo‘lsa yana yukla
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [hasMore, lastVisible, id]);

  useEffect(() => {
    if (!id) return;

    setMessages([]);
    setLastVisible(undefined);
    setHasMore(true);
    fetchMessages(String(id)).then(() => {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    });
  }, [id]);

  const handleDelete = async (item: AllMessageType) => {
    await request.delete(`delete-message/${item.docId}`, {
      data: { userId: id },
    });
    setMessageDelete(true);
  };

  useEffect(() => {
    if (!users || !id) return;

    const user = users.find((item) => item.userId === Number(id));
    setUserState(user);
  }, [users, id]);

  const LineWithDate = ({ date }: { date: string }) => {
    return (
      <div className="flex items-center justify-center my-4">
        <span className="px-4 text-gray-500 text-sm font-medium whitespace-nowrap">
          {date}
        </span>
      </div>
    );
  };

  const groupedMessages = groupMessagesByDate([...messages]);

  return (
    <>
      <div className="flex relative w-full h-screen overflow-hidden">
        <div
          className={`w-[100%] relative ${openProfile && "w-[70%]"} ${
            emojiOpen && "w-[70%]"
          }`}
        >
          <div className="flex gap-[20px] justify-between border-b-2 py-[10px] border-[#00000023] px-[20px]">
            <div
              className="flex items-center gap-[10px] cursor-pointer"
              onClick={() => {
                setEmojiOpen(false), setOpenProfile(true);
              }}
            >
              <div className="w-[30px] h-[30px]">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmzztAiew0e7wDllTEJmmcGWYczQ69CYDilQ&s"
                  alt=""
                />
              </div>
              <div>
                <h3>{userState?.userName}</h3>
              </div>
            </div>
            <div>
              <button
                className="cursor-pointer"
                onClick={() => {
                  setOpenProfile(!openProfile), setEmojiOpen(false);
                }}
              >
                <AiOutlineScan />
              </button>
            </div>
          </div>
          <div className="flex flex-col  justify-between h-[95vh] bg-[#78C5E3] relative">
            <div
              ref={containerRef}
              className="flex flex-col-reverse overflow-y-auto overflow-x-hidden px-3 py-2 "
            >
              {Object.entries(groupedMessages)
                .reverse()
                .map(([date, msgs]) => (
                  <div className="flex flex-col" key={date}>
                    <LineWithDate date={date} />

                    {msgs.map((item) => (
                      <div
                        key={item.docId}
                        className={`relative max-w-[50%] text-black px-3 py-2 rounded-xl mb-2 w-fit gap-[10px]
                          
                          ${
                            item.role === "admin"
                              ? "self-end bg-[#DFF5FD]"
                              : "self-start bg-white"
                          } `}
                      >
                        <ContextMenu>
                          <ContextMenuTrigger className={` `}>
                            {item.message && (
                              <div
                                className={` relative whitespace-pre-wrap break-words break-all ${
                                  item.message.length > 50
                                    ? "pb-5"
                                    : "pr-[50px]"
                                } ${
                                  item.message.length <= 50 &&
                                  item.editMessage &&
                                  "pr-[75px]"
                                }`}
                              >
                                {updateMessage &&
                                  updateMessage.docId === item.docId && (
                                    <div className="pl-[30px]">
                                      <p>{updateMessage.message}</p>
                                    </div>
                                  )}
                                <div>
                                  <p
                                    className={`${
                                      item.role === "bot" && "text-black"
                                    } `}
                                  >
                                    {updateMessage?.docId !== item.docId &&
                                      item.message}
                                  </p>
                                </div>
                              </div>
                            )}
                            <div
                              className={`absolute flex right-[5px] bottom-[5px] text-black text-[12px] `}
                            >
                              <p className="pr-[3px]">{item.editMessage && "edit"}</p>
                              {formatChatDate(
                                item?.createAt
                                  ? new Date(item.createAt)
                                  : new Date()
                              )}
                            </div>
                          </ContextMenuTrigger>
                          <ContextMenuContent>
                            {item.role === "admin" && (
                              <ContextMenuItem
                                onClick={() => setEditMessage(item)}
                              >
                                edit
                              </ContextMenuItem>
                            )}
                            <ContextMenuItem onClick={() => handleDelete(item)}>
                              delete
                            </ContextMenuItem>
                            <ContextMenuItem>copy</ContextMenuItem>
                          </ContextMenuContent>
                        </ContextMenu>

                        <div
                          className={`absolute flex gap-[10px] right-[-30px] bottom-[20px] text-black text-[12px]  ${
                            item.editMessage &&
                            item.role === "bot" &&
                            "right-[-35px]"
                          }`}
                        ></div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
            <div className="pb-[15px]">
              {editMessage && (
                <div
                  className={`w-full  flex justify-between py-[5px] px-[10px] bg-white ${
                    editMessage.link ? "h-[70px]" : "h-[50px]"
                  }`}
                >
                  {editMessage.link && editMessage.link?.type && (
                    <div className="flex gap-[10px] items-center">
                      {editMessage.link?.type === "img" && (
                        <img
                          className="w-[40px] h-[40px] rounded-[5px]"
                          src={editMessage.link.url}
                          alt=""
                        />
                      )}
                      <div className="flex flex-col">
                        <strong className="font-semibold text-[14px]">
                          Edit message
                        </strong>
                        {editMessage.link?.type === "img" && (
                          <p>
                            {editMessage.message
                              ? editMessage.message
                              : "Photo"}
                          </p>
                        )}
                        {editMessage.link?.type === "voice" && (
                          <p>
                            Voice message{" "}
                            {editMessage.message && "," && editMessage.message}
                          </p>
                        )}
                        {editMessage.link?.type === "file" && <p></p>}
                      </div>
                    </div>
                  )}
                  {editMessage.message && (
                    <div>
                      <div className="flex flex-col">
                        <strong className="font-semibold text-[14px]">
                          Edit message
                        </strong>
                        <p className="text-[14px]">{editMessage.message}</p>
                      </div>
                    </div>
                  )}

                  <button
                    className="cursor-pointer "
                    onClick={() => setEditMessage(undefined)}
                  >
                    <MdOutlineCancel className="w-[20px] h-[20px] text-black mr-[10px]" />
                  </button>
                </div>
              )}
              <InputDetail />
            </div>
          </div>
        </div>
        {emojiOpen && (
          <div className="min-w-[300px] max-w-[300px] overflow-hidden">
            <EmojiDatas />
          </div>
        )}

        {openProfile && !emojiOpen && (
          <div className="min-w-[300px] max-w-[300px] overflow-hidden">
            <Profile userState={userState} />
          </div>
        )}
      </div>
    </>
  );
};

export default MessageDetail;
