import { supabase } from "./supabase";
import { notFound } from "next/navigation";

type ExpenseDetails = {
  amountSpent: number;
};

export type User = {
  id: number;
  fullName?: string;
  email?: string;
};

export type Finance = {
  id: number;
  totalBudget: number;
  totalExpenses: number;
  totalRemainingBudget: number;
  activeBudgets: number;
  budgetId: number;
  expenseId: number;
};

export type Budget = {
  id: number;
  name: string;
  amount: number;
  category: string;
  expenses: ExpenseDetails;
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
      "id, totalBudget, totalExpenses, totalRemainingBudget, activeBudgets, budgetId, expenseId, budgets(name, amount), expenses(amountSpent)"
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

export async function getBudgets(): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select(`id, name, amount, category, expenseId, expenses(amountSpent)`)
    .order("id");

  //for testing, delay for 2secs
  // await new Promise((res) => setTimeout(res, 2000));

  if (error) {
    console.error(error);
    throw new Error("Budgets could not be loaded");
  }

  if (!data) return [];

  const Budgets: Budget[] = data.map((budget) => ({
    ...budget,
    expenses: Array.isArray(budget.expenses)
      ? budget.expenses[0]
      : budget.expenses,
  }));

  return Budgets;
}

export async function getExpenses(): Promise<Expense[]> {
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
}

export async function getUser(
  email: string | null | undefined
): Promise<User | null> {
  try {
    console.log("Checking for guest with email:", email);
    const { data, error } = await supabase
      .from("guests")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      // No guest found
      console.warn("No guest found with email:", email);
      return null;
    }

    if (error) {
      console.error("Unexpected getGuest error:", error);
      throw new Error("Error fetching guest");
    }

    return data;
  } catch (error) {
    console.error("getGuest failed:", error);
    throw error;
  }
}

export async function createUser(newUser: { email: string; fullName: string }) {
  try {
    console.log("Creating guest with data:", newUser);

    const { data, error } = await supabase.from("guests").insert([newUser]);

    if (error) {
      console.error("createGuest error:", error);
      throw new Error("Guest could not be created");
    }

    console.log("Guest created successfully:", data);
    return data;
  } catch (error) {
    console.error("createGuest failed:", error);
    throw error;
  }
}
