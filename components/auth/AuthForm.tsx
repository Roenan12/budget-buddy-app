"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/buttons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/forms";
import { Input } from "@/components/ui/forms";
import { useState } from "react";
import SpinnerMini from "@/components/ui/feedback/spinner-mini";
import { signInWithEmailAction, signUpWithEmailAction } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SuccessDialog } from "@/components/ui/overlay/success-dialog";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type SignInFormValues = z.infer<typeof signInSchema>;
type SignUpFormValues = z.infer<typeof signUpSchema>;

type FieldProps = {
  field: {
    onChange: (...event: any[]) => void;
    onBlur: () => void;
    value: string;
    name: string;
    ref: React.Ref<any>;
  };
};

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignInFormValues) {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      await signInWithEmailAction(data);
    } catch (error) {
      setError("Invalid email or password");
      console.error("Sign in error:", error);
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }: FieldProps) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: FieldProps) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <div className="text-sm text-red-500">{error}</div>}
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? (
            <>
              <SpinnerMini />
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>
    </Form>
  );
}

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({
    title: "",
    description: "",
  });
  const router = useRouter();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUpWithEmailAction({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      });

      if (result.success) {
        setDialogMessage({
          title: "Account Created Successfully!",
          description: result.message,
        });
        setShowSuccessDialog(true);
      } else {
        setError(result.message);
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account");
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDialogAction = () => {
    setShowSuccessDialog(false);
    router.push("/signin");
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }: FieldProps) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {error && <div className="text-sm text-red-500">{error}</div>}
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? (
              <>
                <SpinnerMini />
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
      </Form>

      <SuccessDialog
        isOpen={showSuccessDialog}
        title={dialogMessage.title}
        description={dialogMessage.description}
        onAction={handleDialogAction}
      />
    </>
  );
}
