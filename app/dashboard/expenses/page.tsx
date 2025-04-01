import { ExpenseForm, ExpenseTable } from "@/components/expenses";
import { auth } from "@/lib/auth";
import {
  getBudgets,
  getExpenses,
  getCurrentCurrencySymbol,
} from "@/lib/data-service";
import { Metadata } from "next";
import { Suspense } from "react";
import { ReceiptText } from "lucide-react";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { Card } from "@/components/ui/data-display/card";

export const metadata: Metadata = {
  title: "Expenses",
};

function ExpenseTableSkeleton() {
  return (
    <Card className="mb-4">
      <div className="border-b">
        <div className="grid grid-cols-5 p-4">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
      </div>
      <div className="divide-y">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 p-4 items-center">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-8 w-[80px]" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default async function Page() {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("User not authenticated");
  }
  const budgets = await getBudgets(session.user.userId);
  if (!budgets) return;
  const expenses = await getExpenses(session.user.userId);
  if (!expenses) return;
  const currencySymbol = await getCurrentCurrencySymbol();

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <ExpenseForm budgets={budgets} currencySymbol={currencySymbol} />

      <Suspense fallback={<ExpenseTableSkeleton />}>
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-8 border-2 border-dashed rounded-lg bg-muted/50">
            <ReceiptText className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-xl font-semibold mb-2">No expenses recorded</h3>
            <p className="text-muted-foreground text-center">
              Start tracking your spending by adding your first expense.
            </p>
          </div>
        ) : (
          <ExpenseTable
            expenses={expenses}
            budgets={budgets}
            currencySymbol={currencySymbol}
          />
        )}
      </Suspense>
    </div>
  );
}
