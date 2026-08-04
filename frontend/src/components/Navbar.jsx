import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLowStock } from '../context/LowStockContext'

export default function Navbar({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { count } = useLowStock()

  const lowStockLabel = count === 1 ? 'vehicle' : 'vehicles'

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
            {count > 0 && (
              <Link to="/"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Low stock: {count} {lowStockLabel}
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
            {count > 0 && (
              <Link to="/" onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-amber-300">
                Low stock: {count} {lowStockLabel}
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
