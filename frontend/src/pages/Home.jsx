import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

import { HorizontalChart } from "../components/others/EmployeePerformance";


import ProjectBarchart from "../components/others/ProjectBarchart";

import { Activity, CreditCard, Package, Users } from "lucide-react";
import { Link } from "react-router-dom";



const Home = () => {
  

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
      </div>
{/* TOTAL NUMBER OF XYZ CARD LIKE TEAMS PROJECTS ETC */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">12 Completed</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">18 Absent Today</p>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <Link to="/team">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teams</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">5 added</p>
          </CardContent>
          </Link>
        </Card>
        <Card x-chunk="dashboard-01-chunk-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">5 Review Pending</p>
          </CardContent>
        </Card>
      </div>
      {/* Different Types Of Chart */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-2">
        <div className>
          <ProjectBarchart />
          </div>
          <div className>
            <HorizontalChart />
          </div>
        
      </div>
    </main>
  );
};

export default Home;
