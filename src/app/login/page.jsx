import { RedirectOnAuthenticated } from "@/components/auth/session";
import LoginForm from "@/components/auth/login.form";



export default function LoginPage() {
  return(
    <RedirectOnAuthenticated>
      <div className="min-h-svh py-8 md:py-16 px-4 flex justify-center items-center">
        <LoginForm />
      </div>
    </RedirectOnAuthenticated>
  );
}