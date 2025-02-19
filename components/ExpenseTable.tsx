"use client";

import React, { useState } from "react";
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
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Expense } from "@/lib/data-service";
import { Pencil, Trash, ChevronUp, ChevronDown } from "lucide-react";

const ITEMS_PER_PAGE = 5;

function ExpenseTable({ expenses: initialExpenses }: { expenses: Expense[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

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
                <Button variant="secondary" size="icon" className="mr-2">
                  <Pencil />
                </Button>
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
                    <DropdownMenuItem>
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
