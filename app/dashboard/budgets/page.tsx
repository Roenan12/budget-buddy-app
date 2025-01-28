"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([
    { id: 1, name: "Groceries", amount: 500, spent: 300 },
    { id: 2, name: "Entertainment", amount: 200, spent: 150 },
    { id: 3, name: "Transportation", amount: 300, spent: 200 },
  ]);

  const [newBudget, setNewBudget] = useState({ name: "", amount: "" });

  const handleAddBudget = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const id = budgets.length + 1;
    setBudgets([
      ...budgets,
      {
        id,
        name: newBudget.name,
        amount: Number.parseFloat(newBudget.amount),
        spent: 0,
      },
    ]);
    setNewBudget({ name: "", amount: "" });
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <form onSubmit={handleAddBudget} className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="name">Budget Name</Label>
            <Input
              id="name"
              value={newBudget.name}
              onChange={(e) =>
                setNewBudget({ ...newBudget, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={newBudget.amount}
              onChange={(e) =>
                setNewBudget({ ...newBudget, amount: e.target.value })
              }
              required
            />
          </div>
          <Button type="submit" className="mt-6">
            Add Budget
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle>{budget.name}</CardTitle>
              <CardDescription>${budget.amount}</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(budget.spent / budget.amount) * 100}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>${budget.spent} spent</span>
                <span>${budget.amount - budget.spent} remaining</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
