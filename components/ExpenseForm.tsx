"use client";

import React, { useState } from "react";
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
import { Budget } from "@/lib/data-service";
import { createExpense } from "@/lib/actions";
import SubmitButton from "./SubmitButton";

interface ExpenseFormProps {
  budgets: Budget[];
}

function ExpenseForm({ budgets }: ExpenseFormProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState("");

  const resetForm = () => {
    setName("");
    setAmount("");
    setDate("");
    setSelectedBudgetId("");
  };

  return (
    <form
      action={async (formData) => {
        formData.append("budgetId", selectedBudgetId);
        await createExpense(formData);
        resetForm();
      }}
      className="mb-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Existing form fields */}
        <div>
          <Label htmlFor="name">Expense Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
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
