"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CalendarDays, Users, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


const project = {
  id: 1,
  name: "Website Redesign",
  teamMembers: [
    { name: "Alice Johnson", progress: 75, imagesCompleted: 75, totalImages: 100 },
    { name: "Bob Smith", progress: 60, imagesCompleted: 60, totalImages: 100 },
    { name: "Charlie Brown", progress: 90, imagesCompleted: 90, totalImages: 100 },
    { name: "Diana Prince", progress: 40, imagesCompleted: 40, totalImages: 100 },
    { name: "Ethan Hunt", progress: 85, imagesCompleted: 85, totalImages: 100 },
    { name: "Fiona Gallagher", progress: 70, imagesCompleted: 70, totalImages: 100 },
    { name: "George Costanza", progress: 55, imagesCompleted: 55, totalImages: 100 },
    { name: "Hannah Baker", progress: 80, imagesCompleted: 80, totalImages: 100 },
  ],
  deadline: "2023-12-31",
  status: "In Progress",
  totalImages: 800,
}

export default function ProjectDetails() {
  const router = useRouter()

  const handleBackClick = () => {
    router.push("/projects")
  }

  const getTotalProgress = () => {
    const totalCompleted = project.teamMembers.reduce((sum, member) => sum + member.imagesCompleted, 0)
    return Math.round((totalCompleted / project.totalImages) * 100)
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={handleBackClick} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
      </Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">{project.name}</CardTitle>
          <CardDescription>
            <div className="flex items-center mt-2">
              <Users className="w-4 h-4 mr-2" />
              {project.teamMembers.length} Team Members
            </div>
            <div className="flex items-center mt-2">
              <CalendarDays className="w-4 h-4 mr-2" />
              <span>Deadline: {project.deadline}</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Overall Progress</span>
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
          <Progress value={getTotalProgress()} className="mb-2" />
          <div className="text-sm text-muted-foreground text-right">
            {project.teamMembers.reduce((sum, member) => sum + member.imagesCompleted, 0)} / {project.totalImages} images completed
          </div>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="team-progress">
          <AccordionTrigger>
            <h3 className="text-xl font-semibold">Team Member Progress</h3>
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Images Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.teamMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={member.progress} className="w-[60%]" />
                        <span className="text-sm font-medium">{member.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{member.imagesCompleted} / {member.totalImages}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}