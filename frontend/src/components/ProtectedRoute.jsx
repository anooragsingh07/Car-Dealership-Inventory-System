import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ user, adminOnly, children }) {
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
