"use client";

import { Budget } from "@/lib/data-service";
import { BudgetCard } from "@/components/budgets";
import { SearchBar } from "@/components/expenses";
import Pagination from "@/components/ui/data-display/Pagination";
import { useState, useEffect, useMemo } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import {
  PaginationProvider,
  usePagination,
} from "@/contexts/PaginationContext";

interface BudgetListProps {
  budgets: Budget[];
  currencySymbol: string;
}

function BudgetList({
  budgets: initialBudgets,
  currencySymbol,
}: BudgetListProps) {
  const isMobile = useIsMobile();
  const initialItemsPerPage = isMobile ? 4 : 8;

  return (
    <PaginationProvider initialItemsPerPage={initialItemsPerPage}>
      <BudgetListContent
        budgets={initialBudgets}
        currencySymbol={currencySymbol}
      />
    </PaginationProvider>
  );
}

interface BudgetListContentProps {
  budgets: Budget[];
  currencySymbol: string;
}

function BudgetListContent({
  budgets: initialBudgets,
  currencySymbol,
}: BudgetListContentProps) {
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // memoize for expensive filtering operation
  const filteredBudgets = useMemo(() => {
    return initialBudgets.filter((budget) => {
      const searchLower = searchQuery.toLowerCase();
      const amountSpent = budget.expenses?.totalSpent.toString();
      const remainingAmount = (
        budget.amount - budget.expenses?.totalSpent
      ).toString();

      return (
        budget.name.toLowerCase().includes(searchLower) ||
        budget.amount.toString().includes(searchLower) ||
        budget.category.toLowerCase().includes(searchLower) ||
        amountSpent.includes(searchLower) ||
        remainingAmount.includes(searchLower)
      );
    });
  }, [initialBudgets, searchQuery]);

  // Reset page when screen size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile, setCurrentPage]);

  // handle mobile pagination
  useEffect(() => {
    setItemsPerPage(isMobile ? 4 : 8);
    setCurrentPage(1);
  }, [isMobile, setItemsPerPage, setCurrentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBudgets = filteredBudgets.slice(startIndex, endIndex);

  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search budgets by name, amount, or category..."
      />

      {filteredBudgets.length === 0 ? (
        <div className="text-center py-4">No budgets found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentBudgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredBudgets.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[4, 8, 12]}
          />
        </>
      )}
    </>
  );
}

export default BudgetList;
