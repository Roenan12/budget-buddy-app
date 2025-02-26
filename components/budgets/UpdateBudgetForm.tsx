"use client";

import { CancelButton, SubmitButton } from "@/components/ui/buttons";
import { Card } from "@/components/ui/data-display/card";
import { Input } from "@/components/ui/forms/input";
import { Label } from "@/components/ui/forms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/forms/select";
import { useToast } from "@/hooks/use-toast";
import { updateBudget } from "@/lib/actions";
import { budgetCategories } from "@/lib/constants";
import { Budget } from "@/lib/data-service";
import { useRouter } from "next/navigation";

type UpdateBudgetFormProps = {
  budgetId: number;
  budget: Budget;
};

function UpdateBudgetForm({ budgetId, budget }: UpdateBudgetFormProps) {
  const { name, amount, category } = budget;
  const { toast } = useToast();
  const router = useRouter();

  return (
    <>
      <h1 className="text-2xl font-bold mb-4"> Edit Budget: {name}</h1>
      <Card className="max-w-3xl">
        <form
          action={async (formData) => {
            const result = await updateBudget(formData);

            if (result.success) {
              // success toast
              toast({
                title: "Success!",
                variant: "success",
                description: result.message,
              });
              // redirect to budget details
              router.push(`/dashboard/budgets/${budgetId}`);
            } else {
              // error toast
              toast({
                title: "Error!",
                variant: "destructive",
                description: result.message,
              });
            }
          }}
          className="space-y-4 md:space-y-0"
        >
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
    </>
  );
}

export default UpdateBudgetForm;
