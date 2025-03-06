"use client";

import { GoogleSignInButton } from "@/components/ui/buttons/sign-in-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/data-display/card";
import { Icons } from "@/components/ui/utils/Icons";
import { SignUpForm } from "@/components/auth/AuthForm";
import Link from "next/link";

export function SignUpCard() {
  return (
    <Card className="w-[350px]">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center gap-0 ">
          <Icons.logo className="h-8 w-8" />
          <span className="text-2xl font-bold">udget Buddy</span>
        </div>
        <CardDescription className="text-center pt-2.5">
          Create a new account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SignUpForm />
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
          <Link href="/signin" className="text-primary hover:underline">
            Already have an account? Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
