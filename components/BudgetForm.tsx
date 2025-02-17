"use client";

import { budgetCategories } from "@/lib/constants";
import { createBudget } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "@/components/SubmitButton";

function BudgetsForm() {
  const { toast } = useToast();

  return (
    <form
      action={async (formData) => {
        const result = await createBudget(formData);

        if (result.success)
          // success toast
          toast({
            title: "Success!",
            variant: "success",
            description: result.message,
          });
        // error toast
        else
          toast({
            title: "Error!",
            variant: "destructive",
            description: result.message,
          });
      }}
      className="space-y-4 md:space-y-0"
    >
      <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 my-5">
        <div className="flex-1">
          <Label htmlFor="name" className="md:sr-only">
            Budget Name
          </Label>
          <Input id="name" name="name" placeholder="Budget Name" required />
        </div>
        <div className="flex-1">
          <Label htmlFor="amount" className="md:sr-only">
            Amount
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="Amount"
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="category" className="md:sr-only">
            Category
          </Label>
          <Select name="category" required>
            <SelectTrigger>
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
        <SubmitButton pendingLabel="Adding budget...">Add Budget</SubmitButton>
      </div>
    </form>
  );
}

export default BudgetsForm;
