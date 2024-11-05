import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3,
  CheckCircle,
  Image as ImageIcon,
  Users,
  FileCheck2,
  Send,
  AlertTriangle,
} from 'lucide-react';


export default function ProjectManagerHome(){
    const projects = [
        { id: 1, name: "Traffic Sign Recognition", progress: 75, totalImages: 1000, completedImages: 750, urgentReviews: 5 },
        { id: 2, name: "Medical Imaging Analysis", progress: 60, totalImages: 800, completedImages: 480, urgentReviews: 2 },
        { id: 3, name: "Satellite Imagery Labeling", progress: 40, totalImages: 1200, completedImages: 480, urgentReviews: 8 },
      ]
      const teamMembers = [
        { id: 1, name: "Alice Johnson", role: "Senior Annotator", performance: 95, avatar: "/avatars/alice.jpg" },
        { id: 2, name: "Bob Smith", role: "Annotator", performance: 88, avatar: "/avatars/bob.jpg" },
        { id: 3, name: "Carol Williams", role: "Quality Checker", performance: 92, avatar: "/avatars/carol.jpg" },
        { id: 4, name: "David Brown", role: "Annotator", performance: 85, avatar: "/avatars/david.jpg" },
      ]
    return(
        <div className="flex flex-col min-h-screen">
            <main className="flex-1 p-4 md:p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{projects.length}</div>
                    <p className="text-xs text-muted-foreground">
                        {projects.filter(p => p.progress === 100).length} completed
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">20</div>
                    <p className="text-xs text-muted-foreground">
                    6 Each Team
                    </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Images Annotated</CardTitle>
                    <FileCheck2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">
                        {projects.reduce((sum, project) => sum + project.completedImages, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Out of {projects.reduce((sum, project) => sum + project.totalImages, 0)} total
                    </p>
                    </CardContent>
                </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                    <CardTitle>Active Annotation Teams</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        {projects.map((project) => (
                        <div key={project.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{project.name}</p>
                            <div className="text-sm text-muted-foreground">{project.progress}%</div>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{project.team} team members</span>
                            <span>{project.remaining} of {project.total} images remaining</span>
                            </div>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                <Card className="col-span-4">
                    <CardHeader>
                    <CardTitle>Team Performance</CardTitle>
                    <CardDescription>Annotation accuracy and speed</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        {[
                        { name: "Team A", project: "Traffic Sign Recognition", accuracy: 98.5, speed: 120, completed: 750 },
                        { name: "Team B", project: "Medical Imaging Analysis", accuracy: 97.8, speed: 110, completed: 500 },
                        { name: "Team C", project: "Satellite Imagery Labeling", accuracy: 97.2, speed: 115, completed: 250 },
                        { name: "Team D", project: "Facial Recognition Dataset", accuracy: 98.0, speed: 118, completed: 600 },
                        ].map((team) => (
                        <div key={team.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">{team.name}</p>
                            <div className="text-sm text-muted-foreground">{team.project}</div>
                            </div>
                            <div className="flex justify-between text-xs">
                            <span>{team.accuracy}% accuracy</span>
                            <span>{team.speed} img/hour</span>
                            <span>{team.completed} completed</span>
                            </div>
                            <Progress value={team.accuracy} className="h-1" />
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                    <CardTitle>Quality Check Queue</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="space-y-4">
                        {[
                        { project: "Traffic Sign Recognition", annotator: "Alice J.", images: 50, time: "2 hours ago" },
                        { project: "Medical Imaging Analysis", annotator: "Bob S.", images: 75, time: "4 hours ago" },
                        { project: "Satellite Imagery Labeling", annotator: "Carol W.", images: 60, time: "1 day ago" },
                        { project: "Facial Recognition Dataset", annotator: "David M.", images: 80, time: "2 days ago" },
                        ].map((queue, index) => (
                        <div key={index} className="flex items-center space-x-4">
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                            <ImageIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                            <p className="text-sm font-medium leading-none">{queue.project}</p>
                            <p className="text-xs text-muted-foreground">Annotator: {queue.annotator}</p>
                            </div>
                            <div className="text-sm text-right">
                            <div>{queue.images} images</div>
                            <div className="text-xs text-muted-foreground">{queue.time}</div>
                            </div>
                            <Button size="sm" variant="outline">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review
                            </Button>
                        </div>
                        ))}
                    </div>
                    </CardContent>
                </Card>
                
                </div>
            </main>
        </div>   
    )
}