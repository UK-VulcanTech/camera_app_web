
import { faIcons, hiIcons, ioIcons } from "../global/icons";
import { useDashboardStore } from "../store/appStore";

const TopBar = ({openSidebar, setOpenSidebar}) => {
  const setSearchItem = useDashboardStore((state) => state.setSearchItem);

  const hideSearchRoutes = ["/dashboard"];

  const shouldHideSearch = hideSearchRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const handleSearchQuery = (query) => {
    setSearchItem(query);
  };
  return (
    <div className="h-16 px-2 sm:pe-12 flex justify-between items-center gap-4 w-full shadow-md border-b border-gray-300 bg-white">
      {/* Menu Icon */}
      <div
        onClick={() => setOpenSidebar(true)}
        className={` ${
          !openSidebar ? "block" : "hidden"
        }  md:hidden p-1 me-2 text-xl text-black `}
      >
        {hiIcons.HiMiniArrowRightOnRectangle}
      </div>

      {/* Search and Profile Section */}
      <div className="flex justify-end items-center w-full">
        {!shouldHideSearch && (
          <div className="mx-2 w-9/12 md:w-6/12 relative">
            <p className="absolute top-3 left-3 text-gray-500">
              {ioIcons.IoSearchOutline}
            </p>
            <input
              onChange={(e) => handleSearchQuery(e.target.value)}
              className="p-2 ps-8 text-sm w-full rounded-3xl outline-none border-1 border-gray-200"
              placeholder="Search here..."
            />
          </div>
        )}
        <p className="text-base rounded-full p-1 bg-gray-200 text-gray-400">
          {faIcons.FaUser}
        </p>
      </div>
    </div>
  );
};

export default TopBar;
