import { useNavigate } from "react-router-dom"; 
import { CalendarDays, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Badge } from "@/components/ui/badge"; 

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    teamMembers: ["Alice", "Bob", "Charlie"],
    deadline: "2023-12-31",
    status: "In Progress",
  },
  {
    id: 2,
    name: "Mobile App Development",
    teamMembers: ["David", "Eve", "Frank"],
    deadline: "2024-03-15",
    status: "Planning",
  },
  {
    id: 3,
    name: "Data Migration",
    teamMembers: ["Grace", "Henry", "Ivy"],
    deadline: "2023-11-30",
    status: "Completed",
  },
];

export default function ProjectList() {
  const navigate = useNavigate(); 

  // Updated function to navigate to the correct route
  const handleProjectClick = (projectId) => {
    navigate(`/teamlead/projects/${projectId}`); // Include 'teamlead' in the path
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Project Management</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleProjectClick(project.id)}
          >
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center mt-2">
                  <Users className="w-4 h-4 mr-2" />
                  {project.teamMembers.join(", ")}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <span className="text-sm">{project.deadline}</span>
                </div>
                <Badge
                  variant={
                    project.status === "Completed"
                      ? "success"
                      : project.status === "In Progress"
                      ? "default"
                      : "secondary"
                  }
                >
                  {project.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
