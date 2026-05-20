import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    const result = login(form)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate(location.state?.from || '/dashboard')
  }

  return (
    <div className="page-container py-12">
      <div className="glass-card mx-auto max-w-md p-8">
        <h1 className="text-3xl font-bold text-brand-ocean">Login</h1>
        <p className="mt-2 text-sm text-slate-500">Welcome back to FloodRescue AI.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-teal-100 p-3" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-xl border border-teal-100 p-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <p className="rounded-lg bg-red-100 p-2 text-sm text-red-700">{error}</p>}
          <button className="w-full rounded-xl bg-brand-teal p-3 font-semibold text-white">Login</button>
        </form>
        <p className="mt-4 text-sm">Don&apos;t have an account? <Link className="font-semibold text-brand-ocean" to="/signup">Sign up</Link></p>
      </div>
    </div>
  )
}