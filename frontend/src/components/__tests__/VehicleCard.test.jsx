import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '../VehicleCard';

describe('VehicleCard', () => {
  const vehicle = {
    id: 1,
    make: 'Toyota',
    model: 'Camry',
    category: 'Sedan',
    price: 25000,
    quantity: 3,
  };

  it('enables the Purchase button when quantity > 0', () => {
    render(<VehicleCard vehicle={vehicle} onPurchase={() => {}} />);
    expect(screen.getByRole('button', { name: /purchase/i })).toBeEnabled();
  });

  it('disables the Purchase button when quantity is 0', () => {
    render(<VehicleCard vehicle={{ ...vehicle, quantity: 0 }} onPurchase={() => {}} />);
    expect(screen.getByRole('button', { name: /purchase/i })).toBeDisabled();
  });

  it('calls onPurchase with the vehicle id when clicked', async () => {
    const onPurchase = vi.fn();
    render(<VehicleCard vehicle={vehicle} onPurchase={onPurchase} />);
    await userEvent.click(screen.getByRole('button', { name: /purchase/i }));
    expect(onPurchase).toHaveBeenCalledWith(1);
  });

  it('shows a Low stock badge when low_stock is true and quantity > 0', () => {
    render(<VehicleCard vehicle={{ ...vehicle, quantity: 2, low_stock: true }} onPurchase={() => {}} />);
    expect(screen.getByText('Low stock')).toBeInTheDocument();
  });

  it('does not show a Low stock badge when low_stock is false', () => {
    render(<VehicleCard vehicle={{ ...vehicle, low_stock: false }} onPurchase={() => {}} />);
    expect(screen.queryByText('Low stock')).not.toBeInTheDocument();
  });

  it('does not show a Low stock badge when the vehicle is out of stock', () => {
    render(<VehicleCard vehicle={{ ...vehicle, quantity: 0, low_stock: true }} onPurchase={() => {}} />);
    expect(screen.queryByText('Low stock')).not.toBeInTheDocument();
  });
});
