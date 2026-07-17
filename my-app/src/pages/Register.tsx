import { useState, type SubmitEvent } from 'react'
import { supabase } from '../lib/supabase'

function Register() {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  async function handleSignUp(e: SubmitEvent) {
    e.preventDefault()
    setSubmitting(true)
    setStatus('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })

    setSubmitting(false)

    if (error) {
      setStatus(error.message)
      return
    }

    if (data.session) {
      setStatus('Account created — you are logged in.')
    } else {
      setStatus('Account created. Check your email to confirm before logging in.')
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  )
}

export default Register