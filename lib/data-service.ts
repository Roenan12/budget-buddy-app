import { supabase } from "./supabase";

export type Budget = {
  id: number;
  name: string;
  amount: number;
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

export const getBudgets = async function (): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select("id, name, amount, expenseId, userId, expenses(amountSpent)")
    .order("name");

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 2000));

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
