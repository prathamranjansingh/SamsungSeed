import { useState, useMemo } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { useToast } from "@/hooks/use-toast"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { PlusIcon, UserIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import teamData from '../assets/demoData/teamData.json'; // Adjust the path as necessary

export default function TeamManagement() {
  const [teams, setTeams] = useState(teamData.teams); // Initialize with data from JSON
  const [allMembers, setAllMembers] = useState(teamData.members); // Initialize members from JSON
  const [teamName, setTeamName] = useState('');
  const [teamLead, setTeamLead] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const availableMembers = useMemo(() => {
    return allMembers.filter(member => member.name !== teamLead);
  }, [teamLead]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
      lead: teamLead,
      members: selectedMembers
    };
    setTeams([...teams, newTeam]);
    setTeamName('');
    setTeamLead('');
    setSelectedMembers([]);
    setIsDialogOpen(false);
    toast({
      title: "Team Created",
      description: `${newTeam.name} has been successfully added.`,
    });
  };

  const handleMemberSelect = (memberId) => {
    const member = availableMembers.find(m => m.id === memberId);
    if (member && !selectedMembers.some(m => m.id === memberId)) {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const handleRemoveMember = (memberId) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <PlusIcon className="mr-2 h-5 w-5" /> Create Team
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
                <Select onValueChange={setTeamLead} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {allMembers.map((member) => (
                      <SelectItem key={member.id} value={member.name}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="teamMembers">Team Members</Label>
                <Select onValueChange={handleMemberSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team members" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <div key={member.id} className="flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm">
                      {member.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="ml-2 focus:outline-none text-green-600 hover:text-green-800"
                        aria-label={`Remove ${member.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
                  <TableHead>Team Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">{team.lead}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap items-center gap-2">
                        {team.members.map((member) => (
                          <span key={member.id} className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                            <UserIcon className="w-3 h-3 mr-1" />
                            {member.name}
                          </span>
                        ))}
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
