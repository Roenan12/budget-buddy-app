"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Currency } from "@/lib/data-service";
import {
  updateUserCurrencyAction,
  getUserCurrencyAction,
  getCurrenciesAction,
} from "@/lib/actions";
import { toast } from "@/hooks/useToast";

type CurrencyContextType = {
  currency: string;
  setCurrency: (currency: string) => void;
  currencies: Currency[];
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load all available currencies
    const loadCurrencies = async () => {
      try {
        const result = await getCurrenciesAction();
        if (result.success) {
          setCurrencies(result.currencies);
        } else {
          console.error("Failed to load currencies:", result.message);
        }
      } catch (error) {
        console.error("Failed to load currencies:", error);
      }
    };

    loadCurrencies();
  }, []);

  useEffect(() => {
    // Load user's currency preference from server
    const loadUserCurrency = async () => {
      try {
        setIsLoading(true);

        // Try to get from server first
        const result = await getUserCurrencyAction();

        if (result.success) {
          setCurrency(result.currency);
        } else {
          // Fallback to localStorage if not authenticated or error
          const savedCurrency = localStorage.getItem("currency");
          if (savedCurrency) {
            setCurrency(savedCurrency);
          }
        }
      } catch (error) {
        console.error("Failed to load user currency:", error);
        // Fallback to localStorage
        const savedCurrency = localStorage.getItem("currency");
        if (savedCurrency) {
          setCurrency(savedCurrency);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUserCurrency();
  }, []);

  const handleSetCurrency = async (newCurrency: string) => {
    setCurrency(newCurrency);

    // Save to database via server action
    try {
      const result = await updateUserCurrencyAction(newCurrency);
      if (!result.success) {
        toast({
          title: "Error updating currency",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update user currency:", error);
    }

    // Always keep localStorage as fallback
    localStorage.setItem("currency", newCurrency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        currencies,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
