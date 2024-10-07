import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DashboardContent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Analytics Dashboard
        </h1>
      </div>
        <div className="text-sm text-muted-foreground">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">
                  Welcome, John Doe
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-xl">Software Engineer</p>
                  <p className="text-muted-foreground">
                    Department: Development
                  </p>
                  <p className="text-muted-foreground">Employee ID: E12345</p>
                  <p className="text-muted-foreground">
                    Contact: johndoe@example.com
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Tasks Completed</span>
                  <span className=" font-bold">12/15</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Projects On-time</span>
                  <span className=" font-bold">90%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Team Productivity</span>
                  <span className=" font-bold">85%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Website Redesign</TableCell>
                      <TableCell>In Progress</TableCell>
                      <TableCell>
                        <Progress value={75} className="w-[60%]" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Mobile App Development</TableCell>
                      <TableCell>Planning</TableCell>
                      <TableCell>
                        <Progress value={20} className="w-[60%]" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
    </main>
  );
}
