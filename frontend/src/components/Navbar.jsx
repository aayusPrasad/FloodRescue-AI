import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/drone-survey', label: 'Drone Survey' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/flood-map', label: 'Flood Map' },
  { to: '/about', label: 'About' },
  { to: '/safety-tips', label: 'Safety Tips' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/40 bg-white/70 backdrop-blur-lg">
      <nav className="page-container flex h-16 items-center justify-between">
        <Link to="/" className="text-xl font-bold text-brand-ocean">FloodRescue AI</Link>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="menu">
          <span className="text-2xl text-brand-ocean">☰</span>
        </button>
        <ul className="hidden gap-2 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-teal text-white' : 'text-slate-700 hover:bg-teal-50 hover:text-brand-ocean'}`}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {open && (
        <ul className="page-container pb-4 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-teal-50">
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
