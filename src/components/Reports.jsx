import { useEffect, useState } from 'react'
import { api } from '../lib/api'

function ExportButtons({ data, filename }) {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.json`
    a.click()
  }
  const exportCSV = () => {
    if (!data.length) return
    const headers = Object.keys(data[0])
    const csv = [headers.join(','), ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.csv`
    a.click()
  }
  return (
    <div className="flex gap-2">
      <button onClick={exportCSV} className="px-3 py-1 rounded bg-emerald-600 text-white">Export CSV</button>
      <button onClick={exportJSON} className="px-3 py-1 rounded bg-gray-200">Export JSON</button>
    </div>
  )
}

export default function Reports() {
  const [tab, setTab] = useState('books')
  const [filters, setFilters] = useState({ start: '', end: '' })
  const [data, setData] = useState([])

  useEffect(() => { load() }, [tab])

  const load = async () => {
    if (tab === 'books') setData(await api.reports.books())
    if (tab === 'students') setData(await api.reports.students())
    if (tab === 'borrowings') setData(await api.reports.borrowings(parseDates(filters)))
    if (tab === 'returns') setData(await api.reports.returns(parseDates(filters)))
  }

  const parseDates = (f) => ({
    start: f.start ? new Date(f.start).toISOString() : undefined,
    end: f.end ? new Date(f.end).toISOString() : undefined,
  })

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Reports</h2>
      <div className="flex gap-3">
        {['books','students','borrowings','returns'].map(k => (
          <button key={k} onClick={()=>setTab(k)} className={`px-4 py-2 rounded ${tab===k?'bg-emerald-600 text-white':'bg-white border'}`}>{k[0].toUpperCase()+k.slice(1)}</button>
        ))}
      </div>
      {(tab==='borrowings'||tab==='returns') && (
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600">Start</label>
            <input type="date" className="border rounded px-3 py-2" value={filters.start} onChange={e=>setFilters({...filters,start:e.target.value})} />
          </div>
          <div>
            <label className="block text-xs text-gray-600">End</label>
            <input type="date" className="border rounded px-3 py-2" value={filters.end} onChange={e=>setFilters({...filters,end:e.target.value})} />
          </div>
          <button onClick={load} className="px-4 py-2 rounded bg-emerald-600 text-white">Apply</button>
        </div>
      )}

      <div className="bg-white border rounded-lg overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-emerald-700">
            <tr>
              {data[0] && Object.keys(data[0]).map(h => <th key={h} className="text-left p-2">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t">
                {Object.keys(row).map(k => <td key={k} className="p-2">{String(row[k])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExportButtons data={data} filename={tab + '-report'} />
    </div>
  )
}
