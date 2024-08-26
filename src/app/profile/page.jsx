import { auth } from "@/auth";


export default async function Profile({}) {
  const session = await auth();
  const user = session ? session.user : {};


  return (
    <div>
      Profile -  {user.name}
    </div>
  );
}