import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {  CircleUser, FileSearch, Home, LineChart, Menu, Package, Search, Users } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";

const Header = () => {
  // State to track the selected menu item
  const [selected, setSelected] = useState('/home');

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
              to="/"
              className={selected === "/" ? activeClassName : baseClassName}
              onClick={() => setSelected("/")}
            >
              Samsung Seed
              <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
              to="/home"
              className={selected === "/home" ? activeClassName : baseClassName}
              onClick={() => setSelected("/home")}
            >
              <Home className="h-5 w-5" />
              Dashboard
            </Link>
            
            <Link
              to="/projects"
              className={selected === "/projects" ? activeClassName : baseClassName}
              onClick={() => setSelected("/projects")}
            >
              <Package className="h-5 w-5" />
              Projects
            </Link>
            <Link
              to="/employee"
              className={selected === "/employee" ? activeClassName : baseClassName}
              onClick={() => setSelected("/employee")}
            >
              <Users className="h-5 w-5" />
              Employee
            </Link>
            <Link
              to="/reviews"
              className={selected === "/reviews" ? activeClassName : baseClassName}
              onClick={() => setSelected("/reviews")}
            >
              <FileSearch className="h-5 w-5" />
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
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
