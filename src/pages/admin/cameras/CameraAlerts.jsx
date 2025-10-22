import { useParams } from "react-router-dom";
import { goIcons, ioIcons, luIcons, tbIcons } from "../../../global/icons";
import { useGetAlertsById } from "../../../services/camera/camera.hooks";
import { formatTimeStamp } from "../../../utils/formatDate";

const CameraAlerts = () => {
  const { id } = useParams();
  const { data: cameraAlerts } = useGetAlertsById(id);

  return (
    <div className="px-12 pb-8">
      {/* Heading Section */}
      <div className="my-4 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Alerts</h1>
        <p className="mt-2 text-sm text-gray-500">Get realtime alerts.</p>
      </div>

      <div className="my-12">
        {cameraAlerts?.length > 0 ? (
          cameraAlerts?.map((alert) => (
            <div
              className="flex items-center gap-4 p-2 py-4 mb-4 rounded-lg shadow-lg border-l-2 border-red-500"
              key={alert.id}
            >
              <p className="text-2xl p-2 rounded-full bg-red-100 text-red-500 ">
                {tbIcons.TbAlertTriangle}
              </p>
              <div className="flex flex-col gap-2">
                <p className="font-semibold">{alert.message}</p>
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <p className="flex items-center gap-2">
                    <span>{luIcons.LuCamera}</span>Camera: {alert.camera_id}
                  </p>
                  <p className="flex items-center gap-1">
                    <span>{goIcons.GoTag}</span>
                    {alert.event_type}
                  </p>
                  <p className="flex items-center gap-1">
                    <span>{ioIcons.IoMdTime}</span>
                    {formatTimeStamp(alert.created_at)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No Alerts Available</p>
        )}
      </div>
    </div>
  );
};

export default CameraAlerts;
