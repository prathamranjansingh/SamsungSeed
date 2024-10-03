import { TrendingUp } from 'lucide-react';
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../../ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const ProjectBarchart = () => {
    const chartData = [
        { month: "January", projects: 186 },
        { month: "February", projects: 305 },
        { month: "March", projects: 237 },
        { month: "April", projects: 73 },
        { month: "May", projects: 209 },
        { month: "June", projects: 214 },
      ];
    
      const chartConfig = {
        projects: {
          label: "Projects",
          color: "black",
        },
      };
  return (
    <div>
      <Card>
            <CardHeader>
              <CardTitle>Projects Completed</CardTitle>
              <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="projects"
                    fill="var(--color-projects)"
                    radius={8}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total projects completed for the last 6 months
              </div>
            </CardFooter>
          </Card>
    </div>
  )
}

export default ProjectBarchart
