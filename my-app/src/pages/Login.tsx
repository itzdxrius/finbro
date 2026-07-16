import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-96 p-6 space-y-4">
        <h1 className="text-xl font-semibold">Login</h1>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full border rounded p-2"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border rounded p-2"
          />
        </div>

        <Button className="w-full">Log in</Button>

        <p className="text-sm text-center">
          No account?{" "}
          <a href="/register" className="underline">
            Go register
          </a>
        </p>
      </Card>
    </div>
  )
}