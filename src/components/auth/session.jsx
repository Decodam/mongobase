import { auth } from "@/auth";

export async function Session({ signedOut, signedIn }) {
  const session = await auth();

  if (!session?.user) return <>{signedOut}</>;

  const user = session.user;

  return <>{signedIn(user)}</>;
}
