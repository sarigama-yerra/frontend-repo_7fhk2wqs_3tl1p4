import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Officers() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'staff' })
  const [error, setError] = useState('')

  const load = async () => {
    try { setItems(await api.officers.list()) } catch (e) { setError(e.message) }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try { await api.officers.create(form); setForm({ name: '', username: '', password: '', role: 'staff' }); load() } catch (e) { setError(e.message) }
  }

  const remove = async (id) => { if (!confirm('Delete officer?')) return; try { await api.officers.remove(id); load() } catch (e) { alert(e.message) } }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Officer Management</h2>
      <form onSubmit={submit} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Username" className="border rounded px-3 py-2" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
        <input placeholder="Password" type="password" className="border rounded px-3 py-2" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4">Add</button>
      </form>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-700">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Username</th>
              <th className="text-left p-2">Role</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.username}</td>
                <td className="p-2">{it.role}</td>
                <td className="p-2">
                  <button onClick={() => remove(it.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error && <div className="text-red-600">{error}</div>}
    </div>
  )
}
