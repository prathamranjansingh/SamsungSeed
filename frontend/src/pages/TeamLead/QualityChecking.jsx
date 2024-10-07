import  { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "../../hooks/use-toast"

// Mock data for projects, teams, and images
const projects = [
  { id: 1, name: "Website Redesign", totalImages: 100, incorrectImages: 15, teamId: 1, status: "In Progress" },
  { id: 2, name: "Mobile App Development", totalImages: 200, incorrectImages: 0, teamId: 2, status: "Completed" },
  { id: 3, name: "Data Migration", totalImages: 150, incorrectImages: 20, teamId: 3, status: "In Progress" },
];

const teams = [
  {
    id: 1,
    name: "Web Team",
    members: [
      { id: 1, name: "Alice", assignedImages: 40 },
      { id: 2, name: "Bob", assignedImages: 30 },
      { id: 3, name: "Charlie", assignedImages: 30 },
    ],
  },
  {
    id: 2,
    name: "Mobile Team",
    members: [
      { id: 4, name: "David", assignedImages: 100 },
      { id: 5, name: "Eve", assignedImages: 100 },
    ],
  },
  {
    id: 3,
    name: "Data Team",
    members: [
      { id: 6, name: "Frank", assignedImages: 50 },
      { id: 7, name: "Grace", assignedImages: 50 },
      { id: 8, name: "Henry", assignedImages: 50 },
    ],
  },
];

const incorrectImages = [
  { id: 1, projectId: 1, name: "Header Image" },
  { id: 2, projectId: 1, name: "Footer Image" },
  { id: 3, projectId: 1, name: "Product Gallery" },
  { id: 4, projectId: 3, name: "Login Screen" },
  { id: 5, projectId: 3, name: "Profile Page" },
  { id: 6, projectId: 3, name: "Data Visualization" },
];

export default function QualityCheckerPage() {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const handleProjectChange = (value) => {
    const project = projects.find((p) => p.id === parseInt(value));
    setSelectedProject(project);
  };

  const handleReassignImages = () => {
    setShowReassignModal(false);
    toast({
      title: "Images Reassigned",
      description: `${selectedProject.incorrectImages} incorrect images have been randomly reassigned to team members.`,
    });
  };

  const projectProgress = (project) => {
    return Math.round(((project.totalImages - project.incorrectImages) / project.totalImages) * 100);
  };

  const filteredImages = incorrectImages.filter((img) => img.projectId === selectedProject.id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Quality Checker Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {projects.map((project) => (
          <Card key={project.id} className={selectedProject.id === project.id ? "border-primary" : ""}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {project.name}
                {project.status === "Completed" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="success">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>All quality assurance tests completed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </CardTitle>
              <CardDescription>
                {project.totalImages - project.incorrectImages} / {project.totalImages} images correct
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={projectProgress(project)} className="mb-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {projectProgress(project)}% Correct
                </span>
                {project.incorrectImages > 0 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="destructive">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {project.incorrectImages}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{project.incorrectImages} incorrect images</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Select onValueChange={handleProjectChange} defaultValue={String(selectedProject.id)}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={String(project.id)}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2 w-full sm:w-auto">
          <Dialog open={showReassignModal} onOpenChange={setShowReassignModal}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto" disabled={selectedProject.incorrectImages === 0}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Reassign Incorrect Images
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reassign Incorrect Images</DialogTitle>
                <DialogDescription>
                  This action will randomly reassign {selectedProject.incorrectImages} incorrect images to team members of {teams.find((t) => t.id === selectedProject.teamId)?.name}. Are you sure you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReassignModal(false)}>Cancel</Button>
                <Button onClick={handleReassignImages}>Reassign</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={showTeamModal} onOpenChange={setShowTeamModal}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Users className="w-4 h-4 mr-2" />
                View Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{teams.find((t) => t.id === selectedProject.teamId)?.name}</DialogTitle>
                <DialogDescription>
                  Team members and their assigned images
                </DialogDescription>
              </DialogHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Assigned Images</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.find((t) => t.id === selectedProject.teamId)?.members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell className="text-right">{member.assignedImages}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Incorrect Images for {selectedProject.name}</h2>
        <CardContent>
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredImages.map((image) => (
                <div key={image.id} className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full h-full flex items-center justify-center">
                          <Info className="w-8 h-8 text-muted-foreground" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{image.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No incorrect images for the selected project.
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}
