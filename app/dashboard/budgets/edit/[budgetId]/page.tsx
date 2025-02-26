import { UpdateBudgetForm } from "@/components/budgets";
import { getBudget } from "@/lib/data-service";

type Params = {
  budgetId: number;
};

async function Page({ params }: { params: Params }) {
  const { budgetId } = params;

  const budget = await getBudget(budgetId);
  if (!budget) throw new Error("Budget not found");

  return (
    <div>
      <UpdateBudgetForm budgetId={budgetId} budget={budget} />
    </div>
  );
}

export default Page;
