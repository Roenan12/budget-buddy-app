import BudgetList from "@/components/BudgetList";
import BudgetsForm from "@/components/BudgetForm";
import Spinner from "@/components/ui/spinner";
import { auth } from "@/lib/auth";
import { getBudgets } from "@/lib/data-service";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Budgets",
};

export const revalidate = 0; // invalidate the cache / update with current data (this only works for static content) (3600 - every hour)

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const budgets = await getBudgets(session?.user?.userId);
  console.log(session?.user?.userId);
  if (!budgets) return;

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <BudgetsForm />

      <Suspense fallback={<Spinner />}>
        {budgets.length === 0 ? (
          <p className="text-lg">You have no budgets yet.</p>
        ) : (
          <BudgetList budgets={budgets} />
        )}
      </Suspense>
    </div>
  );
}
