import React from "react";
import { Button } from "../components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
const Login = () => {
  return (
    <div className="flex font-space items-center justify-center min-h-screen px-4 sm:px-8 lg:px-20">
      <div className="flex flex-col items-center justify-center w-full mx-[15%]">
        <h1 className="font-bold font-space text-center text-4xl mb-6"> 
          Login to Your Account
        </h1>
        <p className="text-space font-normal font-space text-center text-[#555458] max-w-[60%] max-md:hidden mb-10">
          Welcome back! Please log in to access your tasks and projects. Stay
          organized and collaborate effectively with your team. Let’s get to
          work!
        </p>
        <div className="flex flex-col lg:flex-row w-full justify-between">
          {/* Left Side: Login Form */}
          <div className="flex-1 p-4 flex flex-col justify-center items-center">
         
              <input
                type="text"
                className="mt-1 mb-4 w-[80%] block  border border-gray-300 rounded-md p-2"
                placeholder="Email"
              />
          

           
              <input
                type="password"
                className="mt-1 w-[80%] mb-4 block border border-gray-300 rounded-md p-2"
                placeholder="Password"
              />
           
            <Button
              size="lg"
              className="w-[80%] mt-1 rounded-md p-2 flex justify-center content-center hover:bg-white hover:border-black hover:text-black hover:border-2"
            >
              Login to Your Account <ArrowRightIcon className="ml-3" />
            </Button>
          </div>

          {/* Right Side: Buttons */}
         
        </div>

        {/* Below Inputs */}
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
              className="text-inter font-semibold ml-2 text-black hover:underline "
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
