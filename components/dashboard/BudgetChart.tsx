"use client";

import { CardContent, CardFooter } from "@/components/ui/data-display/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/data-display/chart";
import { Budget } from "@/lib/data-service";
import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

function BudgetChart({ budgets }: { budgets: Budget[] }) {
  const chartData = budgets.map((budget) => ({
    month: new Date(budget.created_at).toLocaleString("default", {
      month: "long",
    }),
    fullDate: new Date(budget.created_at).toLocaleDateString("default", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    budget: budget.amount,
    expenses: budget.expenses.totalSpent,
  }));

  const chartConfig = {
    budget: {
      label: "Budget",
      color: "#adff2f",
    },
    expenses: {
      label: "Expenses",
      color: "#ff2f2f",
    },
  } satisfies ChartConfig;

  return (
    <>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return payload[0].payload.fullDate;
                    }
                    return label;
                  }}
                />
              }
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="var(--color-expenses)"
              fillOpacity={0.4}
              stroke="var(--color-expenses)"
              stackId="a"
            />
            <Area
              dataKey="budget"
              type="natural"
              fill="var(--color-budget)"
              fillOpacity={0.4}
              stroke="var(--color-budget)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Budget Overview <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {chartData[0]?.month} - {chartData[chartData.length - 1]?.month}{" "}
              {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </CardFooter>
    </>
  );
}

export default BudgetChart;
