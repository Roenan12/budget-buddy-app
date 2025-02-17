"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Budget } from "@/lib/data-service";
import { createExpense } from "@/lib/actions";
import SubmitButton from "./SubmitButton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExpenseFormProps {
  budgets: Budget[];
}

function ExpenseForm({ budgets }: ExpenseFormProps) {
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const { toast } = useToast();

  return (
    <form
      action={async (formData) => {
        formData.append("budgetId", selectedBudgetId);
        const result = await createExpense(formData);

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
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Existing form fields */}
        <div>
          <Label htmlFor="name">Expense Name</Label>
          <Input id="name" name="name" required />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input id="amount" name="amount" type="number" required />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" required />
        </div>
        <div>
          {/* Budget Selection */}
          <div>
            <Label htmlFor="budget">Select Budget</Label>
            <Select
              name="budget"
              value={selectedBudgetId}
              onValueChange={setSelectedBudgetId}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a budget" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id.toString()}>
                    {budget.name} ($
                    {budget.amount - (budget.expenses?.totalSpent || 0)}{" "}
                    remaining)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-1 mt-auto">
          <SubmitButton pendingLabel="Adding expense..." fullWidth>
            Add Expense
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default ExpenseForm;
