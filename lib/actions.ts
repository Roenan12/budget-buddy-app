"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBudgets, getExpenses } from "./data-service";

interface AuthOptions {
  redirectTo: string;
}

export async function createBudget(
  formData: FormData
): Promise<{ success: boolean; message: any }> {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const amount = Number(formData.get("amount"));
    const rawCategory = formData.get("category") as string;
    const category = rawCategory.split(" (")[0];

    const { error: budgetError } = await supabase
      .from("budgets")
      .insert([
        {
          name,
          amount,
          category,
          userId: session.user.userId,
        },
      ])
      .select()
      .single();

    if (budgetError) {
      console.error("Budget Error:", budgetError);
      return { success: false, message: `Failed to create budget: ${name}` };
    }

    revalidatePath("/dashboard/budgets");
    return { success: true, message: `Budget: ${name} successfully created!` };
  } catch (error) {
    console.error("Error creating budget:", error);
    throw new Error("An unexpected error occurred while creating the budget");
  }
}

export async function createExpense(
  formData: FormData
): Promise<{ success: boolean; message: any }> {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const amountSpent = Number(formData.get("amountSpent"));
    const date = formData.get("date") as string;
    const budgetId = Number(formData.get("budgetId"));

    // Create the expense object without an ID
    const newExpense = {
      name,
      amountSpent,
      date,
      budgetId,
      userId: session.user.userId,
    };

    const { error: expenseError } = await supabase
      .from("expenses")
      .insert(newExpense) // Insert a single object, not an array
      .select()
      .single();

    if (expenseError) {
      console.error("Expense Error:", expenseError.message);
      return { success: false, message: `Failed to create expense: ${name}` };
    }

    revalidatePath("/dashboard/expenses");
    return { success: true, message: `Expense: ${name} successfully created!` };
  } catch (error) {
    console.error("Error creating expense:", error);
    throw new Error("An unexpected error occurred while creating the expense");
  }
}

export async function updateBudget(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    // Authentication
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const budgetId = Number(formData.get("budgetId"));
    const userBudgets = await getBudgets(session.user.userId);
    const userBudgetsIds = userBudgets.map((budget) => budget.id);

    if (!userBudgetsIds.includes(budgetId)) {
      throw new Error("You are not allowed to update this budget");
    }

    // Update budget
    const name = formData.get("name") as string;
    const amount = Number(formData.get("amount"));
    const rawCategory = formData.get("category") as string;
    const category = rawCategory.split(" (")[0];
    const updateData = { name, amount, category };

    const { error: updateError } = await supabase
      .from("budgets")
      .update(updateData)
      .eq("id", budgetId)
      .select()
      .single();

    if (updateError) throw new Error(`Failed to update budget: ${name}`);

    // Revalidate cache
    revalidatePath(`/dashboard/budgets/edit/${budgetId}`);
    return {
      success: true,
      message: `Budget: ${name} has been updated successfully!`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update budget",
    };
  }
}

export async function updateExpense(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    // Authentication
    const session = await auth();
    if (!session) throw new Error("Unauthorized");

    const budgetId = Number(formData.get("budgetId"));
    const expenseId = Number(formData.get("expenseId"));
    const userExpenses = await getExpenses(session.user.userId);
    const userExpensesIds = userExpenses.map((expense) => expense.id);

    if (!userExpensesIds.includes(expenseId)) {
      throw new Error("You are not allowed to update this expense");
    }

    // Update expense
    const name = formData.get("name") as string;
    const amountSpent = Number(formData.get("amountSpent"));
    const date = formData.get("date") as string;

    const updateData = {
      name,
      amountSpent,
      date,
      budgetId,
      userId: session.user.userId,
    };
    console.log(updateData);

    const { error: updateError } = await supabase
      .from("expenses")
      .update(updateData)
      .eq("id", expenseId)
      .select()
      .single();

    if (updateError) throw new Error(`Failed to update expense: ${name}`);

    // Revalidate cache
    revalidatePath("/dashboard/expenses");
    return {
      success: true,
      message: `Expense: ${name} has been updated successfully!`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update expense",
    };
  }
}

export async function deleteBudget(
  budgetId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const userBudgets = await getBudgets(session.user.userId);
    const userBudgetsIds = userBudgets.map((budget) => budget.id);

    if (!userBudgetsIds.includes(budgetId)) {
      throw new Error("You are not allowed to update this budget");
    }

    const { error } = await supabase
      .from("budgets")
      .delete()
      .eq("id", budgetId);

    if (error) {
      throw new Error("Budget could not be deleted");
    }

    revalidatePath(`/dashboard/budgets/${budgetId}`);
    return {
      success: true,
      message: `Budget successfully deleted`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete budget",
    };
  }
}

export async function deleteExpense(
  expenseId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session) throw new Error("You must be logged in");

    const userExpenses = await getExpenses(session.user.userId);
    const userExpensesIds = userExpenses.map((expense) => expense.id);

    if (!userExpensesIds.includes(expenseId)) {
      throw new Error("You are not allowed to delete this expense");
    }
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId);

    if (error) throw new Error("Expense could not be deleted");

    revalidatePath("/dashboard/expenses");
    return {
      success: true,
      message: `Expense successfully deleted`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to delete expense",
    };
  }
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/dashboard" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
