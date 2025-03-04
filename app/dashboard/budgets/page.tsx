import { BudgetList, BudgetForm } from "@/components/budgets";
import Spinner from "@/components/ui/feedback/spinner";
import { auth } from "@/lib/auth";
import { getBudgets } from "@/lib/data-service";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/buttons";

export const metadata: Metadata = {
  title: "Budgets",
};

export const revalidate = 0; // invalidate the cache / update with current data (this only works for static content) (3600 - every hour)

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const budgets = await getBudgets(session?.user?.userId);
  // console.log(session?.user?.userId);
  if (!budgets) return;

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <BudgetForm />

      <Suspense fallback={<Spinner />}>
        {budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 mt-8 border-2 border-dashed rounded-lg bg-muted/50">
            <Banknote className="h-12 w-12 text-muted-foreground mb-2" />
            <h3 className="text-xl font-semibold mb-2">No budgets yet</h3>
            <p className="text-muted-foreground text-center">
              Create your first budget to start tracking your expenses.
            </p>
          </div>
        ) : (
          <BudgetList budgets={budgets} />
        )}
      </Suspense>
    </div>
  );
}
