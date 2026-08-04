import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminDashboard from '../AdminDashboard'
import { LowStockProvider } from '../../context/LowStockContext'

vi.mock('../../api/client', () => ({
  getVehicles: vi.fn().mockResolvedValue({
    vehicles: [
      { id: 1, make: 'Toyota', model: 'Camry', category: 'Sedan', price: 25000, quantity: 3, low_stock: true },
      { id: 2, make: 'Honda', model: 'Civic', category: 'Sedan', price: 22000, quantity: 10, low_stock: false },
    ],
  }),
  getLowStockThreshold: vi.fn().mockResolvedValue({ threshold: 5 }),
  getLowStockVehicles: vi.fn().mockResolvedValue({ count: 1, threshold: 5, vehicles: [] }),
  createVehicle: vi.fn(),
  updateVehicle: vi.fn(),
  deleteVehicle: vi.fn(),
  restockVehicle: vi.fn(),
  setLowStockThreshold: vi.fn(),
}))

function renderAdminDashboard() {
  return render(
    <LowStockProvider>
      <AdminDashboard />
    </LowStockProvider>
  )
}

describe('AdminDashboard low-stock filter', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows both filter buttons with the correct low-stock count', async () => {
    renderAdminDashboard()
    expect(await screen.findByText('All Vehicles')).toBeInTheDocument()
    const lowStockButton = screen.getByRole('button', { name: /Low Stock/ })
    expect(lowStockButton).toHaveTextContent('Low Stock (1)')
  })

  it('shows only low-stock vehicles when the Low Stock filter is active', async () => {
    renderAdminDashboard()
    await screen.findByText('All Vehicles')
    await userEvent.click(screen.getByRole('button', { name: /Low Stock/ }))
    expect(screen.getByText('Toyota')).toBeInTheDocument()
    expect(screen.queryByText('Honda')).not.toBeInTheDocument()
  })

  it('saves the threshold when changed', async () => {
    const { setLowStockThreshold } = await import('../../api/client')
    setLowStockThreshold.mockResolvedValue({ threshold: 3 })
    renderAdminDashboard()
    const input = await screen.findByLabelText('Low Stock Threshold')
    await userEvent.clear(input)
    await userEvent.type(input, '3')
    await userEvent.click(screen.getByRole('button', { name: /Save threshold/i }))
    expect(setLowStockThreshold).toHaveBeenCalledWith(3)
  })
})