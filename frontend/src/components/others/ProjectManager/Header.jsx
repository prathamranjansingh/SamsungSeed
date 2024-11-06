import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { useAuth } from '../../../context/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import {  CalendarCheck, CircleUser, FileSearch, Home, LineChart, Menu, Package, Search, Users } from "lucide-react";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";

const Header = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout(); // Call the logout function
    window.location.href = '/login'; // Redirect to the login page after logout
  };
  // State to track the selected menu item
  const [selected, setSelected] = useState('/projectmanager/home');

  // Define the classNames
  const baseClassName = "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground";
  const activeClassName = "mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground";

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex font-space flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Link
              to="/projectmanager/home"
              className={selected === "/" ? activeClassName : baseClassName}
              onClick={() => setSelected("/")}
            >
              Samsung Seed
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              to="/projectmanager/home"
              className={selected === "/projectmanager/home" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmanager/home")}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/projectmanager/tasks"
              className={selected === "/projectmanager/tasks" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmanager/tasks")}
            >
              <Package className="h-5 w-5" />
              Tasks
            </Link>
            <Link
              to="/projectmanager/team"
              className={selected === "/projectmanager/team" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmanager/team")}
            >
              <Users className="h-5 w-5" />
              Team
            </Link>
            <Link
              to="/projectmanager/attendance"
              className={selected === "/projectmanager/attendance" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmanager/attendance")}
            >
              <CalendarCheck  className="h-5 w-5" />
              Attendance
            </Link>
            <Link
              to="/projectmanager/analytics"
              className={selected === "/projectmanager/analytics" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projectmanager/analytics")}
            >
              <LineChart className="h-5 w-5" />
              Analytics
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="font-space" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
