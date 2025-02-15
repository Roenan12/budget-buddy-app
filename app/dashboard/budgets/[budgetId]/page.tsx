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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

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
      <div className="max-w-3xl">
        <BackButton href="/dashboard/budgets" label="Back to Budgets" />
      </div>

      <Card className="max-w-4xl">
        <CardContent className="p-6">
          <div className="flex justify-between gap-6">
            {/* Budget details */}
            <div className="md:flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:justify-between items-center">
                <CardTitle className="text-2xl font-semibold">
                  <span className="text-muted-foreground"> Budget:</span>{" "}
                  {budget.name}
                </CardTitle>

                <div className="self-start">
                  <p className="text-sm text-muted-foreground">
                    Category:{" "}
                    <span className=" text-gray-500">{budget.category}</span>
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
            <div className="hidden md:flex flex-col w-[200px] -m-6 ml-0">
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

            {/* Mobile Actions */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/budgets/edit/${budget.id}`}
                      className="flex items-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      <span>Edit</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <TrashIcon className="h-4 w-4 mr-1" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
