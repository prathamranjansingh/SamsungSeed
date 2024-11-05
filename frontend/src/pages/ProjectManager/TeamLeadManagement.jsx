import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { PlusIcon, UserIcon, ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const TeamLeadManagement = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTeam, setNewTeam] = useState({
    team_name: '',
    team_lead_id: '',
    member_ids: [],
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const token = localStorage.getItem('token');

  
  const fetchData = useCallback(async () => {
    if (!token) {
        toast({
            title: "Authentication Error",
            description: "Please log in to access this page.",
            variant: "destructive"
        });
        return;
    }

    setIsLoading(true);
    try {
        const [employeesResponse, teamsResponse] = await Promise.all([
            axios.get(`${BACKEND_URL}/getEmployees`, {
                headers: { 'Authorization': `Bearer ${token}` },
            }),
            axios.get(`${BACKEND_URL}/getTeams`, {
                headers: { 'Authorization': `Bearer ${token}` },
            }),
        ]);

        const employeesData = employeesResponse.data || [];
        
        
        setEmployees(employeesData);

        const teamsData = teamsResponse.data.teams || [];
    
        setTeams(teamsData.map((team) => ({
            team_id: team.team_id,
            team_name: team.team_name,
            lead_name: team.lead_name,
            team_member_names: team.team_member_names,
        })));
    } catch (error) {
        console.error("Error fetching data:", error);
        toast({
            title: "Error",
            description: "Failed to fetch data. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
}, [token, toast]);

  

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMultiSelectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setNewTeam(prev => ({ ...prev, member_ids: selectedOptions }));
  };

  const handleNextStep = () => {
    if (!newTeam.team_name || !newTeam.team_lead_id) {
      toast({
        title: "Validation Error",
        description: "Please fill in both team name and team lead.",
        variant: "destructive"
      });
      return;
    }
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  const resetForm = () => {
    setNewTeam({
      team_name: '',
      team_lead_id: '',
      member_ids: [],
    });
    setCurrentStep(1);
    setIsDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newTeam.team_name || !newTeam.team_lead_id || newTeam.member_ids.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
  
    try {
      const obj =  {
        team_name: newTeam.team_name,
        team_lead_id: newTeam.team_lead_id,
        members: newTeam.member_ids
      }
      
      
      const response = await axios.post(
        `${BACKEND_URL}/createTeam`,
        {
          team_name: newTeam.team_name,
          team_lead_id: newTeam.team_lead_id,
          members: newTeam.member_ids
        },
        {
          headers: { 'Authorization': `Bearer ${token}` },
        }
      );
  
      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Team created successfully",
        });
        resetForm();
        fetchData();
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast({
        title: "Error",
        description: axios.isAxiosError(error) && error.response?.data?.message 
          ? error.response.data.message 
          : "Failed to create team. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTeamLeadName = () => {
    const teamLead = employees.find(emp => emp.id === newTeam.team_lead_id);
    return teamLead ? teamLead.name : '';
  };

  const getAvailableMembers = () => {
    return employees.filter(employee => {
      return String(employee.id) !== String(newTeam.team_lead_id);
    });
  };


  

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusIcon className="mr-2 h-5 w-5" /> Create Team
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Team</DialogTitle>
              <DialogDescription>
                {currentStep === 1 ? 'Enter team details and select team lead.' : 'Select team members.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {currentStep === 1 ? (
                <>
                  <div>
                    <Label htmlFor="teamName">Team Name</Label>
                    <Input
                      id="teamName"
                      value={newTeam.team_name}
                      onChange={(e) => setNewTeam(prev => ({ ...prev, team_name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamLead">Team Lead</Label>
                    <select
                      id="teamLead"
                      value={newTeam.team_lead_id}
                      onChange={(e) => {
                        setNewTeam(prev => ({
                          ...prev,
                          team_lead_id: e.target.value,
                          member_ids: []
                        }));
                      }}
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      required
                    >
                      <option value="">Select team lead</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={handleNextStep}>
                      Next <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <h3 className="text-sm font-medium mb-1">Selected Team Lead</h3>
                    <p className="text-sm text-gray-500">{getTeamLeadName()}</p>
                  </div>
                  <div>
                    <Label htmlFor="teamMembers">Team Members</Label>
                    <select
                      id="teamMembers"
                      multiple
                      value={newTeam.member_ids}
                      onChange={handleMultiSelectChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 min-h-[100px]"
                      required
                    >
                      {getAvailableMembers().map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
                  </div>
                  <div className="flex justify-between">
                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                      <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button type="submit" disabled={isLoading}>Create Team</Button>
                  </div>
                </>
              )}
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
                  <TableHead>Team Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : teams.length > 0 ? (
                  teams.map((team) => (
                    <TableRow key={team.team_id}>
                      <TableCell className="font-medium">{team.team_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-green-800">
                          <UserIcon className="w-3 h-3 mr-1" />
                          {team.lead_name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {team.team_member_names.map((memberName, index) => (
                          <div key={index} className="flex items-center text-gray-600">
                            <UserIcon className="w-3 h-3 mr-1" />
                            {memberName}
                          </div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No teams available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamLeadManagement;