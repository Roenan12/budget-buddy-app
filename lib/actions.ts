"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBudgets } from "./data-service";

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
      return { success: false, message: `Failed to create budget ${name}` };
    }

    revalidatePath(`/dashboard/budgets`);
    return { success: true, message: `Budget ${name} successfully created!` };
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
    const amountSpent = Number(formData.get("amount"));
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
      return { success: false, message: `Failed to create expense ${name}` };
    }

    revalidatePath(`/dashboard/expenses`);
    return { success: true, message: `Expense ${name} successfully created!` };
  } catch (error) {
    console.error("Error creating expense:", error);
    throw new Error("An unexpected error occurred while creating the expense");
  }
}

export async function updateBudget(formData: FormData): Promise<void> {
  // Authentication
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const budgetId = Number(formData.get("budgetId"));

  // Authorization
  const userBudgets = await getBudgets(session.user.userId);

  const userBudgetsIds = userBudgets.map((budget) => budget.id);

  if (!userBudgetsIds.includes(budgetId)) {
    throw new Error("You are not allowed to update this budget");
  }

  // update budget data
  const name = formData.get("name") as string;
  const amount = Number(formData.get("amount"));
  const rawCategory = formData.get("category") as string;
  const category = rawCategory.split(" (")[0];

  const updateData = { name, amount, category };

  // Mutation
  const { error: updateError } = await supabase
    .from("budgets")
    .update(updateData)
    .eq("id", budgetId)
    .select()
    .single();

  if (updateError) throw new Error("Budget could not be updated");

  // Revalidate and redirect
  revalidatePath(`/dashboard/budgets/edit/${budgetId}`);
  redirect(`/dashboard/budgets/${budgetId}`);
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/dashboard" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
