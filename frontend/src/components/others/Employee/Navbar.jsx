import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  BarChart2,
  Calendar,
  ShieldCheck,
  Package,
} from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Dashboard', path: '/employee/home' },
  { icon: Package, label: 'Projects', path: '/employee/projects' },
  { icon: ShieldCheck, label: 'Tasks', path: '/employee/tasks' },
  { icon: Users, label: 'Team', path: '/employee/team' },
  { icon: Calendar, label: 'Attendance', path: '/employee/attendance' },
];

const Navbar = () => {
  const location = useLocation();

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
            {sidebarItems.map(({ icon: Icon, label, path }) => (
              <Link
                key={label}
                to={path}
                className={location.pathname === path ? activeClassName : baseClassName}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
