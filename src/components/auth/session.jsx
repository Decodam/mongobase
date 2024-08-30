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