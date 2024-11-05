import React, { useState, useEffect, useCallback, useMemo } from "react";
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
import { MoreHorizontalIcon, PlusIcon, CalendarIcon } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { format, isValid, parseISO } from "date-fns";

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
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTasks`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/getUnassignedTeams`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setTasks(Array.isArray(tasksResponse.data) ? tasksResponse.data : []);
      setTeams(teamsResponse.data.teams || []);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error fetching data",
        description: "Could not fetch tasks and teams. Please try again later.",
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
    if (!newTaskName || !selectedTeam || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please provide a task name, select a team, and set a due date.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formattedDueDate = format(dueDate, "yyyy-MM-dd");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-task`,
        {
          task_name: newTaskName,
          team_id: selectedTeam,
          due_date: formattedDueDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTasks((prev) => [...prev, response.data]);
      resetForm();
      toast({
        title: "Task created",
        description: `${newTaskName} has been added with due date ${format(dueDate, "PP")}.`,
      });
      fetchData();
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
        description: "There was an error creating the task. Please try again.",
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
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/delete-task`,
          { task_id: taskToDelete },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskToDelete));
        toast({
          title: "Task deleted",
          description: "The task has been successfully deleted.",
        });
        closeDeleteModal();
        fetchData();
      } catch (error) {
        console.error("Error deleting task:", error);
        toast({
          title: "Error",
          description: "There was an error deleting the task. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "PP") : "Invalid date";
  };

  const sortedTasks = useMemo(() => {
    return tasks
      .filter((task) => task.due_date)
      .sort((a, b) => {
        const dateA = parseISO(a.due_date);
        const dateB = parseISO(b.due_date);
        return isValid(dateA) && isValid(dateB) ? dateA - dateB : 0;
      });
        
  }, [tasks]);
 
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tasks</h1>

      {/* Add New Task */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New Task
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleCreateTask();
          }}>
            <Input
              placeholder="Task Name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="mb-4"
            />
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full mb-4 border rounded-lg p-2"
            >
              <option value="" disabled>Select a team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name}
                </option>
              ))}
            </select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
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
            <Button type="submit" className="mt-4 w-full">Create Task</Button>
          </form>
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
          {sortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.task_name}</TableCell>
              <TableCell>{task.team_id}</TableCell>
              <TableCell>{formatDate(task.due_date)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openDeleteModal(task.id)}>
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
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this task?</p>
          <Button variant="destructive" onClick={handleDeleteTask} className="mt-4">
            Confirm
          </Button>
          <Button variant="outline" onClick={closeDeleteModal} className="mt-2">
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
