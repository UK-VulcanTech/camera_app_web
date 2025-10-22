import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const Layout = ({ children }) => {
  return (
    <div className="layout flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto main-content">{children}</main>
    </div>
  );
};

export default Layout;
