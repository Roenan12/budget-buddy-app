import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "./SubmitButton";
import { updateExpense } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Budget, Expense } from "@/lib/data-service";

interface UpdateExpenseFormProps {
  expense: Expense;
  budgets: Budget[];
  onSuccess: () => void;
}

function UpdateExpenseForm({
  expense,
  budgets,
  onSuccess,
}: UpdateExpenseFormProps) {
  const [selectedBudgetId, setSelectedBudgetId] = useState(
    expense.budgets.id.toString()
  );
  const { toast } = useToast();

  return (
    <form
      action={async (formData) => {
        formData.append("budgetId", selectedBudgetId);
        const result = await updateExpense(formData);

        if (result.success) {
          toast({
            title: "Success!",
            variant: "success",
            description: result.message,
          });
          onSuccess();
        } else {
          toast({
            title: "Error!",
            variant: "destructive",
            description: result.message,
          });
        }
      }}
    >
      <Input type="hidden" name="expenseId" value={expense.id} />
      <Label>Name</Label>
      <Input type="text" name="name" defaultValue={expense.name} />
      <Label>Amount</Label>
      <Input
        type="number"
        name="amountSpent"
        defaultValue={expense.amountSpent}
      />
      <Label>Date</Label>
      <Input type="date" name="date" defaultValue={expense.date} />
      <Label htmlFor="budget">Budget</Label>
      <Select
        name="budgetId"
        defaultValue={expense.budgets.id.toString()}
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
              {budget.amount - (budget.expenses?.totalSpent || 0)} remaining)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-4">
        <SubmitButton pendingLabel="Updating expense..." fullWidth>
          Update expense
        </SubmitButton>
      </div>
    </form>
  );
}

export default UpdateExpenseForm;
