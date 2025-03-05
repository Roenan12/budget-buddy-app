import { LoginCard } from "@/components/auth/LoginCard";

export const metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <LoginCard />
    </div>
  );
}
