"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Budget } from "@/lib/data-service";
import Link from "next/link";
import { formatPercentage } from "@/lib/helpers";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type BudgetCardProps = {
  budget: Budget;
};

function BudgetCard({ budget }: BudgetCardProps) {
  const { id, name, amount, category, expenses } = budget;

  const amountSpent = expenses?.totalSpent || 0;
  const remainingAmount = amount - amountSpent;

  const progressPercentage = (amountSpent / amount) * 100;

  const getProgressColor = (percentage: number): string => {
    return cn("[&>div]:bg-green-400", {
      "[&>div]:bg-red-400": percentage > 80,
      "[&>div]:bg-orange-400": percentage > 60 && percentage <= 80,
      "[&>div]:bg-yellow-400": percentage > 30 && percentage <= 60,
      "[&>div]:bg-lime-400": percentage <= 30,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {name}
          <span className="ml-1 text-sm text-muted-foreground">
            ({category})
          </span>
        </CardTitle>
        <CardDescription className="font-semibold text-3xl">
          ${amount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={progressPercentage}
          className={cn(
            "w-full bg-slate-200",
            getProgressColor(progressPercentage)
          )}
        />

        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span className="text-red-500">${amountSpent} spent</span>
          <span className="text-green-500">${remainingAmount} remaining</span>
        </div>
      </CardContent>

      <CardFooter>
        <Link
          href={`budgets/${id}`}
          className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}

export default BudgetCard;
