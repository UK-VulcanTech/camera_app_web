import { useState } from "react";
import { aiIcons, ioIcons, mdIcons } from "../../../global/icons";
import {
  useDeleteUser,
  useGetUsers,
} from "../../../services/Users/users.hooks";
import CreateUser from "../../../components/modals/UsersModalSection/CreateUser";
import CreateUserData from "../../../components/modals/UsersModalSection/CreateUserData";
import DeleteAlert from "../../../components/modals/DeleteAlertModal/DeleteAlert";
import DeleteAlertData from "../../../components/modals/DeleteAlertModal/DeleteAlertData";
import { useDashboardStore } from "../../../store/appStore";
import EditUser from "../../../components/modals/UsersModalSection/EditUser";
import EditUserData from "../../../components/modals/UsersModalSection/EditUserData";
import TopBar from "../../../layout/TopBar";
import { toast, ToastContainer } from "react-toastify";

const Users = () => {
  const { data: users, isPending: listLoading } = useGetUsers();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { mutateAsync: deleteRecord, isPending } = useDeleteUser();
  const { setUserDetails } = useDashboardStore();

  const handleDelete = async (id) => {
    try {
      const response = await deleteRecord(id);
      if (response) {
        toast.success("User deleted successfully!");
        setTimeout(() => {
          setIsDeleteModal(false);
        }, 100);
      }
    } catch (error) {
      console.error("Error while deleting: ", error);
      toast.error(error || "Failed to delete user!");
    }
  };
  return (
    <>
      <TopBar
        searchData={users?.data}
        setFilteredData={setFilteredData}
        func={"users"}
      />
      <div className="px-12 pb-8">
        {/* Heading Section */}
        <div className="my-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Users Listing
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Get a list of all registered users and manage their details.
          </p>
        </div>
        <div className="w-full text-right mb-4">
          <button
            onClick={() => setIsOpen(true)}
            className="px-[1rem] py-[0.5rem] rounded-lg cursor-pointer hover:bg-theme-blue bg-theme-darkBlue text-white"
          >
            <span className="flex items-center gap-1">{ioIcons.IoMdAdd} Create New User</span>
          </button>
        </div>
        {/* Users Table */}
        <div className=" bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full border border-gray-100 shadow-lg">
            <thead className="text-sm lg:text-base bg-theme-darkBlue text-white ">
              <tr className="">
                <th className="px-4 py-2 font-semibold text-left">Sr.</th>
                <th className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                  Role
                </th>
                <th className="px-4 py-2 font-semibold text-center whitespace-nowrap">
                  Action Center
                </th>
              </tr>
            </thead>
            <tbody className="text-sm lg:text-base divide-y divide-gray-300">
              {listLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Loading Data...
                  </td>
                </tr>
              ) : filteredData?.length > 0 ? (
                filteredData?.map((user, index) => (
                  <tr key={index} className=" hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {index + 1}.
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {user.name}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {user.email}
                    </td>
                    <td
                      className={`px-4 py-2 whitespace-nowrap text-sm text-gray-700
                   `}
                    >
                      <p
                        className={`px-2 py-1 w-20 text-center rounded-2xl ${
                          user.role === "admin" &&
                          "bg-yellow-100 text-yellow-600"
                        } 
                           ${
                             user.role === "user" &&
                             "bg-[#b2d6e4] text-[#365866]"
                           }

                           ${
                             user.role === "manager" &&
                             "bg-[#9be9a9] text-[#385f40]"
                           }

                            ${
                              user.role === "operator" &&
                              "bg-[#e3aad7] text-[#57385f]"
                            }
                            `}
                      >
                        {" "}
                        {user.role}
                      </p>
                    </td>
                    <td className="flex items-center justify-center py-2 gap-4">
                      <p
                        onClick={() => {
                          setIsEditModal(true), setUserDetails(user);
                        }}
                        className="px-3 py-1 cursor-pointer rounded-lg text-2xl text-gray-700"
                      >
                        {aiIcons.AiOutlineEdit}
                      </p>
                      <p
                        onClick={() => {
                          setIsDeleteModal(true), setUserId(user.id);
                        }}
                        className="px-3 py-1 cursor-pointer rounded-lg text-2xl text-gray-700"
                      >
                        {mdIcons.MdOutlineDeleteSweep}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    Not Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ToastContainer />

        {isOpen && (
          <CreateUser open={isOpen} onClose={() => setIsOpen(false)}>
            <CreateUserData onClose={() => setIsOpen(false)} />
          </CreateUser>
        )}

        {isEditModal && (
          <EditUser open={isEditModal} onClose={() => setIsEditModal(false)}>
            <EditUserData onClose={() => setIsEditModal(false)} />
          </EditUser>
        )}

        {isDeleteModal && (
          <DeleteAlert
            open={isDeleteModal}
            onClose={() => setIsDeleteModal(false)}
          >
            <DeleteAlertData
              onClose={() => setIsDeleteModal(false)}
              onDelete={() => handleDelete(userId)}
              isLoading={isPending}
            />
          </DeleteAlert>
        )}
      </div>
    </>
  );
};

export default Users;
