import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { FolderIcon, FileIcon, MoreHorizontalIcon, PlusIcon, CalendarIcon } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format, isValid, parseISO } from "date-fns";

export default function ProjectsPage() {
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectManagerId, setSelectedProjectManagerId] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditDueDateModalOpen, setIsEditDueDateModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [newDueDate, setNewDueDate] = useState(null);
  const [projectManagers, setProjectManagers] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [projectsResponse, managersResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/getProjects`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/getEmployees`)
      ]);

      setProjects(projectsResponse.data);
      setProjectManagers(managersResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: "Could not fetch projects and managers.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateProject = async () => {
    if (newProjectName && selectedProjectManagerId && dueDate) {
      try {
        const formattedDueDate = format(dueDate, 'yyyy-MM-dd');
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/create-project`, {
          project_name: newProjectName,
          project_manager_id: selectedProjectManagerId,
          due_date: formattedDueDate,
        });
        const newProject = response.data[0];
        setProjects(prev => [...prev, newProject]);
        resetForm();
        toast({
          title: "Project created",
          description: `${newProjectName} has been added with due date ${format(dueDate, 'PP')}.`,
        });
      } catch (error) {
        console.error("Error creating project:", error);
        toast({
          title: "Error",
          description: "There was an error creating the project.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide a project name, project manager, and due date.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewProjectName("");
    setSelectedProjectManagerId("");
    setDueDate(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set';
    const date = parseISO(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid Date';
  };

  const openDeleteModal = (project_id) => {
    setProjectToDelete(project_id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  const handleDeleteProject = async () => {
    if (projectToDelete) {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-project`, { project_id: projectToDelete });
        setProjects(projects.filter((project) => project.id !== projectToDelete));
        toast({
          title: "Project deleted",
          description: "The project has been successfully deleted.",
        });
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error",
          description: "There was an error deleting the project.",
          variant: "destructive",
        });
      }
    }
  };

  const openEditDueDateModal = (project) => {
    setProjectToEdit(project);
    setNewDueDate(parseISO(project.due_date));
    setIsEditDueDateModalOpen(true);
  };

  const closeEditDueDateModal = () => {
    setIsEditDueDateModalOpen(false);
    setProjectToEdit(null);
    setNewDueDate(null);
  };

  const handleEditDueDate = async () => {
    if (projectToEdit && newDueDate) {
      try {
        const formattedNewDueDate = format(newDueDate, 'yyyy-MM-dd');
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/edit-project`, {
          id: projectToEdit.id,
          date: formattedNewDueDate,
        });
        const updatedProject = response.data[0];
        setProjects(prev => prev.map(project => project.id === updatedProject.id ? updatedProject : project));
        toast({
          title: "Due date updated",
          description: `The due date for ${projectToEdit.project_name} has been updated to ${format(newDueDate, 'PP')}.`,
        });
        closeEditDueDateModal();
      } catch (error) {
        console.error("Error updating due date:", error);
        toast({
          title: "Error",
          description: "There was an error updating the due date.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Projects */}
      <h2 className="text-lg font-semibold mb-4">Projects</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        <Dialog>
          <DialogTrigger asChild>
            <div className="border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-gray-50">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <PlusIcon className="text-black" />
              </div>
              <span className="text-sm font-medium">Add New Project</span>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <select
              value={selectedProjectManagerId}
              onChange={(e) => setSelectedProjectManagerId(e.target.value)}
              className="mt-2 border rounded-lg p-2"
            >
              <option value="" disabled>Select a Project Manager</option>
              {projectManagers.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.name}
                </option>
              ))}
            </select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="due-date"
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PP') : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleCreateProject} className="mt-4">Create Project</Button>
          </DialogContent>
        </Dialog>
        {projects.map((project) => (
          <div
            key={project.id}
            className={`border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer ${selectedProject?.id === project.id ? "bg-gray-100 border-black" : "hover:bg-gray-50"}`}
            onClick={() => setSelectedProject(project)}
          >
            <FolderIcon className="w-12 h-12 text-black" />
            <span className="text-sm font-medium">{project.project_name}</span>
            <span className="text-xs text-gray-500">{project.team_name}</span>
            <span className="text-xs text-gray-500">Due: {formatDate(project.due_date)}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  openEditDueDateModal(project);
                }}>
                  Edit Due Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  openDeleteModal(project.id);
                }}>
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>

      {/* Team Members */}
      <h2 className="text-lg font-semibold mb-4">Team Members</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Name</TableHead>
              <TableHead>Members Name</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedProject && selectedProject.team_members && selectedProject.team_members.map((member, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FileIcon className="mr-2 h-4 w-4 inline" />
                  {selectedProject.project_name}
                </TableCell>
                <TableCell>{member}</TableCell>
                <TableCell>{formatDate(selectedProject.due_date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this project? This action cannot be undone.</p>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={closeDeleteModal}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProject} className="ml-2">Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Due Date Modal */}
      <Dialog open={isEditDueDateModalOpen} onOpenChange={setIsEditDueDateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Due Date</DialogTitle>
          </DialogHeader>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`w-full justify-start text-left font-normal ${!newDueDate && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newDueDate ? format(newDueDate, 'PP') : <span>Pick a new due date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={newDueDate}
                onSelect={setNewDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={closeEditDueDateModal}>Cancel</Button>
            <Button onClick={handleEditDueDate} className="ml-2">Update Due Date</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}