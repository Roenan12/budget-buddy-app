"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Budget, Expense } from "@/lib/data-service";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SubmitButton from "./SubmitButton";
import { updateExpense } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const ITEMS_PER_PAGE = 5;

function ExpenseTable({
  expenses: initialExpenses,
  budgets: budgets,
}: {
  expenses: Expense[];
  budgets: Budget[];
}) {
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const { toast } = useToast();

  // ensure the state is not stale by setting the expenses to the latest value
  useEffect(() => {
    setExpenses(initialExpenses);
  }, [initialExpenses]); // Sync the state when `initialExpenses` changes

  // Sorting function
  const handleSort = (field: string) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newDirection);
    setSortField(field);

    const sortedExpenses = [...expenses].sort((a, b) => {
      if (field === "amountSpent") {
        return newDirection === "asc"
          ? a[field] - b[field]
          : b[field] - a[field];
      }
      if (field === "date") {
        return newDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      if (field === "budget") {
        return newDirection === "asc"
          ? a.budgets.budgetName.localeCompare(b.budgets.budgetName)
          : b.budgets.budgetName.localeCompare(a.budgets.budgetName);
      }
      if (field === "name") {
        return newDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      return 0;
    });

    setExpenses(sortedExpenses);
  };

  // Pagination calculations
  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentExpenses = expenses.slice(startIndex, endIndex);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="inline w-4 h-4" />
    ) : (
      <ChevronDown className="inline w-4 h-4" />
    );
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Name <SortIcon field="name" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("amountSpent")}
              className="cursor-pointer"
            >
              Amount <SortIcon field="amountSpent" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("date")}
              className="cursor-pointer"
            >
              Date <SortIcon field="date" />
            </TableHead>
            <TableHead
              onClick={() => handleSort("budget")}
              className="cursor-pointer text-center"
            >
              Budget <SortIcon field="budget" />
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.name}</TableCell>
              <TableCell>${expense.amountSpent.toFixed(2)}</TableCell>
              <TableCell>{expense.date}</TableCell>
              <TableCell className="text-center">
                {expense.budgets.budgetName}
              </TableCell>
              <TableCell className="hidden md:flex justify-center items-center">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogOverlay />
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="mr-2"
                      onClick={() => {
                        setSelectedExpense(expense);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    <form
                      action={async (formData) => {
                        formData.append("budgetId", selectedBudgetId);
                        const result = await updateExpense(formData);

                        if (result.success) {
                          // success toast
                          toast({
                            title: "Success!",
                            variant: "success",
                            description: result.message,
                          });
                          setIsDialogOpen(false);
                        } else {
                          // error toast
                          toast({
                            title: "Error!",
                            variant: "destructive",
                            description: result.message,
                          });
                        }
                      }}
                      className="space-y-4"
                    >
                      {/* Hidden input to store the selected expense ID */}
                      <Input
                        type="hidden"
                        name="expenseId"
                        value={selectedExpense?.id || ""}
                      />
                      <Label>Name</Label>
                      <Input
                        type="text"
                        name="name"
                        defaultValue={selectedExpense?.name || ""}
                      />
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        name="amountSpent"
                        defaultValue={selectedExpense?.amountSpent || 0}
                      />
                      <Label>Date</Label>
                      <Input
                        type="date"
                        name="date"
                        defaultValue={selectedExpense?.date || ""}
                      />
                      <Label htmlFor="budget">Budget</Label>
                      <Select
                        name="budgetId"
                        defaultValue={
                          selectedExpense?.budgets.id.toString() || ""
                        }
                        onValueChange={setSelectedBudgetId}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a budget" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgets.map((budget) => (
                            <SelectItem
                              key={budget.id}
                              value={budget.id.toString()}
                            >
                              {budget.name} ($
                              {budget.amount -
                                (budget.expenses?.totalSpent || 0)}{" "}
                              remaining)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <SubmitButton
                        pendingLabel="Updating expense..."
                        fullWidth
                      >
                        Update expense
                      </SubmitButton>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="icon">
                  <Trash />
                </Button>
              </TableCell>

              {/* Mobile Actions */}
              <TableCell className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedExpense(expense);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-5 w-5" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className=" text-red-600 focus:text-red-600 focus:bg-red-50">
                      <Trash className="h-5 w-5" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-500">
          Showing {startIndex + 1}-{Math.min(endIndex, expenses.length)} of{" "}
          {expenses.length} results
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTable;
