import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  MoreHorizontalIcon,
  PlusIcon,
  CalendarIcon,
} from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function TasksPage() {
  const { toast } = useToast();
  const token = localStorage.getItem("token");
  const [tasks, setTasks] = useState([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [teams, setTeams] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tasksResponse, teamsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTasks`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTeams`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTasks(tasksResponse.data || []);
      setTeams(teamsResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: "Could not fetch tasks and teams.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async () => {
    if (newTaskName && selectedTeam && dueDate) {
      try {
        const formattedDueDate = format(dueDate, "yyyy-MM-dd");
        const obj = {
          task_name: newTaskName,
          team_id: selectedTeam,
          due_date: formattedDueDate,
        };
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/create-task`,
          obj,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTasks((prev) => [...prev, response.data]);
        resetForm();
        toast({
          title: "Task created",
          description: `${newTaskName} has been added with due date ${format(dueDate, "PP")}.`,
        });
      } catch (error) {
        console.error("Error creating task:", error);
        toast({
          title: "Error",
          description: "There was an error creating the task.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide a task name, select a team, and set a due date.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setNewTaskName("");
    setSelectedTeam("");
    setDueDate(null);
  };

  const openDeleteModal = (taskId) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delete-task`, { task_id: taskToDelete });
        setTasks(tasks.filter((task) => task.id !== taskToDelete));
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        });
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "There was an error deleting the task.",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      {/* Add New Task */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-gray-50">
            <PlusIcon className="text-black" />
            <span className="text-sm font-medium">Add New Task</span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Task Name"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="mt-2 border rounded-lg p-2"
          >
            <option value="" disabled>Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.team_name} - Team ID: {team.id}
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
                {dueDate ? format(dueDate, "PP") : <span>Pick a due date</span>}
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
          <Button onClick={handleCreateTask} className="mt-4">Create Task</Button>
        </DialogContent>
      </Dialog>

      {/* Tasks List */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Team ID</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.task_name}</TableCell>
              <TableCell>{task.team_id}</TableCell>
              <TableCell>{format(new Date(task.due_date), "PP")}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      openDeleteModal(task.id);
                    }}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Dialog open={isDeleteModalOpen} onOpenChange={closeDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={closeDeleteModal} variant="outline" className="mr-2">Cancel</Button>
              <Button onClick={handleDeleteTask} variant="destructive">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
