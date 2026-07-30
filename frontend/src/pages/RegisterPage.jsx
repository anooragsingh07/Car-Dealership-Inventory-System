import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register, user } = useAuth()

  if (user) {
    navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await register(name, email, password)
      navigate(data.user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Car Dealership</h1>
          <p className="text-gray-500 mt-1 text-sm">Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-4 border border-red-200">{error}</div>
          )}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input id="name" placeholder="John Doe" value={name}
              onChange={e => setName(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={email}
              onChange={e => setEmail(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          </div>
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input id="password" type="password" placeholder="Create a password" value={password}
              onChange={e => setPassword(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          </div>
          <button type="submit"
            className="bg-gray-900 text-white font-medium text-sm px-4 py-2.5 rounded-md w-full hover:bg-gray-800 transition">
            Create account
          </button>
          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account? <Link to="/login" className="font-medium text-gray-900 hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
