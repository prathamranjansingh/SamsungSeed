import React, { useState } from 'react';
import {
  Home,
  Package,
  Users,
  LineChart,
  FileSearch,
  CalendarCheck,
} from "lucide-react";
import { Badge } from "../../ui/badge";
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to track the selected route
  const [selected, setSelected] = useState('/projectmgr/home');

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
              to="/projectmgr/home"
              className={selected === "/projectmgr/home" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmgr/home")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
           
            <Link
              to="/projectmgr/tasks"
              className={selected === "/projectmgr/tasks" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmgr/tasks")}
            >
              <Package className="h-4 w-4" />
              Tasks
            </Link>
            <Link
              to="/projectmgr/employee"
              className={selected === "/projectmgr/employee" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmgr/employee")}
            >
              <Users className="h-4 w-4" />
              Employee
            </Link>
            <Link
              to="/projectmgr/attendance"
              className={selected === "/projectmgr/attendance" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmgr/attendance")}
            >
              <CalendarCheck  className="h-4 w-4" />
              Attendance
            </Link>
            <Link
              to="/projectmgr/analytics"
              className={selected === "/projectmgr/analytics" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmgr/analytics")}
            >
              <LineChart className="h-4 w-4" />
              Analytics
            </Link>
            
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
