import { useMemo } from 'react'
import { useData } from '../../context/DataContext'
import Card from '../../components/ui/Card'
import PageHeader from '../../components/ui/PageHeader'
import { CalendarDays, Users, Layers, Clock } from 'lucide-react'
import { todayISO } from '../../utils/dateUtils'

function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-slate">{label}</p>
          <p className={`mt-2 text-3xl font-display font-semibold ${color || 'text-brand-navy'}`}>{value}</p>
          {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color ? 'bg-brand-gold/10' : 'bg-brand-teal/10'}`}>
          <Icon size={20} className={color || 'text-brand-teal'} />
        </div>
      </div>
    </Card>
  )
}

export default function DashboardPage() {
  const { bookings, patients, services, providers } = useData()
  const today = todayISO()

  const stats = useMemo(() => {
    const todayBookings = bookings.filter(b => b.date === today && !['cancelled','no_show'].includes(b.status))
    const pending = bookings.filter(b => b.status === 'pending')
    return { todayBookings: todayBookings.length, pending: pending.length }
  }, [bookings, today])

  const recentBookings = useMemo(() =>
    [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
  [bookings])

  function patientName(id) {
    const p = patients.find(p => p.id === id)
    return p ? `${p.firstName} ${p.lastName}` : '—'
  }
  function serviceName(id) {
    return services.find(s => s.id === id)?.name || '—'
  }

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Overview of your clinic activity" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarDays} label="Today's Appointments" value={stats.todayBookings} />
        <StatCard icon={Clock}        label="Pending Confirmation" value={stats.pending} color="text-brand-gold" />
        <StatCard icon={Users}        label="Total Patients"       value={patients.length} />
        <StatCard icon={Layers}       label="Active Services"      value={services.filter(s => s.isActive).length} />
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="font-display text-base font-semibold text-brand-navy">Recent Bookings</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {['Patient', 'Service', 'Date', 'Time', 'Status'].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {recentBookings.map(b => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-3 font-medium text-brand-navy">{patientName(b.patientId)}</td>
                <td className="px-6 py-3 text-brand-slate">{serviceName(b.serviceId)}</td>
                <td className="px-6 py-3 text-brand-slate">{b.date}</td>
                <td className="px-6 py-3 text-brand-slate">{b.startTime}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                    ${b.status === 'confirmed' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                      b.status === 'pending'   ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {recentBookings.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">No bookings yet</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
