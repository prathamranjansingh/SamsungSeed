import React, { useState } from 'react';
import {Button} from '../components/ui/button'
const Register = () => {
  // State hooks to manage form inputs
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

 
  return (
    <div className="max-w-4xl mx-auto font-space p-6">
      <div className="text-center mb-16">
        
        <h1 className="font-bold font-space text-center text-4xl mb-6">
          Register
        </h1>
      </div>

      <form onSubmit={()=>{}}>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <label className="text-gray-800 text-sm mb-2 block">First Name</label>
            <input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-black transition-all"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-black transition-all"
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Email Id</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-black transition-all"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Mobile No.</label>
            <input
              name="mobile"
              type="number"
              value={formData.mobile}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-black transition-all"
              placeholder="Enter mobile number"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-black transition-all"
              placeholder="Enter password"
            />
          </div>
          <div>
            <label className="text-gray-800 text-sm mb-2 block">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="bg-gray-100 w-full text-gray-800 text-sm px-4 py-3.5 rounded-md focus:bg-transparent outline-black transition-all"
              placeholder="Enter confirm password"
            />
          </div>
        </div>

        <div className="!mt-12 flex justify-center">
          <Button
            type="submit"
            className="w-[80%] mt-1 rounded-md p-2 flex justify-center content-center hover:bg-white hover:border-black hover:text-black hover:border-2"
            >
            Register
          </Button>
        </div>
        <div className="mt-16 text-sm flex flex-col justify-center content-center text-center text-[#555458] mb-[5%]">
          
          <div className="text-inter font-normal">
            <span>Already have an account?</span>
            <a
              href="#"
              className="text-inter font-semibold ml-2 text-black hover:underline "
            >
              Sign In
            </a>
          </div>
        </div>
      </form>
     
    </div>
  );
};

export default Register;
