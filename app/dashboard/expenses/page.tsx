import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import { getExpenses } from "@/lib/data-service";

export default async function Page() {
  const expenses = await getExpenses();

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Expenses</h1>

      <ExpenseForm />

      <ExpenseTable expenses={expenses} />
    </div>
  );
}
