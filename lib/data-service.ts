import { supabase } from "./supabase";
import { notFound } from "next/navigation";

// type ExpenseDetails = {
//   amountSpent: number;
// };

export type Finance = {
  id: number;
  totalBudget: number;
  totalExpenses: number;
  totalRemaining: number;
  activeBudgets: number;
  budgetId: number;
  expenseId: number;
};

export type Budget = {
  id: number;
  name: string;
  amount: number;
  category: string;
};

export type Expense = {
  id: number;
  name: string;
  amountSpent: number;
  date: string;
  category: string;
};

export type Users = {
  id: number;
  fullName: string;
  email: string;
};

export async function getFinance(id: number): Promise<Finance | null> {
  const { data, error } = await supabase
    .from("finances")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Finance could not get loaded");
  }

  return data;
}

export async function getFinances(userId: number): Promise<Finance[]> {
  const { data, error } = await supabase
    .from("finances")
    .select(
      "id, totalBudget, totalExpenses, totalRemaining, activeBudgets, budgetId, expenseId, budgets(name, amount), expenses(amountSpent)"
    )
    .eq("userId", userId)
    .order("startDate");

  if (error) {
    console.error(error);
    throw new Error("Finances could not get loaded");
  }

  if (!data) return [];

  const Finances: Finance[] = data.map((finance) => ({
    ...finance,
    cabins: Array.isArray(finance.budgets)
      ? finance.budgets[0]
      : finance.budgets,
  }));

  return Finances;
}

export async function getBudget(id: number): Promise<Budget | null> {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("id", id)
    .single();

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    notFound();
  }

  return data;
}

export const getBudgets = async function (): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select("id, name, amount, category");

  if (error) {
    console.error(error);
    throw new Error("Budgets could not be loaded");
  }

  return data || [];
};

export const getExpenses = async function (): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("id, name, amountSpent, date, category")
    .order("name");

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Expenses could not be loaded");
  }

  return data || [];
};
