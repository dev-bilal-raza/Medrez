import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import LoginImage from "../assets/login.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://medrezserver-lake.vercel.app:5000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const userRole = response.data.user.role;

      console.log(`User Role is: ${userRole}`);

      if (userRole === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError(error.response ? error.response.data.message : "Server error");
    }
  };

  return (
    <div>
      <div className="grid sm:grid-cols-2">
        <div className="hidden sm:block">
          <img src={LoginImage} className="h-full object-cover" alt="Login" />
        </div>
        <div className="py-8 px-16">
          <div className="mb-10">
            <h1 className="text-[#11BE79] font-bold text-3xl py-6">
              MedRez<span className="text-blue-500 font-normal">.net</span>
            </h1>
          </div>
          <div className="xl:w-[80%] flex flex-col gap-3 my-3">
            <h1 className="text-[#010F2D] font-heading font-semibold text-4xl  sm:text-3xl md:text-5xl py-3">Welcome Back!</h1>
            <p className="text-[#808080] font-para font-normal text-base lg:text-lg lg:leading-8">
              If you have an account, then login; otherwise, first register an
              account and enjoy our services.
            </p>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-[80%] gap-2 mb-4 mt-3">
              <label className="text-[#010F2D] font-medium font-para text-base">Email Address</label>
              <input
                type="email"
                name="email"
                className="border-2 p-2 py-3 rounded-md bg-[#E8F0FE] focus:outline-none focus:ring-2 focus:ring-[#11BE79]"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="flex flex-col w-[80%] gap-3">
              <label
                className="text-[#010F2D] font-medium text-base md:text-lg"
              >
                Password
              </label>
              <div
                className="relative border p-2 py-3 rounded-md bg-[#E8F0FE] focus-within:ring-2 focus-within:ring-[#11BE79] shadow-sm"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full bg-transparent outline-none text-sm md:text-base pr-12 placeholder-gray-500"
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer text-gray-600 hover:text-[#11BE79]"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 md:w-6 md:h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.494M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <button
                type="submit"
                className="px-8 py-2 bg-[#11BE79] w-fit text-white rounded-md mt-4 hover:bg-[#0FAE6B] transition duration-200"
              >
                Login
              </button>
            </div>
          </form>
          <div className="h-[1.5px] bg-[#DDDDDD] w-[80%] my-7" />
          <div className="flex flex-col gap-1 text-[#6E6E6E] font-para text-base sm:text-sm md:text-base">
            <p>
              Don't have an account?
              <Link to={"/signup"}>
                {" "}
                <span className="text-[#11BE79]">
                  {" "}
                  <u>Sign Up</u>
                </span>
              </Link>
            </p>
            <p className="">Create a new account to schedule your medical events!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;



