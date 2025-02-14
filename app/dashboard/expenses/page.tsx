import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import Spinner from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import { getExpenses, getBudgets } from "@/lib/data-service";
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
          <ExpenseTable expenses={expenses} />
        )}
      </Suspense>
    </div>
  );
}
