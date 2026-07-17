import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { signUp } from '@/lib/auth'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState<boolean>(false)

  async function handleRegister() {
    setSubmitting(true)
    setError(null)
    setStatus(null)

    try {
      const data = await signUp(email, password, name)
      if (data.session) {
        navigate("/dashboard")
      } else {
        setStatus("Account created. Check your email to confirm before logging in.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Card className="w-96 space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-primary">FinBro</h1>
          <p className="text-sm text-muted-foreground">Finance Budgeting</p>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Register</h2>
          <p className="text-sm text-muted-foreground">
            Experience the best wealth management.
          </p>
        </div>

        <div className="space-y-4">
          <Input type="text" placeholder="Name" className="h-10" value={name} onChange={(e)=>setName(e.target.value)}/>
          <Input type="email" placeholder="Email Address" className="h-10" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <Input type="password" placeholder="Password" className="h-10" value={password} onChange={(e)=>setPassword(e.target.value)}/>
        </div>

        <Button onClick={handleRegister} disabled={submitting} className="h-10 w-full">
          {submitting ? "Registering..." : "Register"}
        </Button>

        <p className="text-center text-sm">
         Already have an account?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
          </Link>
        </p>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {status && <p className="text-sm text-muted-foreground">{status}</p>}

      </Card>

    </div>
  )
}

export default Register