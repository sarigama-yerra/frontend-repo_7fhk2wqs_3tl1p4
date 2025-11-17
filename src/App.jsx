import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import Officers from './components/Officers'
import Books from './components/Books'
import Students from './components/Students'
import Borrowings from './components/Borrowings'
import Reports from './components/Reports'
import Layout from './components/Layout'
import { getToken, getRole } from './lib/api'
import './index.css'

function ProtectedRoute({ children, roles }) {
  const token = getToken()
  const role = getRole()
  if (!token) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="officers" element={<ProtectedRoute roles={["admin"]}><Officers /></ProtectedRoute>} />
        <Route path="books" element={<ProtectedRoute roles={["admin","staff"]}><Books /></ProtectedRoute>} />
        <Route path="students" element={<ProtectedRoute roles={["admin","staff"]}><Students /></ProtectedRoute>} />
        <Route path="borrowings" element={<ProtectedRoute roles={["admin","staff"]}><Borrowings /></ProtectedRoute>} />
        <Route path="reports" element={<ProtectedRoute roles={["admin","staff"]}><Reports /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default function App() {
  useEffect(() => {}, [])
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
