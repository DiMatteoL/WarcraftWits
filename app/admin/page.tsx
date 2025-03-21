"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { ModeToggle } from "@/components/mode-toggle"

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already authenticated
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
      setLoading(false)

      // Set up auth state listener
      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }

    checkUser()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary font-bold text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <Image src="/wow-logo.png" alt="WoW Logo" width={32} height={32} className="object-contain" />
            <span>WoW Memory Game</span>
          </Link>
          <ModeToggle />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {user ? (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center text-primary">Authentication Success</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-6 bg-muted rounded-md text-center">
                  <p className="text-2xl font-bold text-primary mb-2">Success!</p>
                  <p className="text-muted-foreground mb-4">You are authenticated as {user.email}</p>
                </div>
                <Button onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          ) : (
            <LoginForm />
          )}
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            Admin access only. Return to{" "}
            <Link href="/" className="text-primary hover:underline">
              main site
            </Link>
            .
          </p>
        </div>
      </footer>
    </div>
  )
}

