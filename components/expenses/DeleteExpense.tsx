"use client";

import { Button } from "@/components/ui/buttons";
import SpinnerMini from "@/components/ui/feedback/spinner-mini";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/overlay/alert-dialog";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";

type DeleteExpenseProps = {
  expenseId: number;
  onDelete: (expenseId: number) => void;
  trigger?: React.ReactNode;
};

function DeleteExpense({ expenseId, onDelete, trigger }: DeleteExpenseProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => onDelete(expenseId));
  }

  const defaultTrigger = (
    <Button variant="destructive" size="icon">
      {!isPending ? (
        <TrashIcon />
      ) : (
        <span className="mx-auto">
          <SpinnerMini />
        </span>
      )}
    </Button>
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            expense.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteExpense;
