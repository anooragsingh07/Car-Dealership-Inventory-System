const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method, body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method: method || 'GET',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export function register(email, password) {
  return request('/auth/register', { method: 'POST', body: { email, password } });
}

export function login(email, password) {
  return request('/auth/login', { method: 'POST', body: { email, password } });
}

export function getVehicles(token) {
  return request('/vehicles', { token });
}

export function searchVehicles(params, token) {
  const q = new URLSearchParams(params).toString();
  return request(`/vehicles/search?${q}`, { token });
}

export function createVehicle(body, token) {
  return request('/vehicles', { method: 'POST', body, token });
}

export function updateVehicle(id, body, token) {
  return request(`/vehicles/${id}`, { method: 'PUT', body, token });
}

export function deleteVehicle(id, token) {
  return request(`/vehicles/${id}`, { method: 'DELETE', token });
}

export function purchaseVehicle(id, token) {
  return request(`/vehicles/${id}/purchase`, { method: 'POST', token });
}

export function restockVehicle(id, amount, token) {
  return request(`/vehicles/${id}/restock`, { method: 'POST', body: { amount }, token });
}
