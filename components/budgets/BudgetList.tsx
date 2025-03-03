"use client";

import { Budget } from "@/lib/data-service";
import { BudgetCard } from "@/components/budgets";
import { SearchBar } from "@/components/expenses";
import Pagination from "@/components/ui/data-display/Pagination";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function BudgetList({ budgets: initialBudgets }: { budgets: Budget[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const ITEMS_PER_PAGE = isMobile ? 4 : 12;

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBudgets = budgets.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <SearchBar
        onSearch={handleSearch}
        placeholder="Search budgets by name, amount, or category..."
      />

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

      {budgets.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={budgets.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default BudgetList;
