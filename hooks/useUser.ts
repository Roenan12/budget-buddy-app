"use client";

import { useState, useEffect } from "react";
import { User, getUser, getCurrentUser } from "@/lib/data-service";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        // Get the authenticated user from Supabase auth
        const authUser = await getCurrentUser();

        if (!authUser || !authUser.email) {
          setUser(null);
          return;
        }

        // Get the user data from our users table
        const userData = await getUser(authUser.email);
        setUser(userData);
      } catch (err) {
        console.error("Error loading user:", err);
        setError(err instanceof Error ? err : new Error("Failed to load user"));
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  return { user, loading, error };
}
