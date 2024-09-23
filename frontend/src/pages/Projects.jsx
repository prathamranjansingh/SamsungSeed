import React, { useState, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { FolderIcon, FileIcon, MoreVerticalIcon, PlusIcon, UploadIcon, CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { useToast } from "@/hooks/use-toast";
import teamData from "@/assets/demoData/teamData.json";
import { format } from "date-fns";

export default function ProjectsPage() {
  const { toast } = useToast();

  const [folders, setFolders] = useState([
    { name: "Employee Records", files: 2, team: "Team A", dueDate: new Date("2024-12-31") },
    { name: "Training Documents", files: 1, team: "Team B", dueDate: new Date("2024-11-15") },
    { name: "Performance Reviews", files: 2, team: "Team C", dueDate: new Date("2024-10-30") },
  ]);

  const [files, setFiles] = useState([
    { name: "Team_Roster.docx", size: "245 KB", date: "Oct 27, 2023", folder: "Employee Records" },
    { name: "Training_Policies.pdf", size: "1.2 MB", date: "Oct 13, 2023", folder: "Training Documents" },
    { name: "Events_Calendar.pdf", size: "2.8 MB", date: "Sep 29, 2023", folder: "Employee Records" },
    { name: "Appraisals_2023.zip", size: "5.8 MB", date: "May 10, 2023", folder: "Performance Reviews" },
    { name: "Employee_Contracts.docx", size: "480 KB", date: "Dec 13, 2022", folder: "Performance Reviews" },
  ]);

  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    const filesArray = Array.from(event.target.files);
    if (filesArray.length > 0 && selectedFolder) {
      const newFiles = filesArray.map(file => ({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toLocaleDateString(),
        folder: selectedFolder,
      }));
      
      setFiles(prevFiles => [...newFiles, ...prevFiles]);
      setFolders(prevFolders => prevFolders.map(folder =>
        folder.name === selectedFolder ? { ...folder, files: folder.files + filesArray.length } : folder
      ));
      
      toast({
        title: "Files uploaded successfully",
        description: `${filesArray.length} files have been added to ${selectedFolder}.`,
      });
    } else if (!selectedFolder) {
      toast({
        title: "No folder selected",
        description: "Please select a folder before uploading files.",
        variant: "destructive",
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddFolder = () => {
    if (newFolderName && selectedTeam && dueDate) {
      setFolders([...folders, { name: newFolderName, files: 0, team: selectedTeam, dueDate }]);
      setNewFolderName("");
      setSelectedTeam("");
      setDueDate(null);
      toast({
        title: "Project created",
        description: `${newFolderName} has been added for team ${selectedTeam} with due date ${format(dueDate, 'PP')}.`,
      });
    } else {
      toast({
        title: "Missing Information",
        description: "Please provide a project name, select a team, and set a due date.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Folders */}
      <h2 className="text-lg font-semibold mb-4">Folders</h2>
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
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="mt-2 border rounded-lg p-2"
            >
              <option value="" disabled>Select a Team</option>
              {teamData.teams.map((team) => (
                <option key={team.id} value={team.name}>{team.name}</option>
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
            <Button onClick={handleAddFolder} className="mt-4">Create Project</Button>
          </DialogContent>
        </Dialog>
        {folders.map((folder) => (
          <div
            key={folder.name}
            className={`border rounded-lg p-4 flex flex-col items-center justify-center space-y-2 cursor-pointer ${selectedFolder === folder.name ? "bg-gray-100 border-black" : "hover:bg-gray-50"}`}
            onClick={() => setSelectedFolder(folder.name)}
          >
            <FolderIcon className="w-12 h-12 text-black" />
            <span className="text-sm font-medium">{folder.name}</span>
            <span className="text-xs text-gray-500">{folder.team}</span>
            <span className="text-xs text-gray-500">Due: {format(folder.dueDate, 'PP')}</span>
            <div className="flex -space-x-2">
             
            </div>
            <span className="text-xs text-gray-500">{folder.files} files</span>
          </div>
        ))}
      </div>

      {/* Files */}
      <h2 className="text-lg font-semibold mb-4">Files</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>File Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files
              .filter((file) => !selectedFolder || file.folder === selectedFolder)
              .map((file) => (
                <TableRow key={file.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <FileIcon className="text-gray-400" />
                      <span>{file.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{file.folder}</TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.date}</TableCell>
                  <TableCell>
                    {folders.find(folder => folder.name === file.folder)?.dueDate
                      ? format(folders.find(folder => folder.name === file.folder).dueDate, 'PP')
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-8 border-2 border-dashed rounded-lg p-8 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          ref={fileInputRef}
        />
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={!selectedFolder}
        >
          <UploadIcon className="mr-2 h-4 w-4" /> Upload New Images
        </Button>
        <p className="mt-2 text-sm text-gray-500">
          {selectedFolder
            ? `Drag and drop image files or Browse to upload to ${selectedFolder}`
            : "Select a folder to upload files"}
        </p>
      </div>
    </div>
  );
}