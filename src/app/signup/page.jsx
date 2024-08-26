import OAuthSignInButton from "@/components/auth/oauth";
import SignupForm from "@/components/auth/signup.form";
import { IconBrandGithub } from "@tabler/icons-react";



export default function LoginPage() {
  const AuthProviders = [
    <OAuthSignInButton provider={"github"} icon={IconBrandGithub} key={1} />,
  ]


  return(
    <div className="min-h-svh py-8 md:py-16 px-4 flex justify-center items-center">
      <SignupForm AuthProviders={AuthProviders} />
    </div>
  );
}