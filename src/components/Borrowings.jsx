import { useEffect, useState } from 'react'
import { api } from '../lib/api'

export default function Borrowings() {
  const [items, setItems] = useState([])
  const [books, setBooks] = useState([])
  const [students, setStudents] = useState([])
  const [form, setForm] = useState({ borrowing_id: '', book_id: '', student_nisn: '', borrow_date: '', return_due_date: '', daily_fine: 1000 })

  const load = async () => {
    const [b, s, i] = await Promise.all([api.books.list(), api.students.list(), api.borrowings.list()])
    setBooks(b); setStudents(s); setItems(i)
  }
  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { ...form, borrow_date: new Date(form.borrow_date).toISOString(), return_due_date: new Date(form.return_due_date).toISOString(), daily_fine: Number(form.daily_fine) }
    await api.borrowings.create(payload)
    setForm({ borrowing_id: '', book_id: '', student_nisn: '', borrow_date: '', return_due_date: '', daily_fine: 1000 })
    load()
  }
  const remove = async (id) => { if (!confirm('Delete borrowing?')) return; await api.borrowings.remove(id); load() }
  const doReturn = async (id) => { const res = await api.borrowings.return(id); alert(`Returned. Fine: Rp ${res.fine_total || 0}`); load() }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Borrowing</h2>
      <form onSubmit={submit} className="bg-white border rounded-lg p-4 grid grid-cols-1 md:grid-cols-6 gap-3">
        <input placeholder="Borrowing ID" className="border rounded px-3 py-2" value={form.borrowing_id} onChange={e=>setForm({...form, borrowing_id:e.target.value})} />
        <select className="border rounded px-3 py-2" value={form.book_id} onChange={e=>setForm({...form, book_id:e.target.value})}>
          <option value="">Select Book</option>
          {books.map(b => <option key={b.book_id} value={b.book_id}>{b.title}</option>)}
        </select>
        <select className="border rounded px-3 py-2" value={form.student_nisn} onChange={e=>setForm({...form, student_nisn:e.target.value})}>
          <option value="">Select Student</option>
          {students.map(s => <option key={s.nisn} value={s.nisn}>{s.name}</option>)}
        </select>
        <input type="date" className="border rounded px-3 py-2" value={form.borrow_date} onChange={e=>setForm({...form, borrow_date:e.target.value})} />
        <input type="date" className="border rounded px-3 py-2" value={form.return_due_date} onChange={e=>setForm({...form, return_due_date:e.target.value})} />
        <input type="number" className="border rounded px-3 py-2" value={form.daily_fine} onChange={e=>setForm({...form, daily_fine:e.target.value})} />
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded px-4">Add</button>
      </form>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-700">
            <tr>
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Book</th>
              <th className="text-left p-2">Student</th>
              <th className="text-left p-2">Borrow</th>
              <th className="text-left p-2">Due</th>
              <th className="text-left p-2">Returned</th>
              <th className="text-left p-2">Fine</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id} className="border-t">
                <td className="p-2">{it.borrowing_id}</td>
                <td className="p-2">{it.book_id}</td>
                <td className="p-2">{it.student_nisn}</td>
                <td className="p-2">{new Date(it.borrow_date).toLocaleDateString()}</td>
                <td className="p-2">{new Date(it.return_due_date).toLocaleDateString()}</td>
                <td className="p-2">{it.returned_at ? new Date(it.returned_at).toLocaleDateString() : '-'}</td>
                <td className="p-2">{it.fine_total ? `Rp ${it.fine_total}` : '-'}</td>
                <td className="p-2 flex gap-3">
                  {!it.returned_at && <button onClick={() => doReturn(it.borrowing_id)} className="text-emerald-700 hover:underline">Return</button>}
                  <button onClick={() => remove(it.borrowing_id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
