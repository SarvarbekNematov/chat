import { NavLink, Outlet } from "react-router-dom";
import { useUsersRealtime } from "@/hooks/useUsers";
import {
  markAllMessagesAsRead,
  useUsersLastMessagesRealtime,
} from "@/hooks/useLastMessages";
import { getNewMessageCountForUser } from "@/components/newMessageCount";
import { useEffect, useState } from "react";
import { BiCheckDouble } from "react-icons/bi";
import { formatDateForPreview } from "@/components/dates/formatDate";

const Dashboard = () => {
  const { users, loading } = useUsersRealtime();
  const { lastMessages } = useUsersLastMessagesRealtime(users);
  const [newMessageCounts, setNewMessageCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    if (!users) return;

    const fetchCounts = async () => {
      const counts: Record<string, number> = {};
      for (const user of users) {
        const count = await getNewMessageCountForUser(String(user.userId));
        if (count > 0) {
          counts[user.userId] = count;
        }
      }
      setNewMessageCounts(counts);
    };

    fetchCounts();
  }, [users, lastMessages]);

  if (loading) <div>...loading</div>;


  return (
    <div className="flex">
      <div className="w-[30%] border-r-2 border-[#00000034] h-[100vh] overflow-y-scroll">
        <h2 className=" pb-[21.5px] pl-[10px]">All messages</h2>
        <ul className="flex flex-col">
          {users?.map((user) => {
            const msg = lastMessages.find((m) => m.userId === user.userId);
            const count = newMessageCounts[user.userId];

            return (
              <li key={user.userId}>
                <NavLink
                  className={`flex gap-[10px] items-center p-[7.5px] h-[] pr-[10px] `}
                  to={`/message/${user.userId}`}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "#419FD9" : "",
                    color: isActive ? "white" : ''
                  })}
                  onClick={() => {
                    markAllMessagesAsRead(String(user.userId));
                    setNewMessageCounts((prev) => {
                      const updated = { ...prev };
                      delete updated[user.userId];
                      return updated;
                    });
                  }}
                >
                  <div className="w-[50px] h-[50px] rounded-[50%]">
                    <img
                      className="rounded-[50%] w-full h-full"
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmzztAiew0e7wDllTEJmmcGWYczQ69CYDilQ&s"
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col w-[85%]">
                    <div
                      className={`flex justify-between w-full`}
                      key={user.userId}
                    >
                      <h3 className="text-[16px]">{user.userName}</h3>
                      <span>
                        <p className="text-[14px]">{user.service}</p>
                      </span>
                    </div>
                    <div className="flex justify-between gap-[10px]">
                      <p className="whitespace-nowrap overflow-hidden text-ellipsis w-[220px]">
                        {msg?.message}
                      </p>
                      {msg?.link?.type &&
                        msg.userId === user.userId &&
                        msg.link?.type === "img" && (
                          <p className="flex items-center gap-[10px] ">photo</p>
                        )}
                      <div className="flex items-center gap-[5px]">
                        {count > 0 && (
                          <span className="bg-blue-500 text-white w-[20px] h-[20px] text-[13px] flex justify-center items-center p-[5px] rounded-[50%]">
                            {count}
                          </span>
                        )}
                        {msg?.role === "admin" && (
                          <span>
                            <BiCheckDouble />
                          </span>
                        )}
                        <div className="flex max-w-[80px] justify-end">
                          {formatDateForPreview(msg?.createAt ?? "")}
                        </div>
                      </div>
                    </div>
                  </div>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-[70%] ">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
