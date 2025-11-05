import {
  biIcons,
  goIcons,
  ioIcons,
  luIcons,
  tbIcons,
} from "../../../global/icons";
import TopBar from "../../../layout/TopBar";
import {
  useGetAllAlerts,
  useGetCameraCount,
} from "../../../services/camera/camera.hooks";

import { formatTimeStamp } from "../../../utils/formatDate";

const Dashboard = () => {
  const { data: cameraCount } = useGetCameraCount();
  const { data: allAlerts } = useGetAllAlerts();
  const cards = [
    {
      id: 0,
      label: "Active Alerts",
      icon: tbIcons.TbAlertTriangle,
      quantity: allAlerts?.total ? allAlerts?.total : "0",
      iconColor: "text-red-500",
    },
    {
      id: 1,
      label: "Configured Cameras",
      icon: luIcons.LuCamera,
      quantity: cameraCount ? cameraCount : "0",
      iconColor: "text-blue-600",
    },
  ];
  return (
    <div className="px-2 md:px-12 pb-8">
      {/* Heading Section */}
      <div className="max-md:px-12  mt-4 lg:mb-12">
        <h1 className="text-xl lg:text-3xl font-bold">Security Dashboard</h1>
        <p className="my-2 text-xs lg:text-sm text-neutral-500">
          Monitor your security system in real-time.
        </p>
      </div>
      {/* Summary Section - cards */}
      <section className="flex flex-col sm:flex-row gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="flex flex-col justify-center gap-2 w-full lg:w-56 p-4 px-2 md:px-6 rounded-lg border-1 border-gray-200 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-semibold">{card.label}</p>
              <p className={` text-base md:text-xl ${card.iconColor} `}>
                {card.icon}
              </p>
            </div>
            <p className="font-bold text-xl text-center md:text-2xl">
              {card.quantity}
            </p>
          </div>
        ))}
      </section>
      {/* Alerts and System Status Section */}
      <section className="flex flex-col md:flex-row items-start gap-4 mt-4 w-full">
        {/* Recent Alerts section */}
        <div className="p-4 px-2 md:px-6 w-full md:w-1/2 rounded-lg border-1 border-gray-200">
          <h1 className="flex gap-2 items-center text-lg md:text-2xl font-semibold">
            <span>{tbIcons.TbWaveSawTool}</span>Recent Alers
          </h1>
          <p className="text-xs md:text-sm text-neutral-400">
            Latest security alerts from your system
          </p>
          {/* Alerts Container */}
          <div className="my-4">
            {allAlerts?.alerts?.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center mb-2 gap-4 lg:min-w-96 justify-between p-2 px-4 rounded-lg bg-gray-50 border-1 border-neutral-200"
              >
                <div>
                  <p className="text-sm lg:text-base">{alert.message}</p>
                  <p className="flex items-center gap-2 text-xs text-neutral-400">
                    <span>{ioIcons.IoMdTime}</span>
                    {formatTimeStamp(alert.created_at)}
                    <span>CAM {alert.camera_id}</span>
                  </p>
                </div>
                {/* <p className="px-3 py-1 text-xs rounded-3xl bg-red-500 text-white">
                High
                </p> */}
              </div>
            ))}
          </div>
        </div>
        {/* System Status Section */}
        <div className="p-4 px-2 md:px-6 w-full md:w-1/2 rounded-lg border-1 border-gray-200">
          <h1 className="flex gap-2 items-center text-lg md:text-2xl font-semibold">
            <span className="text-green-800">{biIcons.BiShield}</span>System
            Status
          </h1>
          <p className="text-xs md:text-sm text-gray-400">
            Current Status of your security infrastructure
          </p>
          <div className="my-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <p className="text-sm lg:text-base">Camera Network</p>
              <p className="flex items-center gap-2 text-sm lg:text-base text-green-600">
                <span className="">{goIcons.GoDotFill}</span>Online{" "}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm lg:text-base">Motion Detection</p>
              <p className="flex items-center gap-2 text-sm lg:text-base text-green-600">
                <span className="">{goIcons.GoDotFill}</span>Active{" "}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
