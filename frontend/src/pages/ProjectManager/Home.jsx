'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function Home() {
  const [teamLeads, setTeamLeads] = useState([])
  const [tasks, setTasks] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    const fetchTeamLeads = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/teamLeadNameCount`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          })
          console.log("Team Leads Data:", response.data)
          // Convert tasksCompleted and totalTasks to numbers
          const teamLeadsWithNumbers = response.data.map(lead => ({
            ...lead,
            tasksCompleted: parseInt(lead.taskscompleted),  // Convert to number
            totalTasks: parseInt(lead.totaltasks),  // Convert to number
          }))
          setTeamLeads(teamLeadsWithNumbers)  // Set the team leads with numbers
        } catch (error) {
          console.error("Error fetching team leads:", error)
        }
      }

    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTeamNameAndCount`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        })    
        setTeams(response.data)  
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }

    const fetchTasks = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/getTaskEmpName`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          })
          setTasks(response.data) 
        } catch (error) {
          console.error("Error fetching tasks:", error)
        }
      }
      
    fetchTasks()
    fetchTeamLeads()
    fetchTeams()
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
  const pendingTasks = tasks.filter(task => task.status === 'pending').length

  const taskStatusData = [
    { name: 'Completed', value: completedTasks },
    { name: 'In Progress', value: inProgressTasks },
    { name: 'Pending', value: pendingTasks },
  ]

  const COLORS = ['#4CAF50', '#2196F3', '#FFC107']

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-500'
      case 'in-progress': return 'bg-blue-500'
      case 'pending': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Project Manager Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Team Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamLeads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="team-leads" className="space-y-4">
        <TabsList>
          <TabsTrigger value="team-leads">Team Leads</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="team-leads">
          <Card>
            <CardHeader>
              <CardTitle>Team Leads Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Tasks Completed</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamLeads.map((lead) => {
                    const progress = lead.totalTasks > 0 ? (lead.tasksCompleted / lead.totalTasks) * 100 : 0;
                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.name}</TableCell>
                        <TableCell>{lead.team}</TableCell>
                        <TableCell>{lead.tasksCompleted} / {lead.totalTasks}</TableCell>
                        <TableCell>
                          <Progress value={progress} className="w-[60%]" />
                          <div className="text-sm mt-1">{progress.toFixed(2)}%</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task Name</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell>{task.team}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(task.status)} text-white`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={taskStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : null}
                      >
                        {taskStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="teams">
          <Card>
            <CardHeader>
              <CardTitle>Teams Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Team Leads</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.teamLeads}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
