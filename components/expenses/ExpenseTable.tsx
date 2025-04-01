"use client";

import { ExpenseTableRow, SearchBar } from "@/components/expenses";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-display/table";
import { Budget, Expense } from "@/lib/data-service";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import Pagination from "@/components/ui/data-display/Pagination";
import {
  PaginationProvider,
  usePagination,
} from "@/contexts/PaginationContext";

interface ExpenseTableProps {
  expenses: Expense[];
  budgets: Budget[];
  currencySymbol: string;
}

function ExpenseTable({
  expenses: initialExpenses,
  budgets,
  currencySymbol,
}: ExpenseTableProps) {
  return (
    <PaginationProvider initialItemsPerPage={5}>
      <ExpenseTableContent
        expenses={initialExpenses}
        budgets={budgets}
        currencySymbol={currencySymbol}
      />
    </PaginationProvider>
  );
}

interface ExpenseTableContentProps {
  expenses: Expense[];
  budgets: Budget[];
  currencySymbol: string;
}

function ExpenseTableContent({
  expenses: initialExpenses,
  budgets,
  currencySymbol,
}: ExpenseTableContentProps) {
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [searchQuery, setSearchQuery] = useState("");

  // Update useEffect to handle both initial expenses and search filtering
  useEffect(() => {
    const filtered = initialExpenses.filter((expense) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        expense.name.toLowerCase().includes(searchLower) ||
        expense.amountSpent.toString().includes(searchLower) ||
        expense.date.toLowerCase().includes(searchLower) ||
        expense.budgets.budgetName.toLowerCase().includes(searchLower)
      );
    });
    setExpenses(filtered);
  }, [initialExpenses, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
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
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search expenses by name, amount, date, or budget..."
      />

      {expenses.length === 0 ? (
        <div className="text-center py-4">No expenses found</div>
      ) : (
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
                <ExpenseTableRow
                  key={expense.id}
                  expense={expense}
                  budgets={budgets}
                  currencySymbol={currencySymbol}
                />
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalItems={expenses.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[5, 10, 15, 20]}
          />
        </div>
      )}
    </div>
  );
}

export default ExpenseTable;
