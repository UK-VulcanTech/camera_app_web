import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useLogin } from "../../services/auth/auth.hooks";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 6 characters"),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("auth_token");
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const { email, password } = data;

    login(
      { email, password },
      {
        onSuccess: () => {
          setMessage("User logged in successfully!");
          toast.success("User logged in successfully!");
          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);
        },
        onError: (error) => {
          setMessage(error || "Failed to login. Please try again!");
          toast.error(error || "Failed to login! Please try again.");
        },
      }
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to to-gray-200">
      <div className="w-full  flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-96 p-6 m-2 reflection rounded-lg shadow-2xl bg-white/10 backdrop-blur-md border border-white/20"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Login
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              {...register("email")}
              placeholder="abc@example.com"
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
          {message && (
            <p
              className={` text-sm ${
                message?.includes("success") ? "text-green-600" : "text-red-500"
              } `}
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className="my-2 w-full cursor-pointer bg-theme-blue text-white py-2 rounded-lg hover:bg-theme-darkBlue transition duration-300"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
