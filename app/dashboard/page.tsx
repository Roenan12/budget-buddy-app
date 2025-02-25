import BudgetChart from "@/components/BudgetChart";
import { RecentExpenses } from "@/components/RecentExpenses";
import StatsCard from "@/components/StatsCard";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { getBudgets } from "@/lib/data-service";

export default async function Page() {
  const session = await auth();
  if (!session) return;
  const budgets = await getBudgets(session?.user?.userId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard budgets={budgets} />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>
              Monthly budget and expenses breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <BudgetChart budgets={budgets} />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest personal expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentExpenses />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
