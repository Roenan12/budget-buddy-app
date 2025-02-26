import { getRecentExpenses } from "@/lib/data-service";
import Link from "next/link";

async function RecentExpenses({ userId }: { userId: number }) {
  const expenses = await getRecentExpenses(userId);

  return (
    <div className="space-y-1 w-full max-h-[450px] overflow-y-auto pr-2">
      {expenses.map((expense) => (
        <Link
          key={expense.id}
          href={`/dashboard/expenses`}
          className="flex items-center justify-between w-full p-4 rounded-lg bg-card hover:bg-accent transition-colors space-x-2"
        >
          <div className="flex items-center space-x-4 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-none truncate">
                {expense.name}
              </p>
              <p className="text-xs text-muted-foreground">{expense.date}</p>
            </div>
          </div>
          <div className="font-medium text-sm whitespace-nowrap">
            ${expense.amountSpent.toFixed(2)}
          </div>
        </Link>
      ))}
    </div>
  );
}

export default RecentExpenses;
