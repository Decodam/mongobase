import { loginWithOAuth } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";

export default function OAuthSignInButton({ provider, icon: Icon, redirect, className }) {
  return (
    <form
      action={() => {loginWithOAuth(provider, redirect)}}
    >
      <Button className={["w-full", className]} variant="outline" type="submit">
        {Icon && <Icon className="mr-1" size={20} />}
        <span className="capitalize">Continue with {provider}</span>
      </Button>
    </form>
  );
}
