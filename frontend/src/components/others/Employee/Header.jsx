import { useState } from "react";
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
import {  CalendarCheck, CircleUser, Home, LineChart, Menu, Package, Search, ShieldCheck, Users } from "lucide-react";
import { Input } from "../../ui/input";


const Header = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout(); 
    window.location.href = '/login'; 
  };
  const [selected, setSelected] = useState('/employee/home');

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
              to="/"
              className={selected === "/" ? activeClassName : baseClassName}
              onClick={() => setSelected("/")}
            >
              Samsung Seed
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              to="/employee/home"
              className={selected === "/employee/home" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee/home")}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/employee/projects"
              className={selected === "/employee/projects" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee/projects")}
            >
              <Package className="h-5 w-5" />
              Projects
            </Link>
            <Link
              to="/employee/tasks"
              className={selected === "/employee/tasks" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee/tasks")}
            >
              <ShieldCheck className="h-5 w-5" />
             Task
            </Link>
            <Link
              to="/employee/team"
              className={selected === "/employee/team" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee/team")}
            >
              <CalendarCheck  className="h-5 w-5" />
              Team
            </Link>
            <Link
              to="/employee/attendance"
              className={selected === "/employee/attendance" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee/attendance")}
            >
              <CalendarCheck className="h-5 w-5" />
              Attendance
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
