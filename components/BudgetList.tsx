import { getBudgets } from "@/lib/data-service";
import BudgetCard from "./BudgetCard";

async function BudgetList() {
  const budgets = await getBudgets();

  if (!budgets) return null;
  console.log(budgets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {budgets.map((budget) => (
        <BudgetCard budget={budget} key={budget.id} />
      ))}
    </div>
  );
}

export default BudgetList;
