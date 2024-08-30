"use client"


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
import { IconLock, IconLogout, IconSettings, IconUser,  } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button"


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


export default function UserProfile({ user }) {
  const [isModalOpen, setIsModalOpen] = useState(true);


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
            <DropdownMenuItem onClick={() => setIsModalOpen(true)} className="cursor-pointer h-10 p-2 flex gap-2 items-center">
              <IconSettings size={18} /><span>Settings</span>
            </DropdownMenuItem>
            <form action={logout}>
              <button type="submit" className="p-2 w-full h-10 flex gap-2 items-center text-left bg-background hover:bg-destructive/10 font-medium rounded transition text-destructive text-sm">
                <IconLogout size={18} /><span>Logout</span>
              </button>
            </form>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>


      <ProfileDialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}



function ProfileDialog({ isOpen, onClose }) {
  const [tab, setTab] = useState(0);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Background Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-background sm:max-h-[80svh] h-full max-w-screen-md sm:rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg w-full sm:mx-4">
        <div className="sm:w-52 sm:bg-muted/40 max-sm:border-b sm:border-r border-border p-6">
          <div className="banner mb-4">
            <h1 className="font-semibold">Account Settings</h1>
          </div>
          <div className="btn-grp sm:space-y-2 max-sm:flex p-1 rounded-lg max-sm:bg-muted w-full">
            <Button onClick={() => {setTab(0)}} variant={tab === 0 ? "outline" : "ghost"} className="w-full space-x-2 sm:justify-start" size="sm">
              <span><IconUser size={16} /></span>
              <span>Account</span>
            </Button>
            <Button onClick={() => {setTab(1)}} variant={tab === 1 ? "outline" : "ghost"} className="w-full space-x-2 sm:justify-start" size="sm">
              <span><IconLock size={16} /></span>
              <span>Security</span>
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-scroll p-6">
          
        </div>
      </div>
    </div>
  );
}


