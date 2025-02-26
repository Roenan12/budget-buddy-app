"use client";

import { SubmitButton } from "@/components/ui/buttons";
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
import { createExpense } from "@/lib/actions";
import { Budget } from "@/lib/data-service";
import { useState } from "react";

interface ExpenseFormProps {
  budgets: Budget[];
}

function ExpenseForm({ budgets }: ExpenseFormProps) {
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [name, setName] = useState("");
  const [amountSpent, setAmountSpent] = useState("");
  const [date, setDate] = useState("");
  const { toast } = useToast();

  const resetForm = () => {
    setName("");
    setAmountSpent("");
    setDate("");
    setSelectedBudgetId("");
  };

  return (
    <form
      action={async (formData) => {
        formData.append("budgetId", selectedBudgetId);
        const result = await createExpense(formData);

        if (result.success) {
          // success toast
          toast({
            title: "Success!",
            variant: "success",
            description: result.message,
          });
          resetForm();
          // error toast
        } else {
          toast({
            title: "Error!",
            variant: "destructive",
            description: result.message,
          });
        }
      }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
        {/* Existing form fields */}
        <div>
          <Label htmlFor="name">Expense Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. clothes"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amountSpent"
            name="amountSpent"
            placeholder="e.g. 100.50"
            value={amountSpent}
            onChange={(e) => setAmountSpent(e.target.value)}
            type="number"
            required
          />
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            type="date"
            required
          />
        </div>
        <div>
          {/* Budget Selection */}
          <div>
            <Label htmlFor="budget">Budget</Label>
            <Select
              name="budgetId"
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
        <div className="sm:col-span-2 lg:col-span-1 mt-auto">
          <SubmitButton pendingLabel="Adding expense..." fullWidth>
            Add Expense
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default ExpenseForm;
