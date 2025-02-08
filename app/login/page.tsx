import SignInButton from "@/components/SignInButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/Icons";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-0 ">
            <Icons.logo className="h-8 w-8" />
            <span className="text-2xl font-bold">udget Buddy</span>
          </div>
          <CardDescription className="text-center pt-2.5">
            Start managing your budgets
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Continue with
              </span>
            </div>
          </div>
          <SignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
