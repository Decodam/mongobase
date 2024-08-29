

import UserProfile from "@/components/auth/profile";
import { Protected } from "@/components/auth/session";


export default async function Profile({}) {

  return (
    <Protected nextUrl={"profile"}>
      {(user) => (
        <UserProfile user={user} />
      )}
    </Protected>
  );
}
