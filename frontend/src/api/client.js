const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

export function register(name, email, password) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  })
}

export function getVehicles() {
  return request('/vehicles')
}

export function searchVehicles(params) {
  const q = new URLSearchParams(params).toString()
  return request(`/vehicles/search?${q}`)
}

export function createVehicle(data) {
  return request('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export function updateVehicle(id, data) {
  return request(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export function deleteVehicle(id) {
  return request(`/vehicles/${id}`, { method: 'DELETE' })
}

export function purchaseVehicle(id) {
  return request(`/vehicles/${id}/purchase`, { method: 'POST' })
}

export function restockVehicle(id, amount) {
  return request(`/vehicles/${id}/restock`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  })
}

export function getLowStockVehicles() {
  return request('/vehicles/low-stock')
}

export function getLowStockThreshold() {
  return request('/settings/low-stock-threshold')
}

export function setLowStockThreshold(threshold) {
  return request('/settings/low-stock-threshold', {
    method: 'PUT',
    body: JSON.stringify({ threshold })
  })
}
