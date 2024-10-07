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
} from 'lucide-react';

export default function EmployeeHome() {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">1 completed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Annotators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <p className="text-xs text-muted-foreground">Across all projects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Images in Queue</CardTitle>
              <FileCheck2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">734</div>
              <p className="text-xs text-muted-foreground">Waiting for annotation</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Active Annotation Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Traffic Sign Recognition", progress: 75, team: 6, remaining: 250, total: 1000 },
                  { name: "Medical Imaging Analysis", progress: 50, team: 8, remaining: 500, total: 1000 },
                  { name: "Satellite Imagery Labeling", progress: 25, team: 5, remaining: 750, total: 1000 },
                  { name: "Facial Recognition Dataset", progress: 60, team: 6, remaining: 400, total: 1000 },
                ].map((project) => (
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
          <Card className="col-span-3">
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
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quality Check Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Send Feedback
              </Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Annotations
              </Button>
              <Button>
                <FileCheck2 className="mr-2 h-4 w-4" />
                Finalize and Archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
