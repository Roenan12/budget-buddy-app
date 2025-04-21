"use client";

import { DeleteExpense, UpdateExpenseForm } from "@/components/expenses";
import { Button } from "@/components/ui/buttons";
import { TableCell, TableRow } from "@/components/ui/data-display/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/overlay/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/dropdown-menu";
import { useToast } from "@/hooks/useToast";
import { deleteExpense } from "@/lib/actions";
import { Budget, Expense } from "@/lib/data-service";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useState, useCallback } from "react";

interface ExpenseTableRowProps {
  expense: Expense;
  budgets: Budget[];
  currencySymbol: string;
}

function ExpenseTableRow({
  expense,
  budgets,
  currencySymbol,
}: ExpenseTableRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { toast } = useToast();

  const handleDelete = useCallback(async () => {
    const result = await deleteExpense(expense.id);
    if (result.success) {
      toast({
        title: "Success!",
        variant: "success",
        description: result.message,
      });
    } else {
      toast({
        title: "Error!",
        variant: "destructive",
        description: result.message,
      });
    }
  }, [expense.id, toast]);

  const handleEditClick = () => {
    setIsDropdownOpen(false); // Close dropdown when opening dialog
    setIsDialogOpen(true);
  };

  return (
    <TableRow>
      <TableCell>{expense.name}</TableCell>
      <TableCell>
        {currencySymbol}
        {expense.amountSpent.toFixed(2)}
      </TableCell>
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
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Make changes to your expense here.
              </DialogDescription>
            </DialogHeader>
            <UpdateExpenseForm
              expense={expense}
              budgets={budgets}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        <DeleteExpense expenseId={expense.id} onDelete={handleDelete} />
      </TableCell>

      {/* Mobile Actions */}
      <TableCell className="md:hidden">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEditClick}>
              <Pencil className="h-5 w-5" />
              <span>Edit</span>
            </DropdownMenuItem>

            <DeleteExpense
              expenseId={expense.id}
              onDelete={handleDelete}
              trigger={
                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-1 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 focus:text-red-600 focus:bg-red-50">
                  <Trash className="h-5 w-5 mr-2" />
                  <span>Delete</span>
                </div>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
              <DialogDescription>
                Make changes to your expense here.
              </DialogDescription>
            </DialogHeader>
            <UpdateExpenseForm
              expense={expense}
              budgets={budgets}
              onSuccess={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
}

export default ExpenseTableRow;
