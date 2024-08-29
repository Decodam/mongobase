import { loginWithOAuth } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";



export const OAuthProviders = [
  {
    provider: "google",
    icon: IconBrandGoogle,
  },
  {
    provider: "github",
    icon: IconBrandGithub,
  },
];


export default function OAuthSignInButton({ provider, icon: Icon, redirect, className }) {
  return (
    <form
      action={() => {loginWithOAuth(provider, redirect)}}
    >
      <Button className={["w-full", className]} variant="outline" size="lg" type="submit">
        {Icon && <Icon className="mr-1" size={20} />}
        <span className="capitalize">Continue with {provider}</span>
      </Button>
    </form>
  );
}
