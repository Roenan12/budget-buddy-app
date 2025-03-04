import { createContext, useContext, useState, ReactNode } from "react";

interface PaginationContextType {
  currentPage: number;
  itemsPerPage: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
}

const PaginationContext = createContext<PaginationContextType | undefined>(
  undefined
);

interface PaginationProviderProps {
  children: ReactNode;
  initialItemsPerPage: number;
}

export function PaginationProvider({
  children,
  initialItemsPerPage,
}: PaginationProviderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  return (
    <PaginationContext.Provider
      value={{
        currentPage,
        itemsPerPage,
        setCurrentPage,
        setItemsPerPage,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
}

export function usePagination() {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error("usePagination must be used within a PaginationProvider");
  }
  return context;
}
