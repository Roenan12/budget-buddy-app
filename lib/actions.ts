"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBudgets } from "./data-service";

interface AuthOptions {
  redirectTo: string;
}

export async function createBudget(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const amount = Number(formData.get("amount"));
  const rawCategory = formData.get("category") as string;
  const category = rawCategory.split(" (")[0]; // Split and take first part before parenthesis

  // First create the budget and get its auto-incremented ID
  const { data: budget, error: budgetError } = await supabase
    .from("budgets")
    .insert([
      {
        name,
        amount,
        category,
        expenseId: null,
        userId: session.user.userId,
      },
    ])
    .select()
    .single();

  if (budgetError) {
    console.error("Budget Error:", budgetError);
    throw new Error("Budget could not be created");
  }

  // Create expense first using the budget's ID
  const { error: expenseError } = await supabase.from("expenses").insert([
    {
      id: budget.id,
      name: name,
      date: new Date().toISOString(),
      category,
      amountSpent: 0,
      userId: session.user.userId,
    },
  ]);

  if (expenseError) throw new Error("Expense could not be created");

  // Now update the budget with the expense ID
  const { error: updateError } = await supabase
    .from("budgets")
    .update({ expenseId: budget.id })
    .eq("id", budget.id);

  if (updateError) {
    console.error("Update Error:", updateError);
    throw new Error(`Budget could not be updated: ${updateError.message}`);
  }

  revalidatePath(`/dashboard/budgets`);
  redirect(`/dashboard/budgets`);
}

export async function signInAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/dashboard" };
  await signIn("google", options);
}

export async function signOutAction(): Promise<void> {
  const options: AuthOptions = { redirectTo: "/" };
  await signOut(options);
}
