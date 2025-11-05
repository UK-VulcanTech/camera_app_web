import { useRef, useState } from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  const mainRef = useRef(null);
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className=" flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-x-auto relative">
        {/* TopBar always above children */}
        <TopBar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

        {/* Scrollable children */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto  overflow-x-auto "
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
