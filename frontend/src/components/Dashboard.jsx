import { useEffect, useState } from 'react';
import * as api from '../api/client';
import VehicleCard from './VehicleCard';
import SearchBar from './SearchBar';

export default function Dashboard({ user, onLogout }) {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');

  async function fetchVehicles(params = {}) {
    try {
      setError('');
      const data = Object.keys(params).length > 0
        ? await api.searchVehicles(params, user.token)
        : await api.getVehicles(user.token);
      setVehicles(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => { fetchVehicles(); }, []);

  async function handlePurchase(id) {
    try {
      await api.purchaseVehicle(id, user.token);
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteVehicle(id, user.token);
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleUpdate(id, body) {
    try {
      await api.updateVehicle(id, body, user.token);
      fetchVehicles();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-ink text-2xl font-bold">Inventory</h1>
        <div className="flex items-center gap-4">
          <span className="text-steel text-sm">{user.email} ({user.role})</span>
          <button onClick={onLogout} className="text-steel text-sm hover:text-rust">Logout</button>
        </div>
      </div>

      {user.role === 'admin' && <AdminPanel user={user} onDone={fetchVehicles} />}

      <SearchBar onSearch={fetchVehicles} />

      {error && <p className="text-rust mb-3 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map(v => (
          <VehicleCard
            key={v.id}
            vehicle={v}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      {vehicles.length === 0 && !error && (
        <p className="text-steel text-center mt-8">No vehicles found.</p>
      )}
    </div>
  );
}

function AdminPanel({ user, onDone }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!make || !model || !category || !price || !quantity) {
      setError('All fields are required'); return;
    }
    try {
      await api.createVehicle({ make, model, category, price: Number(price), quantity: Number(quantity) }, user.token);
      setMake(''); setModel(''); setCategory(''); setPrice(''); setQuantity('');
      onDone();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mb-6 p-4 bg-paper border border-brass/30 rounded-lg">
      <h2 className="text-ink font-bold mb-3">Admin — Add Vehicle</h2>
      {error && <p className="text-rust text-sm mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2">
        <input className="p-2 border border-steel/30 rounded text-sm flex-1 min-w-[100px]" placeholder="Make" value={make} onChange={e => setMake(e.target.value)} />
        <input className="p-2 border border-steel/30 rounded text-sm flex-1 min-w-[100px]" placeholder="Model" value={model} onChange={e => setModel(e.target.value)} />
        <input className="p-2 border border-steel/30 rounded text-sm flex-1 min-w-[100px]" placeholder="Category" value={category} onChange={e => setCategory(e.target.value)} />
        <input className="p-2 border border-steel/30 rounded text-sm w-24" placeholder="Price" type="number" min="0" value={price} onChange={e => setPrice(e.target.value)} />
        <input className="p-2 border border-steel/30 rounded text-sm w-24" placeholder="Qty" type="number" min="0" value={quantity} onChange={e => setQuantity(e.target.value)} />
        <button className="bg-brass text-white px-4 py-2 rounded text-sm font-semibold hover:brightness-110">Add</button>
      </form>
    </div>
  );
}
