import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function TeamView() {
  const [teamData, setTeamData] = useState(null) // Set initial state to null
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token') 

        if (!token) {
          setError('No token provided')
          setLoading(false)
          return
        }

        const backendUrl = import.meta.env.VITE_BACKEND_URL

        const response = await axios.get(`${backendUrl}/getempDetails`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        // Assuming the response is an array, but you're accessing the first element:
        console.log(response.data); // Check structure of the response

        setTeamData(response.data[0]) // Set team data directly
      } catch (err) {
        console.error('Error fetching team data:', err)
        setError('Error fetching team data')
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [])

  const getTeamMembers = (members) => {
    // Ensure members is an object before iterating
    if (members && typeof members === 'object') {
      return Object.entries(members).map(([id, name]) => ({ id, name }))
    }
    return []
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!teamData) {
    return <div>No team data available.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <Card key={teamData.id} className="mb-6">
        <CardHeader>
          <CardTitle>{teamData.team_name}</CardTitle>
          <CardDescription>Project: {teamData.project_name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Team Lead</h3>
            <p>{teamData.team_lead_name}</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Team Members</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getTeamMembers(teamData.team_members).map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Tasks</h3>
            <div className="flex flex-wrap gap-2">
              {teamData.tasks.map((task, index) => (
                <Badge key={index} variant="secondary">{task}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
