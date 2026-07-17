import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <Card className="w-96 space-y-6 p-8">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-primary">FinBro</h1>
          <p className="text-sm text-muted-foreground">Finance Budgeting</p>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Log in</h2>
          <p className="text-sm text-muted-foreground">
            Experience the best wealth management.
          </p>
        </div>

        <div className="space-y-4">
          <Input type="email" placeholder="Email Address" className="h-10" />
          <Input type="password" placeholder="Password" className="h-10" />
        </div>

        <Button className="h-10 w-full">Log in</Button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs tracking-widest text-muted-foreground">OR</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="text-center text-sm">
          No account?{" "}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Register
          </Link>
        </p>
      </Card>

    </div>
  )
}
