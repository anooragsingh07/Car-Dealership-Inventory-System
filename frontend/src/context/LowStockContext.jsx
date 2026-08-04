import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getLowStockVehicles } from '../api/client'

const LowStockContext = createContext(null)

export function LowStockProvider({ children }) {
  const [count, setCount] = useState(0)
  const [threshold, setThreshold] = useState(5)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await getLowStockVehicles()
      setCount(data.count)
      setThreshold(data.threshold)
    } catch {
      setCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <LowStockContext.Provider value={{ count, threshold, loading, refresh }}>
      {children}
    </LowStockContext.Provider>
  )
}

export function useLowStock() {
  const context = useContext(LowStockContext)
  if (!context) throw new Error('useLowStock must be used within LowStockProvider')
  return context
}
