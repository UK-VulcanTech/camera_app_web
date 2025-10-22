import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateUsers } from "../../../services/Users/users.hooks";

const userSchema = z.object({
  name: z.string().min(3, "Please enter more that 3 characters!"),
  email: z.string().email("Invalid email address!"),
  password: z.string().min(6, "Password must be at least 6 characters!"),
  role: z.string().nonempty("Role should not be empty!"),
});
const CreateUserData = ({ onClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: create_user, isPending } = useCreateUsers();
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  const createUser = async (data) => {
    // create_user(data, {
    //   onSuccess: () => {
    //     setMessage("User created successfully!");
    //     console.log("User created Successfully!");
    //   },
    //   onError: (error) => {
    //     setMessage(error?.message);
    //     console.error(error || "Failed to create user! Please try again.");
    //   },
    // });
    try {
      const response = await create_user(data);
      if (response) {
        setMessage("User created successfully!");
        onClose();
        console.log("User created Successfully!");
      }
    } catch (error) {
      if (error?.response) {
        setMessage(error?.response?.data?.detail);
      } else {
        setMessage("Error while creating user, please try again!");
      }
      console.error(
        "Failed to create user! Please try again.",
        error?.response?.data?.detail
      );
    }
  };
  return (
    <div className="flex items-center justify-center">
      <div className="fixed top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 xl:w-[32vw] lg:w-[42vw] md:w-[52vw] w-[72vw] h-auto p-6 rounded-lg bg-white">
        <h1 className="text-xl font-semibold">Create User</h1>
        <form onSubmit={handleSubmit(createUser)}>
          <div className="my-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              {...register("name")}
              placeholder="Type your name..."
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-theme-blue"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="Type your email..."
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-theme-blue"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Type your password..."
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-theme-blue"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-sm text-theme-blue hover:underline focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              {...register("role")}
              className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-theme-blue"
            >
              <option>Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="operator">Operator</option>
            </select>
          </div>
          {message && (
            <p
              className={` text-sm mb-2 font-semibold ${
                message.includes("success") ? "text-green-600" : "text-red-500"
              } `}
            >
              {message}
            </p>
          )}
          {/* Buttons section */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onClose}
              className="my-2 w-full cursor-pointer bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
            >
              {"Cancel"}
            </button>
            <button
              type="submit"
              className="my-2 w-full cursor-pointer bg-theme-blue text-white py-2 rounded-lg hover:bg-theme-darkBlue transition duration-300"
            >
              {isPending ? "Loading..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserData;
