import { Separator } from "@/components/ui/layout/separator";
import { UpdateProfileForm } from "@/components/account/UpdateProfileForm";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getCurrentUser, getUser } from "@/lib/data-service";

export const metadata: Metadata = {
  title: "Update profile",
};

export default async function Page() {
  const session = await auth();
  const user = await getUser(session?.user.email);
  if (!user) return;
  const googleUser = session?.user;
  if (!session) return;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      <Separator />
      <div className="grid gap-4">
        <UpdateProfileForm user={user} googleUser={googleUser} />
      </div>
    </div>
  );
}
