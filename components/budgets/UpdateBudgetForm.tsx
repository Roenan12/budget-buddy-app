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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the form validation schema
const updateBudgetFormSchema = z.object({
  name: z
    .string()
    .min(1, "Budget name is required")
    .max(25, "Budget name cannot exceed 25 characters")
    .trim(),
  amount: z
    .string()
    .min(1, "Amount is required")
    .regex(/^\d*\.?\d*$/, "Must be a valid number"),
  category: z.string().min(1, "Category is required"),
});

type UpdateBudgetFormValues = z.infer<typeof updateBudgetFormSchema>;

type UpdateBudgetFormProps = {
  budgetId: number;
  budget: Budget;
};

function UpdateBudgetForm({ budgetId, budget }: UpdateBudgetFormProps) {
  const { name, amount, category } = budget;
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<UpdateBudgetFormValues>({
    resolver: zodResolver(updateBudgetFormSchema),
    defaultValues: {
      name: name,
      amount: amount.toString(),
      category:
        budgetCategories.find((ctg) => ctg.startsWith(category)) || category,
    },
  });

  const onSubmit = async (data: UpdateBudgetFormValues) => {
    const formData = new FormData();
    formData.append("budgetId", budgetId.toString());
    formData.append("name", data.name);
    formData.append("amount", data.amount);
    formData.append("category", data.category);

    const result = await updateBudget(formData);

    if (result.success) {
      toast({
        title: "Success!",
        variant: "success",
        description: result.message,
      });
      router.push(`/dashboard/budgets/${budgetId}`);
    } else {
      toast({
        title: "Error!",
        variant: "destructive",
        description: result.message,
      });
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Edit Budget: {name}</h1>
      <Card className="max-w-3xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 md:space-y-0"
        >
          <div className="flex items-start flex-col gap-4 my-5 px-10">
            <div className="w-full">
              <Label htmlFor="name">Budget Name</Label>
              <Input
                id="name"
                placeholder="Budget Name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                placeholder="Amount"
                {...form.register("amount")}
              />
              {form.formState.errors.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.amount.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <Label htmlFor="category">Category</Label>
              <Select
                name="category"
                defaultValue={
                  budgetCategories.find((ctg) => ctg.startsWith(category)) ||
                  undefined
                }
                onValueChange={(value) => form.setValue("category", value)}
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
              {form.formState.errors.category && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.category.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-end justify-end gap-4 pr-10 py-5">
            <CancelButton href={`/dashboard/budgets/${budgetId}`} />
            <SubmitButton
              pendingLabel="Updating budget..."
              disabled={form.formState.isSubmitting}
            >
              Edit Budget
            </SubmitButton>
          </div>
        </form>
      </Card>
    </>
  );
}

export default UpdateBudgetForm;
