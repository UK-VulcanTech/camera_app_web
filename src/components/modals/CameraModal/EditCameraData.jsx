import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDashboardStore } from "../../../store/appStore";
import { useEditCamera } from "../../../services/camera/camera.hooks";
import { toast, ToastContainer } from "react-toastify";

// Correct IP validation regex
const ipRegex =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;

const cameraSchema = z.object({
  name: z.string().min(2, "Place name is required!"),
  username: z
    .string()
    .min(2, "Username is required!")
    .optional()
    .or(z.literal("")),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters!")
    .optional()
    .or(z.literal("")),
  ip: z.string().regex(ipRegex, "Invalid IP address format!"),
  port: z.string().min(1, "Port must be alteast 1 digit."),
  extended_path: z.string().optional(),
});

const EditCameraData = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutateAsync: editCamera, isPending } = useEditCamera();
  const [message, setMessage] = useState("");
  const cameraDetails = useDashboardStore((state) => state.cameraDetails);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      name: cameraDetails.name || "",
      ip: cameraDetails.ip || "",
      port: cameraDetails.port?.toString() || "",
      username: cameraDetails.username || "",
      password: cameraDetails.password || "",
      extended_path: cameraDetails.extended_path || "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const cameraId = cameraDetails.id;
      const response = await editCamera({ data, cameraId });
      if (response) {
        setMessage("Camera updated successfully!");
        toast.success("Camera updated successfully!");
        console.log("Camera updated successfully!");
        setTimeout(() => onClose(), 3000);
      }
    } catch (error) {
      console.error(error);
      toast.error(error || "Error while updating camera. Please try again!");
      setMessage("Error while updating camera. Please try again!");
    }
  };

  const formatIp = (value) => {
    const cleaned = value.replace(/[^\d]/g, "");
    const parts = [];
    for (let i = 0; i < cleaned.length && parts.length < 4; i += 3) {
      parts.push(cleaned.slice(i, i + 3));
    }
    return parts.join(".");
  };

  return (
    <div className="flex items-center justify-center">
      <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 xl:w-[32vw] lg:w-[42vw] md:w-[52vw] w-[72vw] h-auto p-6 rounded-lg bg-white">
        <h1 className="text-xl font-semibold mb-2">Edit Camera Details</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {[
            {
              name: "name",
              placeholder: "Lobby, Garage etc.",
              label: "Place Name",
            },
            {
              name: "username",
              placeholder: "Username",
              label: "Username",
            },
            {
              name: "password",
              placeholder: "******",
              label: "Password",
              type: showPassword ? "text" : "password",
              isPassword: true,
            },
            {
              name: "ip",
              placeholder: "192.168.0.1",
              label: "IP Address",
              isIp: true,
            },
            {
              name: "port",
              placeholder: "0000",
              label: "Port",
            },
            {
              name: "extended_path",
              placeholder: "Extended Path",
              label: "Extended Path",
            },
          ].map(
            ({ name, placeholder, label, type = "text", isPassword, isIp }) => (
              <div className="mb-4 relative" key={name}>
                <label className="block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <Controller
                  name={name}
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) =>
                        isIp
                          ? onChange(formatIp(e.target.value))
                          : onChange(e.target.value)
                      }
                      className={`mt-1 w-full px-4 py-2 rounded-lg border ${
                        errors[name]
                          ? "border-red-500"
                          : "border-gray-300 focus:ring-theme-blue"
                      } focus:outline-none focus:ring-1`}
                    />
                  )}
                />
                {isPassword && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[34px] text-sm text-theme-blue hover:underline focus:outline-none"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}
                {errors[name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[name]?.message}
                  </p>
                )}
              </div>
            )
          )}

          {message && (
            <p
              className={` text-sm mb-2 font-semibold ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              } `}
            >
              {message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-theme-blue text-white py-2 rounded-lg hover:bg-theme-darkBlue transition duration-300"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditCameraData;
