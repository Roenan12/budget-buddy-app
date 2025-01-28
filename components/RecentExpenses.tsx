import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const expenses = [
  { id: 1, name: "Groceries", amount: 75.5, date: "2023-06-15" },
  { id: 2, name: "Gas", amount: 45.0, date: "2023-06-14" },
  { id: 3, name: "Dinner", amount: 60.25, date: "2023-06-13" },
  { id: 4, name: "Movie tickets", amount: 30.0, date: "2023-06-12" },
  { id: 5, name: "Online shopping", amount: 120.75, date: "2023-06-11" },
];

export function RecentExpenses() {
  return (
    <div className="space-y-4 w-full">
      {expenses.map((expense) => (
        <Link
          key={expense.id}
          href={`/dashboard/expenses/${expense.id}`}
          className="flex items-center justify-between w-full p-4 rounded-lg bg-card hover:bg-accent transition-colors space-x-2"
        >
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarFallback>{expense.name[0]}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-none truncate">
                {expense.name}
              </p>
              <p className="text-xs text-muted-foreground">{expense.date}</p>
            </div>
          </div>
          <div className="font-medium text-sm whitespace-nowrap">
            ${expense.amount.toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  );
}
