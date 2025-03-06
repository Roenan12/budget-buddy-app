"use client";

import { GoogleSignInButton } from "@/components/ui/buttons/sign-in-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/data-display/card";
import { Icons } from "@/components/ui/utils/Icons";
import { SignInForm } from "@/components/auth/AuthForm";
import Link from "next/link";
import { SampleAccountDialog } from "@/components/ui/overlay/sample-account-dialog";
import { useState, useEffect } from "react";

export function SignInCard() {
  const [showSampleDialog, setShowSampleDialog] = useState(false);

  useEffect(() => {
    // Check if we've shown the dialog before
    const hasShownDialog = localStorage.getItem("hasShownSampleAccountDialog");
    if (!hasShownDialog) {
      setShowSampleDialog(true);
    }
  }, []);

  const handleDialogClose = () => {
    setShowSampleDialog(false);
    localStorage.setItem("hasShownSampleAccountDialog", "true");
  };

  return (
    <>
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-0 ">
            <Icons.logo className="h-8 w-8" />
            <span className="text-2xl font-bold">udget Buddy</span>
          </div>
          <CardDescription className="text-center pt-2.5">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <SignInForm />
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
            <Link href="/signup" className="text-primary hover:underline">
              Don&apos;t have an account? Sign up
            </Link>
          </div>
        </CardContent>
      </Card>

      <SampleAccountDialog
        isOpen={showSampleDialog}
        onClose={handleDialogClose}
      />
    </>
  );
}
