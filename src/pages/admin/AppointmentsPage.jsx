import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { useData } from '../../context/DataContext'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import AppointmentTable from '../../components/admin/AppointmentTable'
import AppointmentFilters from '../../components/admin/AppointmentFilters'
import StatusChangeModal from '../../components/admin/StatusChangeModal'
import ManualBookingModal from '../../components/admin/ManualBookingModal'
import { todayISO } from '../../utils/dateUtils'

const TABS = ['upcoming', 'today', 'past']
const TAB_LABELS = { upcoming: 'Upcoming', today: 'Today', past: 'Past' }

const DEFAULT_FILTERS = { dateFrom: '', dateTo: '', providerId: '', status: '' }

export default function AppointmentsPage() {
  const { bookings, services, providers, patients, updateBooking } = useData()
  const [tab, setTab] = useState('today')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [statusTarget, setStatusTarget] = useState(null)
  const [showManual, setShowManual] = useState(false)

  const today = todayISO()

  const filtered = useMemo(() => {
    let list = [...bookings]

    // Tab filter
    if (tab === 'today') {
      list = list.filter(b => b.date === today)
    } else if (tab === 'upcoming') {
      list = list.filter(b => b.date > today && !['cancelled', 'completed', 'no_show'].includes(b.status))
    } else {
      list = list.filter(b => b.date < today || ['completed', 'cancelled', 'no_show'].includes(b.status))
    }

    // Filter panel
    if (filters.dateFrom) list = list.filter(b => b.date >= filters.dateFrom)
    if (filters.dateTo)   list = list.filter(b => b.date <= filters.dateTo)
    if (filters.providerId) list = list.filter(b => b.providerId === filters.providerId)
    if (filters.status)     list = list.filter(b => b.status === filters.status)

    // Sort
    return list.sort((a, b) => {
      const dateCmp = a.date.localeCompare(b.date)
      if (dateCmp !== 0) return tab === 'past' ? -dateCmp : dateCmp
      return a.startTime.localeCompare(b.startTime)
    })
  }, [bookings, tab, filters, today])

  function handleStatusSave({ status, cancelReason }) {
    if (!statusTarget) return
    updateBooking(statusTarget.id, { status, cancelReason: cancelReason ?? statusTarget.cancelReason })
    setStatusTarget(null)
  }

  const counts = useMemo(() => ({
    today:    bookings.filter(b => b.date === today).length,
    upcoming: bookings.filter(b => b.date > today && !['cancelled','completed','no_show'].includes(b.status)).length,
    past:     bookings.filter(b => b.date < today || ['completed','cancelled','no_show'].includes(b.status)).length,
  }), [bookings, today])

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Manage your clinic schedule"
        action={
          <Button variant="primary" onClick={() => setShowManual(true)} className="gap-1.5">
            <Plus size={16} /> New Booking
          </Button>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white rounded-xl border border-gray-100 shadow-sm mb-5 w-fit">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t
                ? 'bg-brand-navy text-white shadow-sm'
                : 'text-brand-slate hover:text-brand-navy hover:bg-gray-50'
            }`}
          >
            {TAB_LABELS[t]}
            <span className={`ml-1.5 text-xs font-semibold px-1.5 py-0.5 rounded-full ${
              tab === t ? 'bg-white/20 text-white' : 'bg-gray-100 text-brand-slate'
            }`}>
              {counts[t]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-4">
        <AppointmentFilters providers={providers} filters={filters} onChange={setFilters} />
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <AppointmentTable
          bookings={filtered}
          services={services}
          providers={providers}
          patients={patients}
          onStatusChange={setStatusTarget}
        />
      </Card>

      <StatusChangeModal
        open={!!statusTarget}
        booking={statusTarget}
        onClose={() => setStatusTarget(null)}
        onSave={handleStatusSave}
      />

      <ManualBookingModal open={showManual} onClose={() => setShowManual(false)} />
    </div>
  )
}
