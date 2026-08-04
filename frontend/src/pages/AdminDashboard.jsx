import { useState, useEffect } from 'react'
import { getVehicles, createVehicle, updateVehicle, deleteVehicle, restockVehicle, setLowStockThreshold, getLowStockThreshold } from '../api/client'
import { useLowStock } from '../context/LowStockContext'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [newVehicle, setNewVehicle] = useState({ make: '', model: '', category: '', price: '', quantity: '' })
  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({})
  const [restockAmounts, setRestockAmounts] = useState({})
  const [threshold, setThreshold] = useState('')
  const [filter, setFilter] = useState('all')
  const { refresh } = useLowStock()

  const DEFAULT_THRESHOLD = 5

  const lowStockCount = vehicles.filter(v => v.low_stock).length
  const visibleVehicles = filter === 'low' ? vehicles.filter(v => v.low_stock) : vehicles

  useEffect(() => {
    getVehicles().then(data => { setVehicles(data.vehicles); setLoading(false) })
    getLowStockThreshold().then(data => setThreshold(String(data.threshold))).catch(() => {})
  }, [])

  function handleNewChange(e) {
    setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value })
  }

  async function handleAdd(e) {
    e.preventDefault()
    const data = await createVehicle(newVehicle)
    setVehicles(prev => [data.vehicle, ...prev])
    setNewVehicle({ make: '', model: '', category: '', price: '', quantity: '' })
    refresh()
  }

  function startEdit(v) {
    setEditId(v.id)
    setEditData({ make: v.make, model: v.model, category: v.category, price: v.price, quantity: v.quantity })
  }

  function handleEditChange(e) {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  async function handleSave(id) {
    const data = await updateVehicle(id, editData)
    setVehicles(prev => prev.map(v => (v.id === id ? data.vehicle : v)))
    setEditId(null)
    refresh()
  }

  async function handleDelete(id) {
    await deleteVehicle(id)
    setVehicles(prev => prev.filter(v => v.id !== id))
    refresh()
  }

  async function handleRestock(id) {
    const amount = restockAmounts[id]
    if (!amount || Number(amount) <= 0) return
    const data = await restockVehicle(id, Number(amount))
    setVehicles(prev => prev.map(v => (v.id === id ? data.vehicle : v)))
    setRestockAmounts(prev => ({ ...prev, [id]: '' }))
    refresh()
  }

  async function handleThresholdSave() {
    const value = Number(threshold)
    if (!Number.isInteger(value) || value <= 0) return
    const data = await setLowStockThreshold(value)
    setThreshold(String(data.threshold))
    refresh()
  }

  function formatPrice(price) {
    return `₹${Number(price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
        {!loading && <span className="text-sm text-gray-500">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</span>}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-wrap items-end gap-2">
        <div>
          <label htmlFor="threshold" className="block text-sm font-semibold text-gray-700 mb-1">Low Stock Threshold</label>
          <input id="threshold" type="number" min="1" placeholder={String(DEFAULT_THRESHOLD)}
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
        </div>
        <button onClick={handleThresholdSave}
          className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
          Save threshold
        </button>
        <p className="text-xs text-gray-500 w-full mt-1">Vehicles with quantity at or below this limit are flagged as low stock.</p>
      </div>

      <form onSubmit={handleAdd} className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Add Vehicle</h2>
        <div className="flex flex-wrap gap-2">
          <input name="make" placeholder="e.g. Toyota" value={newVehicle.make} onChange={handleNewChange}
            className="flex-1 min-w-[100px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="model" placeholder="e.g. Camry" value={newVehicle.model} onChange={handleNewChange}
            className="flex-1 min-w-[100px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="category" placeholder="e.g. Sedan" value={newVehicle.category} onChange={handleNewChange}
            className="flex-1 min-w-[100px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="price" placeholder="e.g. 25000" value={newVehicle.price} onChange={handleNewChange}
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <input name="quantity" placeholder="e.g. 5" value={newVehicle.quantity} onChange={handleNewChange}
            className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
          <button type="submit"
            className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition">
            Add
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-400 text-center py-16 text-sm">Loading...</p>
      ) : vehicles.length === 0 ? (
        <p className="text-gray-500 text-center py-16 text-sm">No vehicles added yet.</p>
      ) : (
        <>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}>
              All Vehicles
            </button>
            <button
              onClick={() => setFilter('low')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === 'low'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
              }`}>
              Low Stock ({lowStockCount})
            </button>
          </div>

          {visibleVehicles.length === 0 ? (
            <p className="text-gray-500 text-center py-16 text-sm">No low-stock vehicles right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {visibleVehicles.map(v => (
            <div key={v.id} className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors flex flex-col">
              <div className="p-4 flex-1">
                {editId === v.id ? (
                  <div className="space-y-2">
                    <input name="make" value={editData.make} onChange={handleEditChange}
                      className="border border-gray-300 rounded-md px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
                    <input name="model" value={editData.model} onChange={handleEditChange}
                      className="border border-gray-300 rounded-md px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
                    <input name="category" value={editData.category} onChange={handleEditChange}
                      className="border border-gray-300 rounded-md px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
                    <input name="price" value={editData.price} onChange={handleEditChange}
                      className="border border-gray-300 rounded-md px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
                    <input name="quantity" value={editData.quantity} onChange={handleEditChange}
                      className="border border-gray-300 rounded-md px-3 py-1.5 w-full text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>

              <div className="px-4 pb-4 space-y-2">
                {editId === v.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleSave(v.id)}
                      className="flex-1 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition">Save</button>
                    <button onClick={() => setEditId(null)}
                      className="flex-1 bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-300 transition">Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(v)}
                        className="flex-1 bg-gray-900 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-gray-800 transition">Edit</button>
                      <button onClick={() => handleDelete(v.id)}
                        className="flex-1 bg-red-600 text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-red-700 transition">Delete</button>
                    </div>
                    <div className="flex gap-2">
                      <input placeholder="Qty"
                        value={restockAmounts[v.id] || ''}
                        onChange={e => setRestockAmounts(prev => ({ ...prev, [v.id]: e.target.value }))}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none focus:border-gray-900 transition" />
                      <button onClick={() => handleRestock(v.id)}
                        className="bg-gray-900 text-white text-sm font-medium px-4 py-1.5 rounded-md hover:bg-gray-800 transition">Restock</button>
                    </div>
                  </>
                )}
              </div>
            </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
