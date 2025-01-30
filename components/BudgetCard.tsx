import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Budget } from "@/lib/data-service";
import Link from "next/link";
import { formatPercentage } from "@/lib/helpers";

type BudgetCardProps = {
  budget: Budget;
};

async function BudgetCard({ budget }: BudgetCardProps) {
  const { id, name, amount, category, expenses } = budget;

  const amountSpent = expenses?.amountSpent || 0;
  const remainingAmount = amount - amountSpent;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription>
            {category} - ${amount}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <progress
            max={amount}
            value={amountSpent}
            className="relative w-full h-full overflow-hidden rounded-full appearance-none bg-slate-200 [&::-webkit-progress-bar]:bg-slate-50 [&::-webkit-progress-value]:bg-lime-400 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-lime-400"
          >
            {formatPercentage(amountSpent / amount)}
          </progress>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>${amountSpent} spent</span>
            <span>${remainingAmount} remaining</span>
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
    </>
  );
}

export default BudgetCard;
