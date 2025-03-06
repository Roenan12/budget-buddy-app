import { Separator } from "@/components/ui/layout/separator";
import { ProfileForm } from "@/components/account/profile-form";

export default function ProfilePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      </div>
      <Separator />
      <div className="grid gap-4">
        <ProfileForm />
      </div>
    </div>
  );
}
