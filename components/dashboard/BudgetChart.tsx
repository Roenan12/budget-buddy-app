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
import React from "react";
import { Expense } from "@/lib/data-service";

type ChartDataPoint = {
  date: string;
  formattedDate: string;
  month: string;
  remainingBudget: number;
  totalExpenses: number;
  budgetName: string;
  budgetId: number;
  expenseDetails: {
    names: string[];
    amount: number;
  }[];
};

function BudgetChart({
  budgets,
  expenses,
}: {
  budgets: Budget[];
  expenses: Expense[];
}) {
  const chartData = React.useMemo(() => {
    // Sort expenses by date
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dateMap = new Map<string, ChartDataPoint>();
    const budgetExpenses = new Map<number, number>();

    // Group expenses by date and budget
    const expensesByDate = new Map<
      string,
      Map<number, { names: string[]; amount: number }[]>
    >();

    sortedExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const dateStr = date.toISOString().split("T")[0];

      // Get the budget for this expense
      const budget = budgets.find((b) => b.id === expense.budgetId);
      if (!budget) return;

      // Update running total for this specific budget
      const currentExpenses = budgetExpenses.get(budget.id) || 0;
      const newExpenseTotal = currentExpenses + expense.amountSpent;
      budgetExpenses.set(budget.id, newExpenseTotal);

      // Track expenses for this date and budget
      if (!expensesByDate.has(dateStr)) {
        expensesByDate.set(dateStr, new Map());
      }
      const budgetExpenseMap = expensesByDate.get(dateStr)!;
      if (!budgetExpenseMap.has(budget.id)) {
        budgetExpenseMap.set(budget.id, []);
      }
      budgetExpenseMap.get(budget.id)!.push({
        names: [expense.name],
        amount: expense.amountSpent,
      });

      // Calculate remaining budget for this specific budget
      const remainingBudget = budget.amount - newExpenseTotal;

      dateMap.set(dateStr, {
        date: dateStr,
        formattedDate: date.toLocaleDateString("default", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        month: date.toLocaleString("default", { month: "long" }),
        remainingBudget,
        totalExpenses: newExpenseTotal,
        budgetName: budget.name,
        budgetId: budget.id,
        expenseDetails: budgetExpenseMap.get(budget.id)!,
      });
    });

    return Array.from(dateMap.values());
  }, [budgets, expenses]);

  const chartConfig = {
    remainingBudget: {
      label: "Remaining Budget",
      color: "rgb(173, 255, 47)",
    },
    totalExpenses: {
      label: "Total Expenses",
      color: "rgb(255, 47, 47)",
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
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const budget = budgets.find((b) => b.id === data.budgetId);
                  const hasMultipleExpenses = data.expenseDetails.length > 1;

                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-medium">{data.formattedDate}</div>
                        <div className="text-xs text-muted-foreground">
                          Budget: {data.budgetName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Amount: ${budget?.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Expense:{" "}
                          {data.expenseDetails
                            .map((e: { names: string[] }) => e.names[0])
                            .join(", ")}
                        </div>
                        {hasMultipleExpenses && (
                          <div className="text-xs text-muted-foreground">
                            Amount Spent: $
                            {data.expenseDetails
                              .reduce(
                                (sum: number, e: { amount: number }) =>
                                  sum + e.amount,
                                0
                              )
                              .toFixed(2)}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="flex w-full flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                <div className="rounded-full bg-[rgb(173,255,47)] w-2 h-2" />
                                <span className="text-sm text-muted-foreground">
                                  Remaining Budget
                                </span>
                              </div>
                              <span className="font-medium">
                                ${data.remainingBudget.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1">
                                <div className="rounded-full bg-[rgb(255,47,47)] w-2 h-2" />
                                <span className="text-sm text-muted-foreground">
                                  Total Expenses
                                </span>
                              </div>
                              <span className="font-medium">
                                ${data.totalExpenses.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              dataKey="remainingBudget"
              type="natural"
              fill="rgb(173, 255, 47)"
              fillOpacity={0.4}
              stroke="rgb(173, 255, 47)"
              strokeWidth={2}
            />
            <Area
              dataKey="totalExpenses"
              type="natural"
              fill="rgb(255, 47, 47)"
              fillOpacity={0.4}
              stroke="rgb(255, 47, 47)"
              strokeWidth={2}
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
