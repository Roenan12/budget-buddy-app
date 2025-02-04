import { Budget } from "@/lib/data-service";
import BudgetCard from "./BudgetCard";

type BudgetListProps = {
  budgets: Budget[];
};

async function BudgetList({ budgets }: BudgetListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {budgets.map((budget) => (
        <BudgetCard budget={budget} key={budget.id} />
      ))}
    </div>
  );
}

export default BudgetList;
