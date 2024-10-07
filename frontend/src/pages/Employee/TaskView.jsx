import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TaskView() {
  const tasks = [
    { id: 1, title: "Implement new feature", project: "Website Redesign", priority: "High", status: "In Progress" },
    { id: 2, title: "Fix login bug", project: "Mobile App Development", priority: "Critical", status: "Pending" },
    { id: 3, title: "Update API documentation", project: "Data Analytics Platform", priority: "Medium", status: "Not Started" },
    { id: 4, title: "Code review", project: "Website Redesign", priority: "Low", status: "In Progress" },
    { id: 5, title: "User testing", project: "Mobile App Development", priority: "High", status: "Not Started" },
  ];

  const [filter, setFilter] = useState("all");

  // Priority mapping
  const priorityOrder = {
    Critical: 1,
    High: 2,
    Medium: 3,
    Low: 4,
  };

  // Filter tasks based on status
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    return task.status.toLowerCase() === filter;
  });

  // Sort tasks by priority
  const sortedTasks = filteredTasks.sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">My Tasks</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="not started">Not Started</SelectItem>
            <SelectItem value="in progress">In Progress</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Task</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell>{task.project}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${task.priority === 'Low' ? 'bg-blue-100 text-blue-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          task.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-red-100 text-red-800'}`}>
                      {task.priority}
                    </span>
                  </TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Complete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
