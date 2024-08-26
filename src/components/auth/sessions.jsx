import { auth } from "@/auth"
 
export async function SignedIn({children}) {
  const session = await auth()
 
  if (!session?.user) return null
 
  return(<>{children}</>)
}


export async function SignedOut({children}) {
  const session = await auth()
 
  if (!session?.user) return(<>{children}</>)
 
  return null;
}