// DashboardContent.jsx
import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Edit, Loader } from "lucide-react"; // Import the Edit icon

export function DashboardContent() {
  const [employeeData, setEmployeeData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Track edit mode
  const [skill, setSkill] = useState(""); // State to manage skill input
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/emp-fetch`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployeeData(response.data[0]);
        setSkill(response.data[0]?.skill || ""); // Set initial skill value
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Failed to fetch employee data. Please try again later.");
      }
    };

    fetchEmployeeData();
  }, [backendUrl]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${backendUrl}/emp-add`, { content: skill }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsEditing(false); // Exit edit mode
      // Optionally, refetch data to reflect changes
      const response = await axios.get(`${backendUrl}/emp-fetch`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployeeData(response.data[0]); // Update employeeData
    } catch (error) {
      console.error("Error updating skill:", error);
      setError("Failed to update skill. Please try again later.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message
  }

  if (!employeeData) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-500">Loading...</span>
      </div>
    ); // Show loading spinner and text while data is being fetched
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Analytics Dashboard</h1>
      </div>
      <div className="text-sm text-muted-foreground">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">
                Welcome, {employeeData?.name || 'Employee'}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src="/placeholder.svg"
                  alt={employeeData?.name || 'Employee'}
                />
                <AvatarFallback>{employeeData?.name ? employeeData.name[0] : 'E'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-xl">{employeeData?.role || 'N/A'}</p>
                <div className="flex items-center">
                  <p className="text-muted-foreground">Skill: </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                      className="ml-2 p-1 border border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-muted-foreground ml-2">{employeeData?.skill || 'N/A'}</p>
                  )}
                  <button onClick={isEditing ? handleSaveClick : handleEditClick} className="ml-2">
                    {isEditing ? (
                      <span className="text-green-500 font-bold">Save</span>
                    ) : (
                      <Edit className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-muted-foreground">
                  Employee ID: {employeeData?.id || 'N/A'}
                </p>
                <p className="text-muted-foreground">
                  Contact: {employeeData?.email || 'N/A'}
                </p>
                <p className="text-muted-foreground">
                  Experience: {employeeData?.experience || 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Tasks Completed</span>
                <span className="font-bold">12/15</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Projects On-time</span>
                <span className="font-bold">90%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Team Productivity</span>
                <span className="font-bold">85%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Website Redesign</TableCell>
                    <TableCell>In Progress</TableCell>
                    <TableCell>
                      <Progress value={75} className="w-[60%]" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mobile App Development</TableCell>
                    <TableCell>Planning</TableCell>
                    <TableCell>
                      <Progress value={20} className="w-[60%]" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
