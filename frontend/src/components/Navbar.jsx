import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <nav className="bg-gray-900 shadow-lg px-4 sm:px-6 py-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="font-semibold text-base text-white tracking-tight">Car Dealership</Link>
          <button onClick={() => setOpen(!open)} className="sm:hidden text-gray-400 hover:text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/"
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${location.pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
              Inventory
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${location.pathname === '/admin' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}>
                Admin
              </Link>
            )}
            <div className="ml-4 pl-4 border-l border-gray-700 flex items-center gap-3">
              <span className="text-sm text-gray-400">{user?.name}</span>
              <button onClick={onLogout} className="text-sm text-gray-400 hover:text-white transition-colors">Logout</button>
            </div>
          </div>
        </div>
        {open && (
          <div className="sm:hidden pb-3 space-y-1">
            <Link to="/" onClick={() => setOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              Inventory
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/admin' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
                Admin
              </Link>
            )}
            <div className="pt-2 mt-2 border-t border-gray-700">
              <span className="block px-3 py-2 text-sm text-gray-400">{user?.name}</span>
              <button onClick={() => { setOpen(false); onLogout() }} className="block w-full text-left px-3 py-2 text-sm text-gray-400 hover:text-white">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
