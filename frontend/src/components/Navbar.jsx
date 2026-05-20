import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const publicLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/safety-tips', label: 'Safety Tips' },
]

const protectedLinks = [
  { to: '/analyze', label: 'Analyze' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/drone-survey', label: 'Drone Survey' },
  { to: '/flood-map', label: 'Flood Map' },
  { to: '/impact-3d', label: '3D Impact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const links = isAuthenticated ? [...publicLinks, ...protectedLinks] : publicLinks

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-lg">
      <nav className="page-container flex h-16 items-center justify-between gap-3">
        <Link to="/" className="text-xl font-bold text-brand-ocean">FloodRescue AI</Link>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="menu">
          <span className="text-2xl text-brand-ocean">☰</span>
        </button>
        <ul className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-teal text-white' : 'text-slate-700 hover:bg-teal-50 hover:text-brand-ocean'}`}>
                {link.label}
              </NavLink>
            </li>
          ))}
          {!isAuthenticated ? (
            <>
              <li><NavLink to="/login" className="rounded-full border border-brand-ocean px-4 py-2 text-sm font-medium text-brand-ocean">Login</NavLink></li>
              <li><NavLink to="/signup" className="rounded-full bg-brand-teal px-4 py-2 text-sm font-medium text-white">Signup</NavLink></li>
            </>
          ) : (
            <li className="flex items-center gap-2 pl-2">
              <span className="text-sm font-semibold text-brand-ocean">{user?.fullName}</span>
              <button onClick={logout} className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700">Logout</button>
            </li>
          )}
        </ul>
      </nav>
      {open && (
        <ul className="page-container space-y-1 pb-4 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-teal-50">{link.label}</NavLink>
            </li>
          ))}
          {!isAuthenticated ? (
            <>
              <li><NavLink to="/login" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-teal-50">Login</NavLink></li>
              <li><NavLink to="/signup" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-teal-50">Signup</NavLink></li>
            </>
          ) : (
            <li className="px-3 py-2">
              <p className="text-sm font-semibold text-brand-ocean">{user?.fullName}</p>
              <button onClick={() => { logout(); setOpen(false) }} className="mt-2 rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700">Logout</button>
            </li>
          )}
        </ul>
      )}
    </header>
  )
}
