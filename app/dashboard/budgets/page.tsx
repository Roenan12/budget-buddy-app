import { BudgetList, BudgetForm } from "@/components/budgets";
import { auth } from "@/lib/auth";
import { getBudgets, getCurrentCurrencySymbol } from "@/lib/data-service";
import type { Metadata } from "next";
import { Suspense } from "react";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/feedback/skeleton";

export const metadata: Metadata = {
  title: "Budgets",
};

function BudgetListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <Skeleton key={i} className="h-[200px]" />
      ))}
    </div>
  );
}

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const budgets = await getBudgets(session?.user?.userId);
  if (!budgets) return;

  // Get the user's currency symbol
  const currencySymbol = await getCurrentCurrencySymbol();

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <BudgetForm currencySymbol={currencySymbol} />

      <Suspense fallback={<BudgetListSkeleton />}>
        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-8 border-2 border-dashed rounded-lg bg-muted/50">
            <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No budgets yet</h3>
            <p className="text-muted-foreground text-center">
              Create your first budget to start tracking your expenses.
            </p>
          </div>
        ) : (
          <BudgetList budgets={budgets} currencySymbol={currencySymbol} />
        )}
      </Suspense>
    </div>
  );
}
