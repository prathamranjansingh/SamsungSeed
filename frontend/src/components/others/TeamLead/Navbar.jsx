import React, { useState } from 'react';
import {
  Home,
  Package,
  Users,
  LineChart,
  FileSearch,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to track the selected route
  const [selected, setSelected] = useState('/teamlead/home');

  const baseClassName = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary";
  const activeClassName = "flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary";

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="">Samsung Seed</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              to="/teamlead/home"
              className={selected === "/teamlead/home" ? activeClassName : baseClassName}
              onClick={() => setSelected("/teamlead/home")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
           
            <Link
              to="/teamlead/projectdetail"
              className={selected === "/teamlead/projectdetail" ? activeClassName : baseClassName}
              onClick={() => setSelected("/teamlead/projectdetail")}
            >
              <Package className="h-4 w-4" />
              Projects
            </Link>
            <Link
              to="/teamlead/quality"
              className={selected === "/teamlead/quality" ? activeClassName : baseClassName}
              onClick={() => setSelected("/teamlead/quality")}
            >
              <ShieldCheck className="h-4 w-4" />
              Quality Check
            </Link>
            
            
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
