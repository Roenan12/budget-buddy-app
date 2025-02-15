"use client";

import { useState } from "react";
import SubmitButton from "@/components/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createBudget } from "@/lib/actions";
import { budgetCategories } from "@/lib/constants";

function BudgetsForm() {
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
        await createBudget(formData);
        resetForm();
      }}
      className="space-y-4 md:space-y-0"
    >
      <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 my-5">
        <div className="flex-1">
          <Label htmlFor="name" className="md:sr-only">
            Budget Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Budget Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="category" className="md:sr-only">
            Category
          </Label>
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
        <SubmitButton pendingLabel="Adding budget...">Add Budget</SubmitButton>
      </div>
    </form>
  );
}

export default BudgetsForm;
