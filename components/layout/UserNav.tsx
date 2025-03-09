import { Button } from "@/components/ui/buttons";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/data-display/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/overlay/dropdown-menu";
import { signOutAction } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { getUser } from "@/lib/data-service";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export async function UserNav() {
  const session = await auth();
  if (!session) return;
  const user = session?.user;
  const userAvatar = await getUser(session?.user.email);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={userAvatar?.avatar || user?.image || ""}
              alt={user?.name || ""}
            />
            <AvatarFallback>
              {" "}
              <User />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userAvatar?.fullName || user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard/account/profile"
              className="w-full flex items-center"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button className="w-full flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
