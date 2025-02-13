import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import { auth } from "@/lib/auth";
import { getExpenses, getBudgets } from "@/lib/data-service";
import { Metadata } from "next";

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

      <ExpenseTable expenses={expenses} />
    </div>
  );
}
