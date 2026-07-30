import { useState } from 'react';
import * as api from '../api/client';

export default function RegisterForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required'); return; }
    try {
      const data = await api.register(email, password);
      const user = { id: data.id, email: data.email, role: data.role, token: data.token };
      onLogin(user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-paper border border-steel/20 rounded-lg">
      <h2 className="text-ink text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-rust mb-3 text-sm">{error}</p>}
      <input className="w-full mb-3 p-2 border border-steel/30 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="w-full mb-3 p-2 border border-steel/30 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="w-full bg-brass text-white py-2 rounded font-semibold hover:brightness-110">Register</button>
    </form>
  );
}
