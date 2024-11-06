import { useState, useRef, useEffect } from 'react'
import axios from 'axios'  // Don't forget to import axios
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [isTaskComplete, setIsTaskComplete] = useState(false)
  const [updateNote, setUpdateNote] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const teamLeadPathRef = useRef(null)

  // Fetch data on component mount
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const token = localStorage.getItem('token'); // Make sure to get the token dynamically
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/folderPath`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        console.log(response.data);
        
        setTeamLeadPath(response.data.folderPath)  // Set the response data to state
      } catch (err) {
        console.error('Error fetching team data:', err)  
      }
    }
    
    fetchTeamData();  // Call the function to fetch data
  }, [])  // Empty dependency array to ensure it runs only once

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsModalOpen(true)
  }

  const confirmSubmit = () => {
    console.log({
      serverPath,
      totalImages,
      isTaskComplete,
      updateNote
    })
    setIsModalOpen(false)
    alert('Update submitted successfully!')
  }

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
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="taskComplete" 
                  checked={isTaskComplete}
                  onCheckedChange={(checked) => setIsTaskComplete(checked)}
                />
                <Label htmlFor="taskComplete">Task Complete</Label>
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
              <Label htmlFor="username" className="text-right">
                Total Images
              </Label>
              <div className="col-span-3">{totalImages}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Task Complete
              </Label>
              <div className="col-span-3">{isTaskComplete ? 'Yes' : 'No'}</div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Update Note
              </Label>
              <div className="col-span-3">{updateNote}</div>
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
