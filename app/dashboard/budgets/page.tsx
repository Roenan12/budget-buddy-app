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

// Placeholder data
const budgets = [
  { id: 1, name: "Groceries", amount: 500, spent: 300 },
  { id: 2, name: "Entertainment", amount: 200, spent: 150 },
  { id: 3, name: "Transportation", amount: 300, spent: 200 },
];

export default function Page() {
  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Budgets</h1>

      <form className="mb-8">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="name">Budget Name</Label>
            <Input id="name" required />
          </div>
          <div className="flex-1">
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" required />
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
