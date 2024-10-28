// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password }
      );

      const { token, role } = response.data;
      login(token, role);
      setError(""); // Clear error on successful login
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="flex font-space items-center justify-center min-h-screen px-4 sm:px-8 lg:px-20">
      <div className="flex flex-col items-center justify-center w-full mx-[15%]">
        <h1 className="font-bold font-space text-center text-4xl mb-6">
          Login to Your Account
        </h1>
        <p className="text-space font-normal font-space text-center text-[#555458] max-w-[60%] max-md:hidden mb-10">
          Welcome back! Please log in to access your tasks and projects. Stay organized and collaborate effectively with your team. Let's get to work!
        </p>
        <div className="flex flex-col lg:flex-row w-full justify-between">
          <div className="flex-1 p-4 flex flex-col justify-center items-center">
            <input
              type="text"
              className="mt-1 mb-4 w-[80%] block border border-gray-300 rounded-md p-2"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="mt-1 w-[80%] mb-4 block border border-gray-300 rounded-md p-2"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              size="lg"
              className="w-[80%] mt-1 rounded-md p-2 flex justify-center content-center hover:bg-white hover:border-black hover:text-black hover:border-2"
              onClick={handleLogin}
            >
              Login to Your Account <ArrowRightIcon className="ml-3" />
            </Button>
          </div>
        </div>
        <div className="mt-16 text-sm flex flex-col justify-center content-center text-center text-[#555458] mb-[5%]">
          <a
            href="#"
            className="mr-4 mb-2 underline hover:font-semibold hover:text-black"
          >
            Forgot Password?
          </a>
          <div className="text-inter font-normal">
            <span>Don't have an account yet?</span>
            <a
              href="#"
              className="text-inter font-semibold ml-2 text-black hover:underline"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
