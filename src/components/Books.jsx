import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Books() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ book_id: '', title: '', author: '', publisher: '', year: '' })

  const load = async () => setItems(await api.books.list())
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { ...form, year: form.year ? Number(form.year) : undefined }
    await api.books.create(payload)
    setForm({ book_id: '', title: '', author: '', publisher: '', year: '' })
    load()
  }
  const remove = async (book_id) => { if (!confirm('Delete book?')) return; await api.books.remove(book_id); load() }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Book Management</h2>
      <form onSubmit={submit} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="Book ID" className="border rounded px-3 py-2" value={form.book_id} onChange={e=>setForm({...form, book_id:e.target.value})} />
        <input placeholder="Title" className="border rounded px-3 py-2" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
        <input placeholder="Author" className="border rounded px-3 py-2" value={form.author} onChange={e=>setForm({...form, author:e.target.value})} />
        <input placeholder="Publisher" className="border rounded px-3 py-2" value={form.publisher} onChange={e=>setForm({...form, publisher:e.target.value})} />
        <input placeholder="Year" className="border rounded px-3 py-2" value={form.year} onChange={e=>setForm({...form, year:e.target.value})} />
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4">Add</button>
      </form>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-700">
            <tr>
              <th className="text-left p-2">Book ID</th>
              <th className="text-left p-2">Title</th>
              <th className="text-left p-2">Author</th>
              <th className="text-left p-2">Publisher</th>
              <th className="text-left p-2">Year</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.book_id}</td>
                <td className="p-2">{it.title}</td>
                <td className="p-2">{it.author}</td>
                <td className="p-2">{it.publisher}</td>
                <td className="p-2">{it.year}</td>
                <td className="p-2">
                  <button onClick={() => remove(it.book_id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
