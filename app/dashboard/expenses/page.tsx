import { ExpenseForm, ExpenseTable } from "@/components/expenses";
import Spinner from "@/components/ui/feedback/spinner";
import { auth } from "@/lib/auth";
import { getBudgets, getExpenses } from "@/lib/data-service";
import { Metadata } from "next";
import { Suspense } from "react";
import { ReceiptText } from "lucide-react";

export const metadata: Metadata = {
  title: "Expenses",
};

export const revalidate = 0;

export default async function Page() {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("User not authenticated");
  }
  const budgets = await getBudgets(session.user.userId);
  if (!budgets) return;
  const expenses = await getExpenses(session.user.userId);
  if (!expenses) return;

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <ExpenseForm budgets={budgets} />

      <Suspense fallback={<Spinner />}>
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-8 border-2 border-dashed rounded-lg bg-muted/50">
            <ReceiptText className="h-10 w-10 text-muted-foreground mb-2" />
            <h3 className="text-xl font-semibold mb-2">No expenses recorded</h3>
            <p className="text-muted-foreground text-center">
              Start tracking your spending by adding your first expense.
            </p>
          </div>
        ) : (
          <ExpenseTable expenses={expenses} budgets={budgets} />
        )}
      </Suspense>
    </div>
  );
}
