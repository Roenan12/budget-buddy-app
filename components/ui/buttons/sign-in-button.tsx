"use client";

import { Button } from "@/components/ui/buttons";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/overlay/dialog";
import { SignInForm, SignUpForm } from "@/components/auth/AuthForm";
import { useState } from "react";
import { signInAction } from "@/lib/actions";

function GoogleSignInButton() {
  return (
    <form action={signInAction}>
      <Button variant="outline" size="lg" className="w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
          className="mr-2"
        />
        Google
      </Button>
    </form>
  );
}

function EmailSignInButton() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Mail className="mr-2 h-5 w-5" />
          Email
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="grid gap-4">
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          <div className="text-center text-sm">
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-primary hover:underline"
            >
              {isSignIn
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { GoogleSignInButton, EmailSignInButton };
