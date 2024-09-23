import React, { useState } from 'react';
import {
  Home,
  Package,
  Users,
  LineChart,
  FileSearch,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Link } from 'react-router-dom';

const Navbar = () => {
  // State to track the selected route
  const [selected, setSelected] = useState('/home');

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
              to="/home"
              className={selected === "/home" ? activeClassName : baseClassName}
              onClick={() => setSelected("/home")}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
           
            <Link
              to="/projects"
              className={selected === "/projects" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projects")}
            >
              <Package className="h-4 w-4" />
              Projects
            </Link>
            <Link
              to="/employee"
              className={selected === "/employee" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee")}
            >
              <Users className="h-4 w-4" />
              Employee
            </Link>
            <Link
              to="/reviews"
              className={selected === "/reviews" ? activeClassName : baseClassName}
              onClick={() => setSelected("/reviews")}
            >
              <FileSearch className="h-4 w-4" />
              Reviews
              <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                6
              </Badge>
            </Link>
            <Link
              to="/analytics"
              className={selected === "/analytics" ? activeClassName : baseClassName}
              onClick={() => setSelected("/analytics")}
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
