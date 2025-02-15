import { auth } from "@/lib/auth";
import { Budget, getBudget } from "@/lib/data-service";
import { PencilIcon, TrashIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BackButton } from "@/components/BackButton";

type Params = {
  params: {
    budgetId: string;
  };
};

export async function generateMetadata({ params }: Params) {
  const budget = await getBudget(Number(params.budgetId));

  if (!budget) {
    throw new Error("Budget not found");
  }

  const { name } = budget;
  return { title: `Budget ${name}` };
}

export default async function Page({ params }: Params) {
  const session = await auth();
  if (!session?.user?.userId) {
    throw new Error("User not authenticated");
  }

  const budget: Budget | null = await getBudget(Number(params.budgetId));

  if (!budget) {
    throw new Error("Failed to load budget details");
  }

  const amountSpent = budget.expenses?.totalSpent || 0;
  const remaining = budget.amount - amountSpent;

  return (
    <div className="w-full p-4">
      <BackButton href="/dashboard/budgets" label="Back to Budgets" />

      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6">
          <div className="flex justify-between items-stretch gap-6">
            {/* Budget details */}
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold">
                  <span className="text-muted-foreground"> Budget:</span>{" "}
                  {budget.name}
                </CardTitle>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Category:{" "}
                    <span className="text-gray-500">{budget.category}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date:
                    <span className="text-gray-500">
                      {" "}
                      {formatDate(budget.created_at)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <div>
                  <CardDescription className="text-lg ">
                    Amount:{" "}
                    <span className="text-black dark:text-white">
                      ${budget.amount.toFixed(2)}
                    </span>
                  </CardDescription>
                </div>
                <div>
                  <CardDescription className="text-lg ">
                    Spent:{" "}
                    <span className="text-lg font-semibold text-red-600">
                      ${amountSpent.toFixed(2)}
                    </span>
                  </CardDescription>
                </div>
                <div>
                  <CardDescription className="text-lg ">
                    Remaining:{" "}
                    <span className="text-lg font-semibold text-green-600">
                      ${remaining.toFixed(2)}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col w-[200px] -m-6 ml-0">
              <Button
                asChild
                variant="outline"
                className="w-full h-1/2 justify-center gap-2 rounded-none border-b"
              >
                <Link href={`/dashboard/budgets/edit/${budget.id}`}>
                  <PencilIcon className="h-5 w-5" />
                  <span>Edit</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                className="w-full h-1/2 justify-center gap-2 rounded-none text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
