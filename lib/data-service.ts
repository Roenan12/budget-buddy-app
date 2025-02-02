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
  created_at: string;
  name: string;
  amount: number;
  category: string;
  expenseId: number;
  userId: number;
  expenses: ExpenseDetails;
};

export type Expense = {
  id: number;
  name: string;
  amountSpent: number;
  date: string;
  category: string;
  userId: number;
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

export async function getBudgets(userId: number): Promise<Budget[]> {
  try {
    // Debug log
    console.log("Attempting to fetch budgets for userId:", userId);

    const { data, error } = await supabase
      .from("budgets")
      .select(
        `
        id,
        created_at,
        name,
        amount,
        category,
        expenseId,
        userId,
        expenses!inner (
          amountSpent
        )
      `
      )
      .eq("userId", userId);

    if (error) {
      console.error("Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No budgets found for userId:", userId);
      return [];
    }

    console.log("Successfully retrieved budgets:", {
      count: data.length,
      sample: data[0],
    });

    const Budgets: Budget[] = data.map((budget) => ({
      ...budget,
      expenses: Array.isArray(budget.expenses)
        ? budget.expenses[0]
        : budget.expenses,
    }));

    return Budgets;
  } catch (error) {
    console.error("Error in getBudgets:", error);
    throw new Error(
      `Budgets could not be loaded: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getExpenses(): Promise<Expense[]> {
  const { data, error } = await supabase
    .from("expenses")
    .select("id, name, amountSpent, date, category, userId")
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
    console.log("Checking for user with email:", email);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code === "PGRST116") {
      // No user found
      console.warn("No user found with email:", email);
      return null;
    }

    if (error) {
      console.error("Unexpected getUser error:", error);
      throw new Error("Error fetching user");
    }

    return data;
  } catch (error) {
    console.error("getUser failed:", error);
    throw error;
  }
}

export async function createUser(newUser: { email: string; fullName: string }) {
  try {
    console.log("Creating user with data:", newUser);

    const { data, error } = await supabase.from("users").insert([newUser]);

    if (error) {
      console.error("createUser error:", error);
      throw new Error("User could not be created");
    }

    console.log("User created successfully:", data);
    return data;
  } catch (error) {
    console.error("createUser failed:", error);
    throw error;
  }
}
