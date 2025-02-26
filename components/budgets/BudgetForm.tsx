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
import { createBudget } from "@/lib/actions";
import { budgetCategories } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the form validation schema
const budgetFormSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(25, "Budget name cannot exceed 25 characters")
    .trim(), // removes whitespace from both ends
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d*\.?\d*$/, "Must be a valid number"),
  category: z.string().min(1, "Category is required"),
});

type BudgetFormValues = z.infer<typeof budgetFormSchema>;

function BudgetForm() {
  const { toast } = useToast();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      name: "",
      amount: "",
      category: "",
    },
  });

  const onSubmit = async (data: BudgetFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("amount", data.amount);
    formData.append("category", data.category);

    const result = await createBudget(formData);

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
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-4 md:space-y-0"
    >
      <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 my-5">
        <div className="flex-1">
          <Label htmlFor="name">Budget Name</Label>
          <Input
            id="name"
            placeholder="e.g. Groceries"
            {...form.register("name")}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            placeholder="e.g. 1000.00"
            {...form.register("amount")}
          />
          {form.formState.errors.amount && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="category">Category</Label>
          <Select
            value={form.watch("category")}
            onValueChange={(value) => form.setValue("category", value)}
          >
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
          {form.formState.errors.category && (
            <p className="text-sm text-red-500 mt-1">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>
        <div
          className={`${
            Object.keys(form.formState.errors).length > 0
              ? "my-auto"
              : "mt-auto"
          }`}
        >
          <SubmitButton
            pendingLabel="Adding budget..."
            fullWidth
            disabled={form.formState.isSubmitting}
          >
            Add Budget
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default BudgetForm;
