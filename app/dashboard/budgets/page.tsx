import BudgetList from "@/components/BudgetList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/ui/spinner";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Budgets",
};

export const revalidate = 0; // invalidate the cache / update with current data (this only works for static content) (3600 - every hour)

export default async function Page() {
  const test = 1;
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <form className="mb-8">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="md:flex-1">
            <Label htmlFor="name">Budget Name</Label>
            <Input id="name" placeholder="e.g. Groceries" required />
          </div>
          <div className="md:flex-1">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="e.g. $250" required />
          </div>
          <Button type="submit" className="mt-6">
            Add Budget
          </Button>
        </div>
      </form>

      <Suspense fallback={<Spinner />} key={test}>
        <BudgetList />
      </Suspense>
    </div>
  );
}
