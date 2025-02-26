import { ExpenseForm, ExpenseTable } from "@/components/expenses";
import Spinner from "@/components/ui/feedback/spinner";
import { auth } from "@/lib/auth";
import { getBudgets, getExpenses } from "@/lib/data-service";
import { Metadata } from "next";
import { Suspense } from "react";

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
          <p className="text-lg">You have no expenses yet.</p>
        ) : (
          <ExpenseTable expenses={expenses} budgets={budgets} />
        )}
      </Suspense>
    </div>
  );
}
