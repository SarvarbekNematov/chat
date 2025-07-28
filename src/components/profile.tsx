import { CallIcon } from "@/assets/icons";
import type { BackendDataType } from "@/types";
import { MdOutlineEmail } from "react-icons/md";

interface ProfileType {
  userState: BackendDataType | undefined;
}

const Profile = ({ userState }: ProfileType) => {

  return (
    <div className=" border-l-2 pl-[20px] overflow-y-scroll h-[100vh] border-[#00000023]">
      <div>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmzztAiew0e7wDllTEJmmcGWYczQ69CYDilQ&s"
          alt={userState?.userName}
        />
      </div>
      <h3 className="text-[20px]">{userState?.userName}</h3>
      <div className="flex flex-col gap-[5px]">
        <div className="flex items-center gap-[4px]">
        <span>
          <CallIcon />
        </span>
        <p>{userState?.phone}</p>
      </div>
      <div className="flex items-center gap-[4px]">
        <span>
          <MdOutlineEmail />
        </span>
        <p className={`${!userState?.email && "text-[#00000060]"}`}>{userState?.email ? userState.email : "Not Available"}</p>
      </div>
      </div>
      
    </div>
  );
};

export default Profile;
