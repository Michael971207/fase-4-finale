"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createClient } from "@/lib/supabase-client"
import { toast } from "sonner"

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAuth() {
    setLoading(true)

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error

        toast.success("Account created. You can now log in.")
        setIsRegister(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error

        router.push("/cv")
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">
          {isRegister ? "Create account" : "Login"}
        </h1>

        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          onClick={handleAuth}
          disabled={loading || !email || !password}
          className="w-full"
        >
          {loading ? "Please wait..." : isRegister ? "Register" : "Login"}
        </Button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="text-sm text-muted-foreground underline w-full"
        >
          {isRegister
            ? "Already have an account? Login"
            : "No account? Register"}
        </button>
      </Card>
    </main>
  )
}
