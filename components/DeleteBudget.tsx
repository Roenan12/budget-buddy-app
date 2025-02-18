"use client";

import { useTransition } from "react";
import SpinnerMini from "@/components/ui/spinner-mini";
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
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";

type DeleteBudgetProps = {
  budgetId: number;
  onDelete: (budgetId: number) => void;
};

function DeleteBudget({ budgetId, onDelete }: DeleteBudgetProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(() => onDelete(budgetId));
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-start md:justify-center w-full md:rounded-none text-red-600 hover:text-red-700 hover:bg-red-50 h-9 rounded-sm px-3 md:h-1/2 "
        >
          {!isPending ? (
            <>
              <TrashIcon className="h-4 w-4 mr-1" />
              <span>Delete</span>
            </>
          ) : (
            <span className="mx-auto">
              <SpinnerMini />
            </span>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            budget.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            {isPending ? <SpinnerMini /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteBudget;
