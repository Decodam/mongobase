import SignupForm from "@/components/auth/signup.form";
import { Suspense } from "react";


export default function LoginPage() {
  return(
    <Suspense fallback={null}>
      <div className="min-h-svh py-8 md:py-16 px-4 flex justify-center items-center">
        <SignupForm />
      </div>
    </Suspense>
  );
}