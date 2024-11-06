import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '../../hooks/use-toast';

export default function DistributeWork() {
  const [task, setTask] = useState(null);
  const [folderPath, setFolderPath] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/teamleadDetail`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const fetchedTask = response.data.tasksWithFolders[0];
        if (fetchedTask) {
          setTask({
            ...fetchedTask,
            folders: fetchedTask.folders || []
          });
        }
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/displayEmployees`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (response.data.success) {
          setMembers(response.data.employees);
        } else {
          console.error("Failed to fetch team members");
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchTask();
    fetchMembers();
  }, []);

  const handleAssignFolder = async () => {
    if (folderPath && selectedMember !== null) {
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/assignWork`,
          { path: folderPath, team_member: selectedMember },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              "Content-Type": "application/json",
            },
          }
        );

        setTask(prevTask => ({
          ...prevTask,
          folders: [...prevTask.folders, { path: folderPath, assignedTo: selectedMember }]
        }));

        setFolderPath("");
        setSelectedMember(null);
        toast({
          description: "Folder assigned successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error assigning folder:",
          variant: "destructive"
        });
      }
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Team Lead Dashboard</h1>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{task.task_name}</CardTitle>
          <CardDescription>Due: {new Date(task.due_date).toLocaleDateString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Team Members:</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Assigned Folders</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {task.team_members.map(member => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        {
                          // Filter folders assigned to the current team member
                          task.folders
                            .filter(folder => folder.assignedTo === member.id) // Match folders by member ID
                            .map((folder, index) => (
                              <div key={index}>{folder.path}</div> // Display folder path
                            ))
                        }
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">All Assigned Folders:</h2>
              {task.folders.length > 0 ? (
                <ul className="list-disc pl-5">
                  {task.folders.map((folder, index) => (
                    <li key={index}>
                      {folder.path} - Assigned to: {task.team_members.find(m => m.id === folder.assignedTo)?.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No folders assigned yet.</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Assign Folder</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Folder to Team Member</DialogTitle>
                <DialogDescription>
                  Enter a folder path and select a team member to assign it to.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="folderPath" className="text-right">
                    Folder Path
                  </Label>
                  <Input
                    id="folderPath"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    placeholder="/server/path/to/folder"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="member" className="text-right">
                    Member
                  </Label>
                  <Select onValueChange={(value) => setSelectedMember(Number(value))} value={selectedMember?.toString() || ""}>
                    <SelectTrigger id="member" className="col-span-3">
                      <SelectValue placeholder="Select a member" />
                    </SelectTrigger>
                    <SelectContent>
                      {members.map(member => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAssignFolder}>Assign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
}
