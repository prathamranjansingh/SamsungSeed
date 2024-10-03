import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CalendarDays, Mail, Phone } from 'lucide-react'

// Mock data
const adminData = {
  name: "John Doe",
  role: "Senior Project Manager",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "/placeholder.svg?height=100&width=100"
}

const currentProjects = [
  { id: 1, name: "Website Redesign", progress: 75 },
  { id: 2, name: "Mobile App Development", progress: 40 },
  { id: 3, name: "Data Migration", progress: 90 },
]

const pastProjects = [
  { id: 1, name: "E-commerce Platform", status: "Completed", dueDate: "2023-05-15", teamLead: "Alice Johnson" },
  { id: 2, name: "CRM Integration", status: "Delayed", dueDate: "2023-06-30", teamLead: "Bob Smith" },
  { id: 3, name: "Cloud Migration", status: "Completed", dueDate: "2023-04-01", teamLead: "Charlie Brown" },
  { id: 4, name: "AI Chatbot", status: "In Progress", dueDate: "2023-08-15", teamLead: "Diana Prince" },
  { id: 5, name: "Security Audit", status: "Pending", dueDate: "2023-09-01", teamLead: "Ethan Hunt" },
]

export default function EmployeeDashboard() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      {/* Admin Profile */}
      <Card>
        <CardContent className="flex items-center space-x-4 p-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={adminData.avatar} alt={adminData.name} />
            <AvatarFallback>{adminData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{adminData.name}</h2>
            <p className="text-muted-foreground">{adminData.role}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>{adminData.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>{adminData.phone}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Current Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {currentProjects.map(project => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">{project.name}</span>
                  <span>{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Past Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>Past Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Team Leader</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pastProjects.map(project => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    <Badge variant={
                      project.status === 'Completed' ? 'default' :
                      project.status === 'Delayed' ? 'destructive' :
                      project.status === 'In Progress' ? 'secondary' :
                      'outline'
                    }>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {project.dueDate}
                  </TableCell>
                  <TableCell>{project.teamLead}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}