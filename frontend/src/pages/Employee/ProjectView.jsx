import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from '@/components/ui/progress' 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function ProjectView() {
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Revamping the company's main website with a modern design and improved user experience.",
      teamLead: "Alice Johnson",
      teamMembers: [
        { name: "John Doe", role: "Frontend Developer", avatar: "/placeholder.svg" },
        { name: "Jane Smith", role: "UI/UX Designer", avatar: "/placeholder.svg" },
        { name: "Mike Brown", role: "Backend Developer", avatar: "/placeholder.svg" },
      ],
      startDate: "2023-06-01",
      endDate: "2023-12-31",
      progress: 75,
      status: "In Progress",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Creating a new mobile app for customer engagement and support.",
      teamLead: "Bob Wilson",
      teamMembers: [
        { name: "Alice Brown", role: "Mobile Developer", avatar: "/placeholder.svg" },
        { name: "Charlie Davis", role: "Backend Developer", avatar: "/placeholder.svg" },
        { name: "Eva Green", role: "QA Specialist", avatar: "/placeholder.svg" },
      ],
      startDate: "2023-07-15",
      endDate: "2024-03-31",
      progress: 40,
      status: "In Progress",
    },
    {
      id: 3,
      name: "Data Analytics Platform",
      description: "Developing a comprehensive data analytics platform for business intelligence.",
      teamLead: "Carol Martinez",
      teamMembers: [
        { name: "David Lee", role: "Data Scientist", avatar: "/placeholder.svg" },
        { name: "Emma Watson", role: "Backend Developer", avatar: "/placeholder.svg" },
        { name: "Frank Miller", role: "Frontend Developer", avatar: "/placeholder.svg" },
      ],
      startDate: "2023-09-01",
      endDate: "2024-06-30",
      progress: 20,
      status: "Planning",
    },
  ]

  return (

    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
    <div className="flex items-center">
      <h1 className="text-lg font-semibold md:text-2xl">Analytics
      My Projects
      </h1>
    </div>
    <div className="flex flex-1 p-4 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
      <div className="space-y-6">
     {projects.map((project) => (
       <Card key={project.id}>
         <CardHeader>
           <CardTitle className="flex justify-between items-center">
             <span>{project.name}</span>
             <span className="text-sm font-normal text-muted-foreground">{project.status}</span>
           </CardTitle>
         </CardHeader>
         <CardContent>
           <div className="space-y-4">
             <p className="text-muted-foreground">{project.description}</p>
             <div>
               <h4 className="font-semibold">Team Lead:</h4>
               <p>{project.teamLead}</p>
             </div>
             <div>
               <h4 className="font-semibold mb-2">Team Members:</h4>
               <div className="flex flex-wrap gap-4">
                 {project.teamMembers.map((member, index) => (
                   <TooltipProvider key={index}>
                     <Tooltip>
                       <TooltipTrigger>
                         <Avatar>
                           <AvatarImage src={member.avatar} alt={member.name} />
                           <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                         </Avatar>
                       </TooltipTrigger>
                       <TooltipContent>
                         <p>{member.name}</p>
                         <p className="text-sm text-muted-foreground">{member.role}</p>
                       </TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                 ))}
               </div>
             </div>
             <div className="flex justify-between text-sm text-muted-foreground">
               <span>Start Date: {project.startDate}</span>
               <span>End Date: {project.endDate}</span>
             </div>
             <div>
               <h4 className="font-semibold mb-2">Project Progress:</h4>
               <div className="flex items-center space-x-4">
                 <Progress value={project.progress} className="flex-1" />
                 <span className="text-sm font-medium">{project.progress}%</span>
               </div>
             </div>
           </div>
         </CardContent>
       </Card>
     ))}
   </div>
      </div>
    </div>
</main>

   
  )
}