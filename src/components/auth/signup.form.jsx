'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Link from 'next/link'
import { checkPasswordStrength, PasswordInput } from '@/components/auth/password-input'
import OAuthSignInButton from "@/components/auth/oauth";
import { useSearchParams } from 'next/navigation';
import { AuthProviders } from '@/components/auth/providers';

export default function SignupForm({borderless, className}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const next = searchParams.get('next')

  function resetForm() {
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setLoading(false)
  }

  let passwordScore = checkPasswordStrength(password)

  const handleSignup = async(e) => {
    e.preventDefault()
    setLoading(true)

    if (passwordScore < 2) {
      setError("Password is too weak! Add numbers, special characters, and a minimum of 8 characters with capital letters.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }

    // Simulate a signup process
    // Replace with actual signup logic (e.g., API call)
    setTimeout(() => {
      resetForm()
      // Redirect or handle successful signup
    }, 1000)
  }

  return (
    <Card className={`w-full max-w-md ${borderless && "border-none shadow-none bg-background"} max-md:border-none max-md:shadow-none max-md:bg-background mx-auto ${className && className}`}>
      <CardHeader className="space-y-1">
        <Link href={"/"} className='mx-auto mb-4 mt-2'>
          <Image height={60} width={60} src="/icon.svg" alt="supabase" /> 
        </Link>
        <CardTitle className="text-2xl font-bold text-center">Create your Account</CardTitle>
        <CardDescription className="text-center">
          Fill in the details to create your Mongobase Account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form className='space-y-2' onSubmit={handleSignup}>
          {error && <p className='text-xs text-destructive dark:text-red-500 text-center'>{error}</p>}
          <div className="space-y-1">
            <Label htmlFor="full-name">Full Name</Label>
            <Input 
              id="full-name" 
              type="text" 
              placeholder="John Doe" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>
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
              passwordScore={passwordScore}
              required 
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="Confirm your password" 
              value={confirmPassword}
              passwordScore={null}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required 
            />
          </div>
          <div>
            <Button disabled={loading} type="submit" size="lg" className="w-full mt-4">
              {loading ? "Processing..." : "Create Account"}
            </Button>
          </div>
        </form>
        {AuthProviders && (
          <>
            <span className="flex items-center">
              <span className="h-px flex-1 bg-border"></span>
              <span className="shrink-0 text-muted-foreground text-xs px-6">Or, Create account using</span>
              <span className="h-px flex-1 bg-border"></span>
            </span>
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
          </>
        )}
        <div className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Login
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
