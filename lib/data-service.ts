import { supabase } from "./supabase";
import { notFound } from "next/navigation";

type BudgetDetails = {
  id: number;
  budgetName: string;
  budgetAmount: number;
};

export type User = {
  id: number;
  fullName?: string;
  email?: string;
};

export type Budget = {
  id: number;
  created_at: string;
  name: string;
  amount: number;
  category: string;
  userId: number;
  expenses: {
    totalSpent: number;
  };
};

export type Expense = {
  id: number;
  name: string;
  amountSpent: number;
  date: string;
  userId: number;
  budgetId: number;
  budgets: BudgetDetails;
};

export type Users = {
  id: number;
  fullName: string;
  email: string;
};

export async function getBudget(id: number): Promise<Budget | null> {
  const { data, error } = await supabase
    .from("budgets")
    .select(
      `
      *,
      expenses (
        amountSpent
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    notFound();
  }

  if (data) {
    return {
      ...data,
      expenses: {
        totalSpent:
          data.expenses?.reduce(
            (sum: number, expense: { amountSpent: number }) =>
              sum + (expense.amountSpent || 0),
            0
          ) || 0,
      },
    };
  }

  return null;
}

export async function getBudgets(userId: number): Promise<Budget[]> {
  try {
    const { data, error } = await supabase
      .from("budgets")
      .select(
        `
        id,
        created_at,
        name,
        amount,
        category,
        userId,
        expenses (
          amountSpent
        )
      `
      )
      .eq("userId", userId)
      .order("created_at", { ascending: true });

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

    const Budgets: Budget[] = data.map((budget) => ({
      ...budget,
      expenses: {
        totalSpent:
          budget.expenses?.reduce(
            (sum, expense) => sum + (expense.amountSpent || 0),
            0
          ) || 0,
      },
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

export async function getExpenses(userId: number): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        id, 
        name, 
        amountSpent, 
        date, 
        userId, 
        budgetId, 
        budgets!inner(
          id,
          name,
          amount
        )
      `
      )
      .eq("userId", userId)
      .order("date", { ascending: false });

    if (error) {
      console.error("Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      console.log("No expenses found for userId:", userId);
      return [];
    }

    console.log("Successfully retrieved expenses:", {
      count: data.length,
      sample: data[0],
    });

    const Expenses: Expense[] = data.map((expense) => ({
      ...expense,
      budgets: Array.isArray(expense.budgets)
        ? {
            id: expense.budgets[0].id,
            budgetName: expense.budgets[0].name,
            budgetAmount: expense.budgets[0].amount,
          }
        : {
            id: (expense.budgets as any).id,
            budgetName: (expense.budgets as any).name,
            budgetAmount: (expense.budgets as any).amount,
          },
    }));

    return Expenses;
  } catch (error) {
    console.error("Error in getExpenses:", error);
    throw new Error(
      `Expenses could not be loaded: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export async function getRecentExpenses(userId: number): Promise<Expense[]> {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .select(
        `
        id, 
        name, 
        amountSpent, 
        date, 
        userId, 
        budgetId, 
        budgets!inner(
          id,
          name,
          amount
        )
      `
      )
      .eq("userId", userId)
      .order("date", { ascending: false })
      .limit(10); // Only fetch 10 records

    if (error) {
      console.error("Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
      });
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    const Expenses: Expense[] = data.map((expense) => ({
      ...expense,
      budgets: Array.isArray(expense.budgets)
        ? {
            id: expense.budgets[0].id,
            budgetName: expense.budgets[0].name,
            budgetAmount: expense.budgets[0].amount,
          }
        : {
            id: (expense.budgets as any).id,
            budgetName: (expense.budgets as any).name,
            budgetAmount: (expense.budgets as any).amount,
          },
    }));

    return Expenses;
  } catch (error) {
    console.error("Error in getRecentExpenses:", error);
    throw new Error(
      `Recent expenses could not be loaded: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
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

    // First check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", newUser.email)
      .single();

    if (existingUser) {
      return existingUser;
    }

    // Create new user if doesn't exist
    const { error } = await supabase.from("users").insert([newUser]);

    if (error) {
      console.error("createUser error:", error);
      if (error.code === "23505") {
        throw new Error("User with this email already exists");
      }
      throw new Error(`User could not be created: ${error.message}`);
    }

    // Get the created user
    const { data: createdUser, error: fetchError } = await supabase
      .from("users")
      .select()
      .eq("email", newUser.email)
      .single();

    if (fetchError || !createdUser) {
      throw new Error("Failed to fetch created user");
    }

    console.log("User created successfully:", createdUser);
    return createdUser;
  } catch (error) {
    console.error("createUser failed:", error);
    throw error;
  }
}
