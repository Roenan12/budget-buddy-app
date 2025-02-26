import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Budget } from "@/lib/data-service";
import { Activity, CreditCard, DollarSign, HandCoins } from "lucide-react";
import Link from "next/link";

async function StatsCard({ budgets }: { budgets: Budget[] }) {
  const activeBudgets = budgets?.length;
  const totalBudget = budgets?.reduce((acc, budget) => acc + budget.amount, 0);
  const totalExpenses = budgets?.reduce(
    (acc, budget) => acc + budget.expenses.totalSpent,
    0
  );
  const remainingBudget = (totalBudget - totalExpenses).toFixed(2);

  return (
    <>
      <Link href="/dashboard/budgets">
        <Card className="hover:bg-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
          </CardContent>
        </Card>
      </Link>
      <Link href="/dashboard/expenses">
        <Card className="hover:bg-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </Link>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <HandCoins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${remainingBudget}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Budgets</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBudgets}</div>
        </CardContent>
      </Card>
    </>
  );
}

export default StatsCard;
