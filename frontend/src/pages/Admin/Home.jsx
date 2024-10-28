import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { HorizontalChart } from "../../components/others/Admin/EmployeePerformance";

import { Progress } from "../../components/ui/progress"
import ProjectBarchart from "../../components/others/Admin/ProjectBarchart";

import { Activity, CreditCard, Package, Users } from "lucide-react";
import { Link } from "react-router-dom";


const projectSummary = [
  { name: "Neisa web development", manager: "Om prakash sao", dueDate: "May 25, 2025", status: "Completed", progress: 100 },
  { name: "Datascale AI app", manager: "Neilsan mando", dueDate: "Jun 20, 2025", status: "Delayed", progress: 35 },
  { name: "Media channel branding", manager: "Tiruvelly priya", dueDate: "July 13, 2025", status: "At risk", progress: 65 },
  { name: "Corlax iOS app development", manager: "Matte hannery", dueDate: "Dec 20, 2024", status: "Completed", progress: 100 },
  { name: "Website builder development", manager: "Sukumar rao", dueDate: "Mar 15, 2025", status: "On going", progress: 50 },
]

const calculateOverallProgress = () => {
  const totalProgress = projectSummary.reduce((sum, project) => sum + project.progress, 0)
  return Math.round(totalProgress / projectSummary.length)
}

const Home = () => {

  const overallProgress = calculateOverallProgress()



  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Home</h1>
      </div>
{/* TOTAL NUMBER OF XYZ CARD LIKE TEAMS PROJECTS ETC */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        
        <Card x-chunk="dashboard-01-chunk-0">
        <Link to="/admin/projects">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">21</div>
            <p className="text-xs text-muted-foreground">12 Completed</p>
          </CardContent>
          </Link>
        </Card>
        <Card x-chunk="dashboard-01-chunk-1">
          <Link to='/admin/employee'>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">18 Absent Today</p>
          </CardContent>
          </Link>
        </Card>
        <Card x-chunk="dashboard-01-chunk-2">
          <Link to="/admin/team">
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
       
      </div>


{/* PROGRESS OF PROJECTS */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Project summary</CardTitle>
            <div className="flex space-x-2">
              
         
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Team Lead</TableHead>
                  <TableHead>Due date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projectSummary.map((project, index) => (
                  <TableRow key={index}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.manager}</TableCell>
                    <TableCell>{project.dueDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'Delayed' ? 'bg-yellow-100 text-yellow-800' :
                        project.status === 'At risk' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end">
                        <div className="w-[100px] h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className={`h-full rounded-full ${
                              project.progress === 100 ? 'bg-green-500' :
                              project.progress >= 70 ? 'bg-blue-500' :
                              project.progress >= 40 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${overallProgress * 2.51} 251.2`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{overallProgress}%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Completed</p>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">95</p>
                <p className="text-xs text-muted-foreground">Total projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">26</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">35</p>
                <p className="text-xs text-muted-foreground">Delayed</p>
              </div>
            </div>
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
