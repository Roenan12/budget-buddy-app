"use client";

import { Budget } from "@/lib/data-service";
import { BudgetCard } from "@/components/budgets";
import { SearchBar } from "@/components/expenses";
import Pagination from "@/components/ui/data-display/Pagination";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  PaginationProvider,
  usePagination,
} from "@/contexts/PaginationContext";

function BudgetList({ budgets: initialBudgets }: { budgets: Budget[] }) {
  const isMobile = useIsMobile();
  const initialItemsPerPage = isMobile ? 4 : 8;

  return (
    <PaginationProvider initialItemsPerPage={initialItemsPerPage}>
      <BudgetListContent budgets={initialBudgets} />
    </PaginationProvider>
  );
}

function BudgetListContent({ budgets: initialBudgets }: { budgets: Budget[] }) {
  const { currentPage, itemsPerPage, setCurrentPage, setItemsPerPage } =
    usePagination();
  const isMobile = useIsMobile();
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle search and filtering
  useEffect(() => {
    const filtered = initialBudgets.filter((budget) => {
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
    setBudgets(filtered);
    setCurrentPage(1);
  }, [initialBudgets, searchQuery]);

  // Reset page when screen size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);

  // handle mobile pagination
  useEffect(() => {
    setItemsPerPage(isMobile ? 4 : 8);
    setCurrentPage(1);
  }, [isMobile, setItemsPerPage, setCurrentPage]);

  // search for budgets
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBudgets = budgets.slice(startIndex, endIndex);

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search budgets by name, amount, or category..."
      />

      {budgets.length === 0 ? (
        <div className="text-center py-4">No budgets found</div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentBudgets.map((budget) => (
              <BudgetCard key={budget.id} budget={budget} />
            ))}
          </div>

          {currentBudgets.length === 0 && (
            <p className="text-center text-gray-500 my-8">
              No budgets found matching your search.
            </p>
          )}

          <Pagination
            currentPage={currentPage}
            totalItems={budgets.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            pageSizeOptions={[4, 8, 12]}
          />
        </div>
      )}
    </div>
  );
}

export default BudgetList;
