import SubmitButton from "@/components/SubmitButton";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateBudget } from "@/lib/actions";
import { budgetCategories } from "@/lib/constants";
import { getBudget } from "@/lib/data-service";
import CancelButton from "@/components/CancelButton";

type Params = {
  budgetId: number;
};

async function Page({ params }: { params: Params }) {
  const { budgetId } = params;

  const budget = await getBudget(budgetId);
  if (!budget) throw new Error("Budget not found");
  const { name, amount, category } = budget;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4"> Edit Budget: {name}</h1>
      <Card className="max-w-3xl">
        <form action={updateBudget} className="space-y-4 md:space-y-0">
          <div className="flex items-start flex-col gap-4 my-5 px-10">
            <div>
              <input type="hidden" value={budgetId} name="budgetId" />
            </div>
            <div className="w-full">
              <Label htmlFor="name" className="md:sr-only">
                Budget Name
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Budget Name"
                defaultValue={name}
                required
              />
            </div>
            <div className="w-full">
              <Label htmlFor="amount" className="md:sr-only">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Amount"
                defaultValue={amount}
                required
              />
            </div>
            <div className="w-full">
              <Label htmlFor="category" className="md:sr-only">
                Category
              </Label>
              <Select
                name="category"
                defaultValue={
                  budgetCategories.find((ctg) => ctg.startsWith(category)) ||
                  undefined
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map((ctg) => (
                    <SelectItem key={ctg} value={ctg}>
                      {ctg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-end justify-end gap-4 pr-10 py-5">
            <CancelButton href={`/dashboard/budgets/${budgetId}`} />
            <SubmitButton pendingLabel="Updating budget...">
              Edit Budget
            </SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Page;
