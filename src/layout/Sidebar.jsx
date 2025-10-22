import { useEffect, useState } from "react";
import { faIcons, hiIcons, mdIcons } from "../global/icons";
import { useDashboardStore } from "../store/appStore";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const { sideBarOption, setSideBarOption } = useDashboardStore();
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    // Sync the sidebar option with the current route
    const path = location.pathname;

    if (path.includes("/camera")) {
      setSideBarOption("Camera");
    } else if (path.includes("/users")) {
      setSideBarOption("Users");
    } else if (path.includes("/alerts")) {
      setSideBarOption("Camera");
    } else {
      setSideBarOption("Dashboard");
    }
  }, [setSideBarOption]);

  const sideBarList = [
    {
      id: 0,
      label: "Dashboard",
      icon: mdIcons.MdSpaceDashboard,
    },
    {
      id: 1,
      label: "Camera",
      icon: faIcons.FaCameraRetro,
    },
    {
      id: 2,
      label: "Users",
      icon: hiIcons.HiMiniUsers,
    },
    {
      id: 3,
      label: "Logout",
      icon: mdIcons.MdLogout,
    },
  ];

  const handleNavigation = (item) => {
    setSideBarOption(item.label);
    if (item.label === "Dashboard") {
      navigate("/dashboard");
    } else if (item.label === "Camera") {
      navigate("/camera");
    } else if (item.label === "Users") {
      navigate("/users");
    } else if (item.label === "Logout") {
      localStorage.removeItem("auth_token");
      window.location.reload();
    }
  };

  return (
    <>
      <div
        onClick={() => setOpenSidebar(true)}
        className={` ${
          !openSidebar ? "absolute z-10" : "hidden"
        }  left-1 h-screen top-4 md:hidden p-1 me-2 text-xl text-black `}
      >
        {hiIcons.HiMiniArrowRightOnRectangle}
      </div>
      <div
        className={`${
          openSidebar ? "max-md:absolute z-10" : "max-md:hidden"
        } md:block  w-48 lg:w-64 p-4 bg-[#142a3e] text-white `}
      >
        {/* Logo section */}
        <div className="flex items-center justify-between cursor-pointer pb-4 border-b-1 border-white/50">
          <p className="font-semibold text-lg lg:text-2xl text-center">
            Smart Security
          </p>
          <div
            onClick={() => setOpenSidebar(false)}
            className="md:hidden text-base font-bold text-white"
          >
            {mdIcons.MdArrowBackIosNew}
          </div>
        </div>
        {/* Navigation List Section */}
        <div className="flex flex-col py-4 gap-2">
          {sideBarList.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex items-center justify-start gap-2 py-1 p-2 rounded-md cursor-pointer text-white hover:bg-gray-700 ${
                item.label === sideBarOption ? "bg-gray-700" : "bg-none"
              } `}
            >
              <p>{item.icon}</p>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
