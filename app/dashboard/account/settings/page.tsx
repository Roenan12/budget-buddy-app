import { Separator } from "@/components/ui/layout/separator";
import { UpdateCurrencyForm } from "@/components/account/settings/UpdateCurrencyForm";

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <Separator />
      <div className="grid gap-4">
        <UpdateCurrencyForm />
      </div>
    </div>
  );
}
