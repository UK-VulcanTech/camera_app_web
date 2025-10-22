import { useNavigate } from "react-router-dom";
import {
  useDeleteCamera,
  useGetCameraList,
} from "../../../services/camera/camera.hooks";
import { useDashboardStore } from "../../../store/appStore";
import { aiIcons, mdIcons } from "../../../global/icons";
import { useState } from "react";
import EditCamera from "../../../components/modals/CameraModal/EditCamera";
import EditCameraData from "../../../components/modals/CameraModal/EditCameraData";
import DeleteAlert from "../../../components/modals/DeleteAlertModal/DeleteAlert";
import DeleteAlertData from "../../../components/modals/DeleteAlertModal/DeleteAlertData";
import TopBar from "../../../layout/TopBar";

const Camera = () => {
  const { data: cameraList, isPending: listLoading } = useGetCameraList();
  const { setCameraDetails } = useDashboardStore();
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [cameraId, setCameraId] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { mutateAsync: deleteCamera, isPending } = useDeleteCamera();
  const navigate = useNavigate();

  const handleAlertClick = (id) => {
    navigate(`/alerts/${id}`);
  };
  const handleZoneClick = (cameraDetail) => {
   
    setCameraDetails(cameraDetail);
    setTimeout(() => {
      navigate(`/cameraStream`);
    }, 500);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCamera(id);
      if (response) {
        setTimeout(() => {
          setIsDeleteModal(false);
        }, 100);
      }
    } catch (error) {
      console.error("Error while deleting: ", error);
    }
  };

  return (
    <>
      <TopBar
        searchData={cameraList}
        setFilteredData={setFilteredData}
        func={"camera"}
      />
      <div className="px-12 pb-8">
        {/* Heading Section */}
        <div className="my-4 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Camera Listing
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Get a list of all registered cameras.
          </p>
        </div>

        {/* Table content section */}
        <div className=" bg-white rounded-xl shadow-md overflow-x-auto">
          <table className="min-w-full border border-gray-100 shadow-lg">
            <thead className="text-sm lg:text-base bg-theme-darkBlue text-white ">
              <tr className="">
                <th className="px-4 py-2 font-semibold text-left">Sr.</th>
                <th className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                  Camera Id
                </th>
                <th className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                  Camera Name
                </th>
                <th className="px-4 py-2 font-semibold text-left whitespace-nowrap">
                  Operations
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
                filteredData.map((camera, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {index + 1}.
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {camera.id}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                      {camera.name}
                    </td>
                    <td className="py-2 text-white">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleAlertClick(camera.id)}
                          className="px-2 py-1 text-sm cursor-pointer rounded-lg bg-theme-blue hover:bg-[#3270ba] hover:text-white"
                        >
                          Alerts
                        </button>
                        <button
                          onClick={() => handleZoneClick(camera)}
                          className="px-3 py-1 text-sm cursor-pointer rounded-lg bg-theme-darkBlue hover:bg-[#3a4f63] hover:text-white"
                        >
                          View Zones
                        </button>
                      </div>
                    </td>
                    <td className="py-2 text-white">
                      <div className="flex items-center justify-center py-2 gap-2">
                        <button
                          onClick={() => {
                            setIsEditModal(true);
                            setCameraDetails(camera);
                          }}
                          className="px-3 py-1 cursor-pointer rounded-lg text-2xl text-gray-700"
                        >
                          {aiIcons.AiOutlineEdit}
                        </button>
                        <button
                          onClick={() => {
                            setIsDeleteModal(true);
                            setCameraId(camera.id);
                          }}
                          className="px-3 py-1 cursor-pointer rounded-lg text-2xl text-gray-700"
                        >
                          {mdIcons.MdOutlineDeleteSweep}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No Data found!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {isEditModal && (
          <EditCamera open={isEditModal} onClose={() => setIsEditModal(false)}>
            <EditCameraData onClose={() => setIsEditModal(false)} />
          </EditCamera>
        )}

        {isDeleteModal && (
          <DeleteAlert
            open={isDeleteModal}
            onClose={() => setIsDeleteModal(false)}
          >
            <DeleteAlertData
              onClose={() => setIsDeleteModal(false)}
              onDelete={() => handleDelete(cameraId)}
              isLoading={isPending}
            />
          </DeleteAlert>
        )}
      </div>
    </>
  );
};

export default Camera;
