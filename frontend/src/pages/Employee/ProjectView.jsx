'use client'

import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Check } from 'lucide-react'

export function ProjectView() {
  const [teamLeadPath, setTeamLeadPath] = useState('')
  const [serverPath, setServerPath] = useState('')
  const [totalImages, setTotalImages] = useState(0)
  const [taskStatus, setTaskStatus] = useState('working')
  const [updateNote, setUpdateNote] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const teamLeadPathRef = useRef(null)

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/folderPath`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log(response.data);
        
        setTeamLeadPath(response.data.folderPath)
      } catch (err) {
        console.error('Error fetching team data:', err)  
      }
    }
    
    fetchTeamData();
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const confirmSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Authorization token is missing. Please log in again.");
        return;
      }
  
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/editStatus`,
        { status: taskStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.data.success) {
        alert('Work status updated successfully!');
      } else {
        alert(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('There was an error submitting your update.');
    }
  
    setIsModalOpen(false);
  };
  

  const copyTeamLeadPath = () => {
    if (teamLeadPath) {
      navigator.clipboard.writeText(teamLeadPath)
        .then(() => {
          setIsCopied(true);
          setIsCopyModalOpen(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error('Error copying text: ', err);
        });
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Employee Task Update</CardTitle>
          <CardDescription>Update your task progress and provide information to your team lead.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="teamLeadPath">Team Lead Provided Path</Label>
                <div className="flex">
                  <Input 
                    id="teamLeadPath"
                    value={teamLeadPath}
                    disabled
                    className="flex-grow"
                    ref={teamLeadPathRef}
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={copyTeamLeadPath}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="taskStatus">Task Status</Label>
                <Select value={taskStatus} onValueChange={setTaskStatus}>
                  <SelectTrigger id="taskStatus">
                    <SelectValue placeholder="Select task status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working">Working</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
             
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit}>Submit Update</Button>
        </CardFooter>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Update</DialogTitle>
            <DialogDescription>
              Please review the information below before submitting your update.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskStatus" className="text-right">
                Task Status
              </Label>
              <div className="col-span-3">{taskStatus === 'working' ? 'Working' : 'Completed'}</div>
            </div>
            
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={confirmSubmit}>Confirm and Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCopyModalOpen} onOpenChange={setIsCopyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Path Copied</DialogTitle>
            <DialogDescription>
              The team lead provided path has been copied to your clipboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsCopyModalOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}











