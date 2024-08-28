import { redirect } from "next/navigation";
import getServerSession from "@/lib/getServerSession";

export async function SignedIn({ children }) {
  const session = await getServerSession();

  if (!session?.user) return null;

  const user = session.user;

  
  return <>{children(user)}</>;
}

export async function SignedOut({ children }) {
  const session = await getServerSession();

  if (session?.user) return null;
  
  return <>{children}</>;
}


export async function Protected({ nextUrl, children }) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect(`/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`);
  }

  const user = session.user;
  
  return <>{children(user)}</>;
}

export async function RedirectOnAuthenticated({ redirectUrl, children }) {
  const session = await getServerSession();

  if (session?.user) {
    redirect(redirectUrl || '/');
  }

  return <>{children}</>;
}