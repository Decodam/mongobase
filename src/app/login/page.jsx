import LoginForm from "@/components/auth/login.form";
import OAuthSignInButton from "@/components/auth/oauth";
import { IconBrandGithub } from "@tabler/icons-react";



export default function LoginPage() {
  const AuthProviders = [
    <OAuthSignInButton provider={"github"} icon={IconBrandGithub} key={1} />,
  ]


  return(
    <div className="min-h-svh py-8 md:py-16 px-4 flex justify-center items-center">
      <LoginForm AuthProviders={AuthProviders} />
    </div>
  );
}