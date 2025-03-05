"use client";

import { GoogleSignInButton } from "@/components/ui/buttons/sign-in-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/data-display/card";
import { Icons } from "@/components/ui/utils/Icons";
import { SignInForm, SignUpForm } from "@/components/auth/AuthForm";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function LoginCard() {
  const [isSignIn, setIsSignIn] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsSignIn(pathname === "/signin");
  }, [pathname]);

  const handleToggle = () => {
    const newPath = isSignIn ? "/signup" : "/signin";
    router.push(newPath);
    setIsSignIn(!isSignIn);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-0 ">
          <Icons.logo className="h-8 w-8" />
          <span className="text-2xl font-bold">udget Buddy</span>
        </div>
        <CardDescription className="text-center pt-2.5">
          {isSignIn ? "Sign in to your account" : "Create a new account"}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {isSignIn ? <SignInForm /> : <SignUpForm />}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <GoogleSignInButton />
        <div className="text-center text-sm">
          <button
            onClick={handleToggle}
            className="text-primary hover:underline"
          >
            {isSignIn
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
