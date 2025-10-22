import { useEffect, useState } from "react";
import { faIcons, ioIcons } from "../global/icons";
// import { useDashboardStore } from "../store/appStore";

const TopBar = ({ searchData, setFilteredData, func }) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    let results = [];
    const searchUsers = () => {
      results = searchData?.filter(
        (item) =>
          item?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          item?.id.toString().includes(searchInput.toString()) ||
          item?.email.toLowerCase().includes(searchInput.toLowerCase()) ||
          item?.role.toLowerCase().includes(searchInput.toLowerCase())
      );
    };
    const searchCamera = () => {
      results = searchData?.filter(
        (item) =>
          item?.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          item?.id.toString().includes(searchInput.toString())
      );
    };
    if (func === "users") {
      searchUsers();
    } else {
      searchCamera();
    }
    setFilteredData(results);
  }, [searchData, searchInput]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    window.location.reload();
  };
  return (
    <div className="h-16 px-8 sm:pe-12 flex justify-end items-center gap-4 w-full shadow-md border-b border-gray-300 bg-white">
      <div className="mx-2  w-6/12 relative">
        <p className="absolute top-3 left-3 text-gray-500">
          {ioIcons.IoSearchOutline}
        </p>
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="p-2 ps-8 text-sm w-full rounded-3xl outline-none border-1 border-gray-200"
          placeholder="Search here..."
        />
      </div>
      <p
        // onClick={() => handleLogout()}
        className="text-base rounded-full p-1 bg-gray-200 text-gray-400"
      >
        {faIcons.FaUser}
      </p>
    </div>
  );
};

export default TopBar;
