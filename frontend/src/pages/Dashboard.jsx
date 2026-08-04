import { useState, useEffect } from 'react'
import { getVehicles, searchVehicles, purchaseVehicle } from '../api/client'
import { useLowStock } from '../context/LowStockContext'

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ make: '', model: '', category: '', minPrice: '', maxPrice: '' })
  const { refresh } = useLowStock()

  useEffect(() => {
    getVehicles().then(data => { setVehicles(data.vehicles); setLoading(false) })
  }, [])

  function handleChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  async function handleSearch(e) {
    e.preventDefault()
    const params = {}
    for (const [key, value] of Object.entries(filters)) {
      if (value) params[key] = value
    }
    if (Object.keys(params).length === 0) {
      const data = await getVehicles()
      setVehicles(data.vehicles)
    } else {
      const data = await searchVehicles(params)
      setVehicles(data.vehicles)
    }
  }

  async function handleClear() {
    setFilters({ make: '', model: '', category: '', minPrice: '', maxPrice: '' })
    const data = await getVehicles()
    setVehicles(data.vehicles)
  }

  async function handlePurchase(id) {
    const data = await purchaseVehicle(id)
    setVehicles(prev => prev.map(v => (v.id === id ? data.vehicle : v)))
    refresh()
  }

  function formatPrice(price) {
    return `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Inventory</h1>
        {!loading && <span className="text-sm text-gray-500">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</span>}
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-wrap gap-2">
          <input name="make" placeholder="Make" value={filters.make} onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-28 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="model" placeholder="Model" value={filters.model} onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-28 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="category" placeholder="Category" value={filters.category} onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-28 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="minPrice" placeholder="Min ₹" value={filters.minPrice} onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-24 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="maxPrice" placeholder="Max ₹" value={filters.maxPrice} onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 w-24 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <button type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
            Search
          </button>
          <button type="button" onClick={handleClear}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition">
            Clear
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-400 text-center py-16 text-sm">Loading...</p>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-900 font-medium">No vehicles found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {vehicles.map(v => (
            <div key={v.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex flex-col">
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h2 className="font-semibold text-gray-900">{v.make}</h2>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{v.category}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">{v.model}</p>
                {v.low_stock && v.quantity > 0 && (
                  <p className="text-xs font-medium text-amber-700 mb-1">Low stock</p>
                )}
                <p className="text-lg font-semibold text-gray-900">{formatPrice(v.price)}</p>
                <p className="text-sm text-gray-500 mt-1">Quantity: {v.quantity}</p>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handlePurchase(v.id)}
                  disabled={v.quantity === 0}
                  className="w-full bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {v.quantity === 0 ? 'Out of Stock' : 'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
