"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import LoginForm from "@/components/auth/login-form"
import SignupForm from "@/components/auth/signup-form"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/2 w-full h-full bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 -right-1/2 w-full h-full bg-gradient-to-l from-accent/20 to-transparent rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header with back button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="p-2 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-primary mb-2">
              <span className="text-xl font-bold text-white">✈</span>
            </div>
            <h1 className="text-sm font-bold text-foreground tracking-tight">TripMind</h1>
          </div>
          <div className="w-9" /> {/* Spacer for alignment */}
        </div>

        {/* Auth forms */}
        {isLogin ? (
          <>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              {"Don't have an account? "}
              <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-semibold">
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <SignupForm />
            <p className="text-center text-sm text-muted-foreground mt-6">
              Already have an account?{" "}
              <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-semibold">
                Log in
              </button>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
