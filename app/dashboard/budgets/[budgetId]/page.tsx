import { auth } from "@/lib/auth";
import { Budget, getBudget } from "@/lib/data-service";

import { BudgetCardDetails } from "@/components/budgets";
import { BackButton } from "@/components/ui/buttons/back-button";

type Params = {
  params: {
    budgetId: string;
  };
};

export async function generateMetadata({ params }: Params) {
  const budget = await getBudget(Number(params.budgetId));

  if (!budget) {
    throw new Error("Budget not found");
  }

  const { name } = budget;
  return { title: `Budget ${name}` };
}

export default async function Page({ params }: Params) {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("User not authenticated");
  }

  const budget: Budget | null = await getBudget(Number(params.budgetId));

  if (!budget) {
    throw new Error("Failed to load budget details");
  }

  return (
    <div className="w-full p-4">
      <div className="max-w-3xl">
        <BackButton href="/dashboard/budgets" label="Back to Budgets" />
      </div>
      <BudgetCardDetails budget={budget} params={params} />{" "}
    </div>
  );
}
