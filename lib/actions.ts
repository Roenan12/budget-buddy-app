"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase, supabaseUrl } from "./supabase";
import { getBudgets, getExpenses, createUser, Currency } from "./data-service";
import { currencies } from "@/data/currencies";

interface AuthOptions {
  redirectTo: string;
}

interface SignInWithEmailParams {
  email: string;
  password: string;
}

interface SignUpWithEmailParams {
  email: string;
  password: string;
  fullName: string;
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
    const amountSpent = parseFloat(
      parseFloat(formData.get("amountSpent") as string).toFixed(2)
    );
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

export async function signInWithEmailAction(
  data: SignInWithEmailParams
): Promise<void> {
  await signIn("credentials", {
    ...data,
    redirect: true,
    redirectTo: "/dashboard",
  });
}

export async function signUpWithEmailAction({
  email,
  password,
  fullName,
}: SignUpWithEmailParams): Promise<{ success: boolean; message: string }> {
  try {
    // First check if user exists in our database
    const { data: existingUser } = await supabase
      .from("users")
      .select()
      .eq("email", email)
      .single();

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    // Try to sign up the user
    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar: "",
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (signUpError) {
      console.error("Supabase Auth Sign Up Error:", signUpError);
      // If it's an email sending error, we still want to create the user
      if (signUpError.message.includes("sending confirmation email")) {
        await createUser({ email, fullName });
        return {
          success: true,
          message:
            "Account created, but there was an issue sending the verification email. Please contact support.",
        };
      }
      return {
        success: false,
        message: signUpError.message,
      };
    }

    if (!user) {
      return {
        success: false,
        message: "No user returned after sign up",
      };
    }

    // Create user in our database
    await createUser({ email, fullName });

    // If we reach here, everything was successful
    return {
      success: true,
      message:
        "Account created successfully! Please check your email for verification instructions.",
    };
  } catch (error: any) {
    console.error("Sign Up Error:", error);
    return {
      success: false,
      message: error.message || "Failed to create account",
    };
  }
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
}

export async function updateUser(
  formData: FormData
): Promise<UpdateUserResponse> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "You must be logged in" };
    }

    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const avatar = formData.get("avatar") as File | null;

    // Initialize updateData
    const updateData: { fullName: string; email: string; avatar?: string } = {
      fullName,
      email,
    };

    // Only handle avatar upload if a new avatar was provided
    if (avatar && avatar instanceof File) {
      // Upload avatar to storage
      const fileName = `avatar-${session.user.userId}-${Math.random()}`;
      const { error: storageError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatar);

      if (storageError) {
        return {
          success: false,
          message: `Failed to upload avatar: ${storageError.message}`,
        };
      }

      const avatarUrl = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
      updateData.avatar = avatarUrl;
    }

    // Update user in database
    const { error: dbError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", session.user.userId);

    if (dbError) {
      return {
        success: false,
        message: `Failed to update profile in database: ${dbError.message}`,
      };
    }

    // If avatar was uploaded, try to update auth user metadata
    // But don't fail if it doesn't work
    if (updateData.avatar) {
      try {
        const { error: authError } = await supabase.auth.updateUser({
          data: { avatar: updateData.avatar },
        });

        if (authError) {
          console.log(
            "Note: Auth metadata update failed, but profile was updated successfully"
          );
        }
      } catch (authError) {
        console.log(
          "Note: Auth metadata update failed, but profile was updated successfully"
        );
      }
    }

    revalidatePath("/dashboard/account/profile");
    return {
      success: true,
      message: "Profile updated successfully",
    };
  } catch (error: any) {
    console.error("Profile update error:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

export async function updateUserCurrencyAction(
  currencyCode: string
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, message: "You must be logged in" };
    }

    // First check if user has a settings record
    const { data: existingSettings } = await supabase
      .from("settings")
      .select("id")
      .eq("user_id", session.user.userId)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { error } = await supabase
        .from("settings")
        .update({ currency_code: currencyCode })
        .eq("user_id", session.user.userId);

      if (error) {
        console.error("Error updating user currency:", error);
        return {
          success: false,
          message: `Failed to update currency: ${error.message}`,
        };
      }
    } else {
      // Create new settings record
      const { error } = await supabase
        .from("settings")
        .insert([
          { user_id: session.user.userId, currency_code: currencyCode },
        ]);

      if (error) {
        console.error("Error creating user currency settings:", error);
        return {
          success: false,
          message: `Failed to create currency settings: ${error.message}`,
        };
      }
    }

    // Revalidate any pages that might show currency
    revalidatePath("/dashboard");

    return { success: true, message: "Currency updated successfully" };
  } catch (error: any) {
    console.error("Currency update error:", error);
    return {
      success: false,
      message: error.message || "Failed to update currency",
    };
  }
}

export async function getUserCurrencyAction(): Promise<{
  success: boolean;
  currency: string;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return { success: false, currency: "USD", message: "Not authenticated" };
    }

    // Get user's currency preference
    const { data, error } = await supabase
      .from("settings")
      .select("currency_code")
      .eq("user_id", session.user.userId)
      .single();

    if (error) {
      // If no settings found, return default
      if (error.code === "PGRST116") {
        return { success: true, currency: "USD" };
      }
      console.error("Error fetching user currency:", error);
      return { success: false, currency: "USD", message: error.message };
    }

    return { success: true, currency: data.currency_code };
  } catch (error: any) {
    console.error("getUserCurrency failed:", error);
    return {
      success: false,
      currency: "USD",
      message: error.message || "Failed to get currency",
    };
  }
}

export async function getCurrenciesAction(): Promise<{
  success: boolean;
  currencies: Currency[];
  message?: string;
}> {
  try {
    const { data, error } = await supabase
      .from("currencies")
      .select("*")
      .order("code", { ascending: true });

    if (error) {
      console.error("Error fetching currencies:", error);
      return {
        success: false,
        currencies: [],
        message: `Currencies could not be loaded: ${error.message}`,
      };
    }

    return { success: true, currencies: data || [] };
  } catch (error: any) {
    console.error("getCurrencies failed:", error);
    return {
      success: false,
      currencies: [],
      message: error.message || "Failed to get currencies",
    };
  }
}

export async function getCurrentCurrencySymbolAction(): Promise<{
  success: boolean;
  symbol: string;
  currencyCode: string;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: true,
        symbol: "$",
        currencyCode: "USD",
        message: "Not authenticated, using default currency",
      };
    }

    // Get user's currency preference
    const { data, error } = await supabase
      .from("settings")
      .select("currency_code")
      .eq("user_id", session.user.userId)
      .single();

    if (error) {
      // If no settings found, return default
      if (error.code === "PGRST116") {
        return { success: true, symbol: "$", currencyCode: "USD" };
      }
      console.error("Error fetching user currency:", error);
      return {
        success: false,
        symbol: "$",
        currencyCode: "USD",
        message: error.message,
      };
    }

    // Get the symbol for the currency code
    const currencyCode = data.currency_code;
    const currencyInfo = currencies.find((c) => c.code === currencyCode);
    const symbol = currencyInfo?.symbol || "$";

    return { success: true, symbol, currencyCode };
  } catch (error: any) {
    console.error("getCurrentCurrencySymbol failed:", error);
    return {
      success: false,
      symbol: "$",
      currencyCode: "USD",
      message: error.message || "Failed to get currency symbol",
    };
  }
}
