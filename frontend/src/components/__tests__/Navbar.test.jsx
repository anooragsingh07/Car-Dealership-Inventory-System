import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navbar from '../Navbar'
import { LowStockProvider } from '../../context/LowStockContext'

vi.mock('../../api/client', () => ({
  getLowStockVehicles: vi.fn().mockResolvedValue({ count: 3, threshold: 5, vehicles: [] }),
}))

function renderNavbar({ role = 'user' } = {}) {
  return render(
    <MemoryRouter>
      <LowStockProvider>
        <Navbar user={{ name: 'Test', role }} onLogout={() => {}} />
      </LowStockProvider>
    </MemoryRouter>
  )
}

describe('Navbar low-stock badge', () => {
  beforeEach(() => vi.clearAllMocks())

  it('shows the low-stock count when low-stock vehicles exist', async () => {
    renderNavbar()
    expect(await screen.findByText(/Low stock: 3 vehicles/i)).toBeInTheDocument()
  })
})