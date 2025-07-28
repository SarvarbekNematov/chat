import { ContactIcon, MessageIcon, OverviewIcon } from "@/assets/icons";
import { NavLink } from "react-router-dom";

const Topbar = () => {
  return (
    <div className="bg-[#293A4C] text-white h-[100vh] xl:w-[80px]">
      <h2 className="text-center text-[#8393A3] text-[17px]">Nolbir </h2>
      <div className="flex flex-col mt-[20px]">
        <NavLink
          className={({ isActive }) =>
            `py-[10px] h-[65px] ${location.pathname.startsWith("/message") || isActive
              ? "bg-[#17212B]"
              : ""}`
          }
          to={"/"}
          end={false}
        >
          <span className="flex flex-col gap-[5px] items-center text-[14px] xl:w-[80px] box-border text-center text-[#8393A3]">
            <MessageIcon />
            Message
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `py-[10px] h-[65px] ${location.pathname.startsWith("/contact") || isActive
              ? "bg-[#17212B]"
              : ""}`
          }
          to={"/contact"}
        >
          <span className="flex flex-col gap-[5px] items-center text-[14px] xl:w-[80px] box-border text-center text-[#8393A3]">
            <ContactIcon />
            Contacts
          </span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `py-[10px] h-[65px] ${location.pathname.startsWith("/overview") || isActive
              ? "bg-[#17212B]"
              : ""}`
          }
          to={"/overview"}
        >
          <span className="flex flex-col gap-[5px] items-center text-[14px] xl:w-[80px] box-border text-center text-[#8393A3]">
            <OverviewIcon />
            Overview
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default Topbar;
