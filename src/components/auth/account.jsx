
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { logout } from "@/actions/auth.actions";
import { IconLogout, IconUser } from "@tabler/icons-react";
import Link from "next/link";

export default function ProfileDropdown({ user }) {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar>
            <AvatarImage src={user.image || "/default-user.jpg"} />
            <AvatarFallback>{user.name?.[0] || 'CN'}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="mr-4 min-w-48 mt-2">
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div>
            <Link href="/profile">
              <DropdownMenuItem className="cursor-pointer p-2 flex gap-2 items-center">
                <IconUser size={16} /><span>Account</span>
              </DropdownMenuItem>
            </Link>
            <form action={logout}>
              <button type="submit" className="p-2 w-full flex gap-2 items-center text-left bg-background hover:bg-destructive/10 font-medium rounded transition text-destructive text-sm">
                <IconLogout size={16} /><span>Logout</span>
              </button>
            </form>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}


