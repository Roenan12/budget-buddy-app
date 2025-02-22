import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Budget, Expense } from "@/lib/data-service";
import UpdateExpenseForm from "./UpdateExpenseForm";
import { deleteExpense } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import DeleteExpense from "./DeleteExpense";

interface ExpenseTableRowProps {
  expense: Expense;
  budgets: Budget[];
}

function ExpenseTableRow({ expense, budgets }: ExpenseTableRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { toast } = useToast();

  async function handleDelete(expenseId: number) {
    const result = await deleteExpense(expenseId);
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
  }

  return (
    <TableRow>
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
              onClick={() => setIsDialogOpen(true)}
            >
              <Pencil />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              <Pencil className="h-5 w-5" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash className="h-5 w-5" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default ExpenseTableRow;
