import { auth } from "@/auth";
import { SignedIn, SignedOut } from "@/components/auth/sessions";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { logout } from "@/utils/auth.actions";


export default async function Home({}) {
  const session = await auth();
  const user = session ? session.user : {};


  return (
    <div>
      <SignedIn>
        Hello, {user.name} - {user.id}

        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>


        <form action={logout}>
          <Button variant="destructive">Logout</Button>
        </form>
      </SignedIn>
      <SignedOut>
        Please log in! <br />

        <div className="flex gap-2">
          <Link href={"/login"}>Login</Link>
          <Link href={"/signup"}>Signup</Link>
        </div>
      </SignedOut>
    </div>
  );
}