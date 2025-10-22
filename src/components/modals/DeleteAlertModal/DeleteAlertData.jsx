import React from "react";
import { ClipLoader } from "react-spinners";
import { tiIcons } from "../../../global/icons";

const DeleteAlertData = ({ onClose, onDelete, isLoading }) => {
  return (
    <div className="flex items-center justify-center h-screen ">
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 xl:w-[28vw] lg:w-[42vw] md:w-[52vw] w-[72vw] h-auto p-6 rounded-lg bg-white text-solutyics-gray">
        <p className="flex justify-center mb-4 text-6xl text-red-400">
          {tiIcons.TiDeleteOutline}
        </p>
        <h1 className="text-center mb-6 text-lg text-solutyics-gray">
          Do you want to delete this record?
        </h1>
        <div className="flex flex-row justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 mr-4 text-center text-md rounded-md cursor-pointer text-white bg-neutral-500"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center px-6 py-2 text-center text-md cursor-pointer rounded-md text-white bg-red-600"
          >
            <span>Delete</span>
            {/* Loader */}
            {isLoading && (
              <div className="flex self-center ml-2">
                <ClipLoader color="#ffffff" loading={isLoading} size={20} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAlertData;
