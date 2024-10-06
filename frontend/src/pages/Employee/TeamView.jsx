import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TeamView() {
  const teams = [
    {
      id: 1,
      name: "Frontend Development",
      lead: "Alice Johnson",
      members: [
        { name: "John Doe", role: "Senior Developer", avatar: "/placeholder.svg" },
        { name: "Jane Smith", role: "UI/UX Designer", avatar: "/placeholder.svg" },
        { name: "Mike Johnson", role: "Junior Developer", avatar: "/placeholder.svg" },
      ],
      currentProject: "Website Redesign",
      progress: 75,
    },
    {
      id: 2,
      name: "Backend Development",
      lead: "Bob Wilson",
      members: [
        { name: "Alice Brown", role: "Senior Backend Developer", avatar: "/placeholder.svg" },
        { name: "Charlie Davis", role: "Database Specialist", avatar: "/placeholder.svg" },
      ],
      currentProject: "API Optimization",
      progress: 60,
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">My Teams</h2>
      {teams.map((team) => (
        <Card key={team.id}>
          <CardHeader>
            <CardTitle>{team.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Team Lead:</h4>
                <p>{team.lead}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Team Members:</h4>
                <div className="flex flex-wrap gap-4">
                  {team.members.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar>
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Current Project:</h4>
                <p>{team.currentProject}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Project Progress:</h4>
                <div className="flex items-center space-x-4">
                  <Progress value={team.progress} className="flex-1" />
                  <span className="text-sm font-medium">{team.progress}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}