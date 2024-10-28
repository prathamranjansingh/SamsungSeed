
import { Outlet } from 'react-router-dom';
import Navbar from "./Navbar";
import Header from "./Header";

const Layout = () => {
  return (
    <div className="grid font-space min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Navbar />
      
      <div className="flex flex-col">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;