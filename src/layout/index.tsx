import { Outlet } from "react-router-dom";
import Topbar from "../components/header/topbar";

const MainLayout = () => {
  return (
    <div className="flex">
        <div className="">
          <Topbar />
        </div>
        <div className="w-[94%] h-[100vh]">
          <Outlet />
        </div>
    </div>
  );
};

export default MainLayout;
