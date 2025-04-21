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
import { useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({ field: "", direction: "asc" });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    setSortConfig((prevConfig) => ({
      field,
      direction:
        prevConfig.field === field && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // memoize for expensive filtering operation
  const filteredExpenses = useMemo(() => {
    return initialExpenses.filter((expense) => {
      const searchLower = searchQuery.toLowerCase();
      const budget = budgets.find((b) => b.id === expense.budgets.id);
      return (
        expense.name.toLowerCase().includes(searchLower) ||
        expense.amountSpent.toString().includes(searchLower) ||
        expense.date.includes(searchLower) ||
        budget?.name.toLowerCase().includes(searchLower)
      );
    });
  }, [initialExpenses, searchQuery, budgets]);

  // memoize for expensive sorting operation
  const sortedExpenses = useMemo(() => {
    if (!sortConfig.field) return filteredExpenses;

    return [...filteredExpenses].sort((a, b) => {
      if (sortConfig.field === "budget") {
        const budgetA =
          budgets.find((budget) => budget.id === a.budgets.id)?.name || "";
        const budgetB =
          budgets.find((budget) => budget.id === b.budgets.id)?.name || "";
        return sortConfig.direction === "asc"
          ? budgetA.localeCompare(budgetB)
          : budgetB.localeCompare(budgetA);
      }

      const aValue = a[sortConfig.field as keyof Expense];
      const bValue = b[sortConfig.field as keyof Expense];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });
  }, [filteredExpenses, sortConfig, budgets]);

  // Simple slice operation, no need for memoization
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = sortedExpenses.slice(startIndex, endIndex);

  const SortIcon = ({ field }: { field: string }) => {
    if (sortConfig.field !== field) return null;
    return sortConfig.direction === "asc" ? (
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

      {sortedExpenses.length === 0 ? (
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
            totalItems={sortedExpenses.length}
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
