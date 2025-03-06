import { SignUpCard } from "@/components/auth/SignUpCard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign Up - Budget Buddy",
  description: "Create your Budget Buddy account",
};

export default async function SignUpPage() {
  // Check if user is already authenticated
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
    return null;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <SignUpCard />
    </div>
  );
}
