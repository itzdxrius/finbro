import { useState } from 'react'
import supabase from '../lib/supabaseClient'

function Register() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  async function handleSignUp() {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) console.error(error.message)
  }

  return (
    <div>
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleSignUp}>Register</button>
    </div>
  )
}

export default Register