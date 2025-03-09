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
import { createExpense } from "@/lib/actions";
import { Budget } from "@/lib/data-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Move the schema creation into a function that takes budgets as a parameter
const createExpenseFormSchema = (budgets: Budget[]) =>
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
        // Skip validation if no budget is selected or amount is invalid
        if (!data.budgetId || !data.amountSpent) return true;

        const selectedBudget = budgets.find(
          (budget) => budget.id.toString() === data.budgetId
        );
        if (!selectedBudget) return true;

        const remainingAmount =
          selectedBudget.amount - (selectedBudget.expenses?.totalSpent || 0);
        return Number(data.amountSpent) <= remainingAmount;
      },
      {
        message: "Amount cannot exceed remaining budget",
        path: ["amountSpent"],
      }
    );

type ExpenseFormValues = z.infer<ReturnType<typeof createExpenseFormSchema>>;

interface ExpenseFormProps {
  budgets: Budget[];
}

function ExpenseForm({ budgets }: ExpenseFormProps) {
  const { toast } = useToast();
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(createExpenseFormSchema(budgets)),
    defaultValues: {
      name: "",
      amountSpent: "",
      date: "",
      budgetId: "",
    },
  });

  const onSubmit = async (data: ExpenseFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amountSpent", data.amountSpent);
    formData.append("date", data.date);
    formData.append("budgetId", data.budgetId);

    const result = await createExpense(formData);

    if (result.success) {
      toast({
        title: "Success!",
        variant: "success",
        description: result.message,
      });
      form.reset();
    } else {
      toast({
        title: "Error!",
        variant: "destructive",
        description: result.message,
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-4">
        <div>
          <Label htmlFor="name">Expense Name</Label>
          <Input
            id="name"
            placeholder="e.g. clothes"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="amountSpent">Amount</Label>
          <Input
            id="amountSpent"
            placeholder="e.g. 100.50"
            {...form.register("amountSpent")}
          />
          {form.formState.errors.amountSpent && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.amountSpent.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" {...form.register("date")} />
          {form.formState.errors.date && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.date.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Select
            value={form.watch("budgetId")}
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
          className={`sm:col-span-2 lg:col-span-1 ${
            Object.keys(form.formState.errors).length > 0
              ? "my-auto"
              : "mt-auto"
          }`}
        >
          <SubmitButton
            pendingLabel="Adding expense..."
            fullWidth
            disabled={form.formState.isSubmitting}
            isSubmitting={form.formState.isSubmitting}
          >
            Add Expense
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default ExpenseForm;
