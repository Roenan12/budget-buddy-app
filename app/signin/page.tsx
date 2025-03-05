import { LoginCard } from "@/components/auth/LoginCard";

export const metadata = {
  title: "Login",
};

export default function Page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <LoginCard />
    </div>
  );
}
