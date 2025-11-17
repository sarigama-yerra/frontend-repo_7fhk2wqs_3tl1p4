import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { BarChart, Book, UsersRound, LogOut, ClipboardList, UserCog } from 'lucide-react'
import { clearSession, getRole, getName } from '../lib/api'

const themeGreen = 'bg-emerald-600'

export default function Layout() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = getRole()
  const name = getName()

  const NavItem = ({ to, icon: Icon, label, roles }) => {
    if (roles && !roles.includes(role)) return null
    const active = location.pathname === to
    return (
      <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${active ? 'bg-emerald-100 text-emerald-700' : 'text-gray-700 hover:bg-emerald-50'}`}>
        <Icon size={18} /> {label}
      </Link>
    )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 border-r bg-white p-4 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full ${themeGreen} text-white flex items-center justify-center font-bold`}>S</div>
          <div>
            <div className="font-semibold">School Library</div>
            <div className="text-xs text-gray-500">{role?.toUpperCase()}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          <NavItem to="/" icon={BarChart} label="Dashboard" />
          <NavItem to="/officers" icon={UserCog} label="Officers" roles={["admin"]} />
          <NavItem to="/books" icon={Book} label="Books" roles={["admin","staff"]} />
          <NavItem to="/students" icon={UsersRound} label="Students" roles={["admin","staff"]} />
          <NavItem to="/borrowings" icon={ClipboardList} label="Borrowings" roles={["admin","staff"]} />
          <NavItem to="/reports" icon={BarChart} label="Reports" roles={["admin","staff"]} />
        </nav>
        <div className="mt-auto">
          <button onClick={() => { clearSession(); navigate('/login') }} className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md mt-4">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1">
        <header className={`h-14 ${themeGreen} text-white flex items-center justify-between px-6`}>
          <div className="font-semibold">Library Borrowing Management</div>
          <div className="text-sm opacity-90">Welcome, {name}</div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
