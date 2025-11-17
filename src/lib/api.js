const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export function getToken() {
  return localStorage.getItem('token') || ''
}

export function getRole() {
  return localStorage.getItem('role') || ''
}

export function getName() {
  return localStorage.getItem('name') || ''
}

export function setSession({ token, role, name }) {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
  localStorage.setItem('name', name)
}

export function clearSession() {
  const token = getToken()
  fetch(`${API_BASE}/auth/logout`, { method: 'POST', headers: { 'X-Auth-Token': token } }).catch(() => {})
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('name')
}

async function request(path, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers['X-Auth-Token'] = token
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    let detail = 'Request failed'
    try { const d = await res.json(); detail = d.detail || JSON.stringify(d) } catch {}
    throw new Error(detail)
  }
  try { return await res.json() } catch { return null }
}

export const api = {
  base: API_BASE,
  login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  stats: () => request('/stats'),
  officers: {
    list: () => request('/officers'),
    create: (data) => request('/officers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/officers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id) => request(`/officers/${id}`, { method: 'DELETE' }),
  },
  books: {
    list: () => request('/books'),
    create: (data) => request('/books', { method: 'POST', body: JSON.stringify(data) }),
    update: (book_id, data) => request(`/books/${book_id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (book_id) => request(`/books/${book_id}`, { method: 'DELETE' }),
  },
  students: {
    list: () => request('/students'),
    create: (data) => request('/students', { method: 'POST', body: JSON.stringify(data) }),
    update: (nisn, data) => request(`/students/${nisn}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (nisn) => request(`/students/${nisn}`, { method: 'DELETE' }),
  },
  borrowings: {
    list: () => request('/borrowings'),
    create: (data) => request('/borrowings', { method: 'POST', body: JSON.stringify(data) }),
    return: (borrowing_id) => request(`/borrowings/${borrowing_id}/return`, { method: 'POST' }),
    remove: (borrowing_id) => request(`/borrowings/${borrowing_id}`, { method: 'DELETE' }),
  },
  reports: {
    books: () => request('/reports/books', { method: 'POST' }),
    students: () => request('/reports/students', { method: 'POST' }),
    borrowings: (filters) => request('/reports/borrowings', { method: 'POST', body: JSON.stringify(filters || {}) }),
    returns: (filters) => request('/reports/returns', { method: 'POST', body: JSON.stringify(filters || {}) }),
  }
}
