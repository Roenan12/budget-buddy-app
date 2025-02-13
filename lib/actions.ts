"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";

interface AuthOptions {
  redirectTo: string;
}

export async function createBudget(formData: FormData): Promise<void> {
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
    throw new Error("Budget could not be created");
  }

  revalidatePath(`/dashboard/budgets`);
  redirect(`/dashboard/budgets`);
}

export async function createExpense(formData: FormData): Promise<void> {
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
    console.error("Expense Error:", expenseError);
    throw new Error(`Expense could not be created: ${expenseError.message}`);
  }

  revalidatePath(`/dashboard/expenses`);
  redirect(`/dashboard/expenses`);
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/dashboard" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
