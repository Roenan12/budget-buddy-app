"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const budgetCategories = [
  "Food (Groceries, Restaurants, etc.)",
  "Transportation (Gas, Public Transit, etc.)",
  "Utilities (Bills, Internet, etc.)",
  "Entertainment (Movies, Video Games, etc.)",
  "Shopping (Clothing, Accessories, etc.)",
  "Personal Care (Haircuts, Gym, etc.",
  "Travel (Flights, Hotels, etc.)",
  "Investments (Stocks, Retirement, etc.)",
  "Other (Miscellaneous, Debt Payments, etc.)",
];

function BudgetsForm() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission logic
    console.log({ name, amount, category });
    // Reset form fields
    setName("");
    setAmount("");
    setCategory("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0">
      <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 my-5">
        <div className="flex-1">
          <Label htmlFor="name" className="md:sr-only">
            Budget Name
          </Label>
          <Input
            id="name"
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
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger id="category">
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
        <Button type="submit" size="lg" className="my-auto">
          Add Budget
        </Button>
      </div>
    </form>
  );
}

export default BudgetsForm;
