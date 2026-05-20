import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and confirm password must match.')
      return
    }
    const result = signup(form)
    if (!result.ok) {
      setError(result.message)
      return
    }
    navigate('/login')
  }

  return (
    <div className="page-container py-12">
      <div className="glass-card mx-auto max-w-md p-8">
        <h1 className="text-3xl font-bold text-brand-ocean">Signup</h1>
        <p className="mt-2 text-sm text-slate-500">Create your FloodRescue AI account.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-teal-100 p-3" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          <input className="w-full rounded-xl border border-teal-100 p-3" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="w-full rounded-xl border border-teal-100 p-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <input className="w-full rounded-xl border border-teal-100 p-3" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          {error && <p className="rounded-lg bg-red-100 p-2 text-sm text-red-700">{error}</p>}
          <button className="w-full rounded-xl bg-brand-teal p-3 font-semibold text-white">Create Account</button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link className="font-semibold text-brand-ocean" to="/login">Login</Link></p>
      </div>
    </div>
  )
}