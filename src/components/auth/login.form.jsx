'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Link from 'next/link'
import { checkPasswordStrength, PasswordInput } from '@/components/auth/password-input'
import { useSearchParams } from 'next/navigation'
import OAuthSignInButton from "@/components/auth/oauth";
import { IconBrandGithub } from "@tabler/icons-react";



export default function LoginForm({borderless, className}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams()
  const next = searchParams.get('next')
  

  function resetForm() {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false)
  }
  
  const AuthProviders = [
    {
      provider: "github",
      icon: IconBrandGithub,
    },
  ];

  let passwordScore = checkPasswordStrength(password);

  const handleEmailLogin = async(e) => {
    e.preventDefault()
    setLoading(true);
    
    if (passwordScore < 2) {
      setError("Password is too weak! Add numbers, special characters and minimum 8 digits with capital letters.");
      setLoading(false);
      return;
    }
      
    setTimeout(() => {
      resetForm()
      // Redirect or handle successful signup
    }, 1000)
  }



  return (
    <Card className={`w-full max-w-md ${borderless && "border-none shadow-none bg-background" }  max-md:border-none  max-md:shadow-none  max-md:bg-background mx-auto ${className && className}`}>
        <CardHeader className="space-y-1">
          <Link href={"/"} className='mx-auto mb-4 mt-2'>
            <Image height={60} width={60} src="/icon.svg" alt="supabase" /> 
          </Link>
          <CardTitle className="text-2xl font-bold text-center">Login to Mongobase</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred login method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {AuthProviders && (
            <>
              <div className='space-y-2'>
                {AuthProviders.map(({ provider, icon, key }) => (
                  <OAuthSignInButton
                    key={key}
                    provider={provider}
                    icon={icon}
                    redirect={next ? `/${next}` : null}
                  />
                ))}
              </div>
              <span className="flex items-center">
                <span className="h-px flex-1 bg-border"></span>
                <span className="shrink-0 text-muted-foreground text-xs px-6">Or, Continue with Email</span>
                <span className="h-px flex-1 bg-border"></span>
              </span>
            </>
          )}

          <form className='space-y-2' onSubmit={handleEmailLogin}>
            {error && <p className='text-xs text-destructive dark:text-red-500 text-center'>{error}</p>}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                passwordScore={null}
                required
              />
            </div>
            <div>
              <Button disabled={loading} type="submit" size="lg" className="w-full mt-4">
                {loading ? "Processing..." : "Login with Email"}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-muted-foreground w-full">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
    </Card>
  )
}