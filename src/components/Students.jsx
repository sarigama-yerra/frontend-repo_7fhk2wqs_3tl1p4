import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Students() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ nisn: '', name: '', gender: 'Male', class_name: '' })

  const load = async () => setItems(await api.students.list())
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.students.create(form)
    setForm({ nisn: '', name: '', gender: 'Male', class_name: '' })
    load()
  }
  const remove = async (nisn) => { if (!confirm('Delete student?')) return; await api.students.remove(nisn); load() }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Student Management</h2>
      <form onSubmit={submit} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="NISN" className="border rounded px-3 py-2" value={form.nisn} onChange={e=>setForm({...form, nisn:e.target.value})} />
        <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.gender} onChange={e=>setForm({...form, gender:e.target.value})}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <input placeholder="Class" className="border rounded px-3 py-2" value={form.class_name} onChange={e=>setForm({...form, class_name:e.target.value})} />
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4">Add</button>
      </form>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-700">
            <tr>
              <th className="text-left p-2">NISN</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Gender</th>
              <th className="text-left p-2">Class</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.nisn}</td>
                <td className="p-2">{it.name}</td>
                <td className="p-2">{it.gender}</td>
                <td className="p-2">{it.class_name}</td>
                <td className="p-2">
                  <button onClick={() => remove(it.nisn)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
