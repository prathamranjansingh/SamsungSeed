import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusIcon, UserIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TeamLeadManagement() {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesResponse, teamsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/employees`),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/get-team`)
        ]);
        const employeesData = await employeesResponse.json();
        const teamsData = await teamsResponse.json();
        setEmployees(employeesData);
        setTeams(teamsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch data. Please try again.",
          variant: "destructive"
        });
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const requestData = {
      team_name: teamName,
      team_lead_id: teamLead,
    };
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/team-create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const newTeamObj = await response.json();
        const newTeam = newTeamObj[0];
        const formattedNewTeam = {
          ...newTeam,
          lead: employees.find(emp => emp.id === newTeam.team_lead_id)?.name || 'Unknown',
        };

        setTeams(prevTeams => [...prevTeams, formattedNewTeam]);
        setTeamName('');
        setTeamLead('');
        setIsDialogOpen(false);
        toast({
          title: "Team Created",
          description: `${formattedNewTeam.team_name} has been successfully added.`,
        });
      } else {
        throw new Error("Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: "Failed to create team. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusIcon className="mr-2 h-5 w-5" /> Create Team Lead
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Team</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="teamLead">Team Lead</Label>
                <Select value={teamLead} onValueChange={(value) => setTeamLead(value)} required>
                  <SelectTrigger>
                    <span>
                      {teamLead 
                        ? employees.find(emp => emp.id === teamLead)?.name 
                        : "Select team lead"}
                    </span>
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create Team</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teams</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Team Name</TableHead>
                  <TableHead>Team Lead</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.team_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-green-800">
                        <UserIcon className="w-3 h-3 mr-1" />
                        {team.lead}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
