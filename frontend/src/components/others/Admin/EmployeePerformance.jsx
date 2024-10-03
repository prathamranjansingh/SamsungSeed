import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";


const chartData = [
  { month: "Pratham", projects: 18 },
  { month: "Rahul", projects: 30  },
  { month: "Shivam", projects: 23  },
  { month: "Ranjit", projects: 7  },
  { month: "Sweetie", projects: 20  },
  { month: "Kiran", projects: 21  },
];

const chartConfig = {
  projects: {
    label: "Projects",
    color: "#1c1c1f",
  },
  label: {
    color: "hsl(var(--background))",
  },
};

export function HorizontalChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performers- Employee</CardTitle>
        <CardDescription>1 Week Report</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="projects" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="projects"
              layout="vertical"
              fill="var(--color-projects)"
              radius={4}
            >
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="projects"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing top performers of this week till now
        </div>
      </CardFooter>
    </Card>
  );
}
