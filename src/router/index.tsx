import MessageDetail from "@/components/messageDetail";
import MainLayout from "@/layout";
import Contact from "@/pages/contacts/contact";
import Dashboard from "@/pages/home/dashboard";
import Login from "@/pages/login";
import Overview from "@/pages/overview";
import { useRoutes } from "react-router-dom";

const MainRouter = () => {
  return (
    <div className="overflow-hidden">
      {useRoutes([
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/",
          element: <MainLayout />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
              children: [
                {
                  path: "/message/:id",
                  element: <MessageDetail />,
                },
              ],
            },
            {
              path: "/contact",
              element: <Contact />,
            },
            {
              path: "/overview",
              element: <Overview />,
            },
          ],
        },
      ])}
    </div>
  );
};

export default MainRouter;
