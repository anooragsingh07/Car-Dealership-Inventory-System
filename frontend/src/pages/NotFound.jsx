import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-200 mb-2">404</h1>
        <p className="text-gray-500 mb-6">Page not found</p>
        <Link to="/" className="inline-block bg-gray-900 text-white px-5 py-2.5 rounded-md hover:bg-gray-800 transition text-sm font-medium">
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
