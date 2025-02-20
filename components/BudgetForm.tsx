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
import { useState } from "react";

function BudgetsForm() {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const resetForm = () => {
    setName("");
    setAmount("");
    setCategory("");
  };

  return (
    <form
      action={async (formData) => {
        const result = await createBudget(formData);

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
      className="space-y-4 md:space-y-0"
    >
      <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 my-5">
        <div className="flex-1">
          <Label htmlFor="name">Budget Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Groceries"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            placeholder="e.g. 1000.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={category}
            onValueChange={setCategory}
            required
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
        </div>
        <div className="mt-auto">
          <SubmitButton pendingLabel="Adding budget..." fullWidth>
            Add Budget
          </SubmitButton>
        </div>
      </div>
    </form>
  );
}

export default BudgetsForm;
