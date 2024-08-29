
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




export function getInitials(fullName) {
  if (typeof fullName !== 'string' || !fullName.trim()) {
    throw new Error("Invalid input. Please provide a non-empty string.");
  }

  const names = fullName.trim().split(/\s+/);

  // Check if there are at least two words
  if (names.length < 2) {
    throw new Error("Full name must contain at least a first and last name.");
  }

  const firstName = names[0];
  const lastName = names[names.length - 1];

  // Extract initials from the first and last name
  const initials = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;

  return initials;
}


export default function ProfileDropdown({ user }) {

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <Avatar>
            <AvatarImage src={user.image || "/default-user.jpg"} />
            <AvatarFallback>{user.name? getInitials(user.name) : 'U'}</AvatarFallback>
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


