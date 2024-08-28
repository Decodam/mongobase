import { Protected } from "@/components/auth/session";


export default async function Profile({}) {

  return (
    <Protected nextUrl={"profile"}>
      {(user) => (
        <>Profile -  {user.name}</>
      )}
    </Protected>
  );
}