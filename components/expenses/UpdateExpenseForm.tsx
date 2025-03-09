"use client";

import { SubmitButton } from "@/components/ui/buttons";
import { Input } from "@/components/ui/form/input";
import { Label } from "@/components/ui/form/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form/select";
import { useToast } from "@/hooks/use-toast";
import { updateExpense } from "@/lib/actions";
import { Budget, Expense } from "@/lib/data-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the form validation schema
const createUpdateExpenseFormSchema = (
  budgets: Budget[],
  originalExpense: Expense
) =>
  z
    .object({
      name: z
        .string()
        .min(1, "Expense name is required")
        .max(25, "Expense name cannot exceed 25 characters")
        .trim(),
      amountSpent: z
        .string()
        .min(1, "Amount is required")
        .regex(/^\d*\.?\d*$/, "Must be a valid number"),
      date: z.string().min(1, "Date is required"),
      budgetId: z.string().min(1, "Budget is required"),
    })
    .refine(
      (data) => {
        if (!data.budgetId || !data.amountSpent) return true;

        const selectedBudget = budgets.find(
          (budget) => budget.id.toString() === data.budgetId
        );
        if (!selectedBudget) return true;

        // Add back the original expense amount if we're updating the same budget
        const adjustedTotalSpent =
          (selectedBudget.expenses?.totalSpent || 0) -
          (data.budgetId === originalExpense.budgets.id.toString()
            ? originalExpense.amountSpent
            : 0);

        const remainingAmount = selectedBudget.amount - adjustedTotalSpent;
        return Number(data.amountSpent) <= remainingAmount;
      },
      {
        message: "Amount cannot exceed remaining budget",
        path: ["amountSpent"],
      }
    );

type UpdateExpenseFormValues = z.infer<
  ReturnType<typeof createUpdateExpenseFormSchema>
>;

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
  const { toast } = useToast();
  const form = useForm<UpdateExpenseFormValues>({
    resolver: zodResolver(createUpdateExpenseFormSchema(budgets, expense)),
    defaultValues: {
      name: expense.name,
      amountSpent: expense.amountSpent.toString(),
      date: expense.date,
      budgetId: expense.budgets.id.toString(),
    },
  });

  const onSubmit = async (data: UpdateExpenseFormValues) => {
    const formData = new FormData();
    formData.append("expenseId", expense.id.toString());
    formData.append("name", data.name);
    formData.append("amountSpent", data.amountSpent);
    formData.append("date", data.date);
    formData.append("budgetId", data.budgetId);

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
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label>Amount</Label>
          <Input {...form.register("amountSpent")} />
          {form.formState.errors.amountSpent && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.amountSpent.message}
            </p>
          )}
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" {...form.register("date")} />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select
            name="budgetId"
            defaultValue={expense.budgets.id.toString()}
            onValueChange={(value) => form.setValue("budgetId", value)}
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
          {form.formState.errors.budgetId && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.budgetId.message}
            </p>
          )}
        </div>
        <div
          className={`${
            Object.keys(form.formState.errors).length > 0 ? "my-auto" : "mt-4"
          }`}
        >
          <SubmitButton
            pendingLabel="Updating expense..."
            fullWidth
            disabled={form.formState.isSubmitting}
            isSubmitting={form.formState.isSubmitting}
          >
            Update expense
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default UpdateExpenseForm;
