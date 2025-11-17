import { useEffect, useState } from 'react'
import { api } from '../lib/api'

const Card = ({ title, value }) => (
  <div className="bg-white rounded-lg shadow p-6 border">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-3xl font-semibold text-emerald-700 mt-2">{value}</div>
  </div>
)

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.stats().then(setStats).catch(err => setError(err.message))
  }, [])

  if (error) return <div className="text-red-600">{error}</div>
  if (!stats) return <div>Loading...</div>

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Total Books" value={stats.total_books} />
        <Card title="Total Students" value={stats.total_students} />
        <Card title="Total Borrowings" value={stats.total_borrowings} />
        <Card title="Total Returns" value={stats.total_returns} />
      </div>
    </div>
  )
}
