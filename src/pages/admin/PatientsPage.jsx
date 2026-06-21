import { useState, useMemo } from 'react'
import { Search, X, ChevronRight, Calendar, Clock, User } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import { StatusBadge } from '../../components/ui/Badge'
import { formatDate, formatTime } from '../../utils/dateUtils'

function PatientDrawer({ patient, bookings, services, providers, isAdmin, onClose }) {
  const patientBookings = useMemo(() =>
    [...bookings]
      .filter(b => b.patientId === patient.id)
      .sort((a, b) => b.date.localeCompare(a.date) || b.startTime.localeCompare(a.startTime)),
    [bookings, patient.id]
  )

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-brand-navy/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-luxury-lg flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <p className="font-display text-lg font-semibold text-brand-navy">Patient Record</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-brand-slate">
            <X size={18} />
          </button>
        </div>

        {/* Patient info */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-brand-navy flex items-center justify-center shrink-0">
              <span className="text-white text-lg font-semibold">
                {patient.firstName[0]}{patient.lastName[0]}
              </span>
            </div>
            <div>
              <p className="font-semibold text-brand-navy text-lg">{patient.firstName} {patient.lastName}</p>
              {patient.gender && (
                <p className="text-xs text-brand-slate/60 capitalize">{patient.gender}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-slate">Email</span>
              <span className="font-medium text-brand-navy">{patient.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-slate">Mobile</span>
              <span className="font-medium text-brand-navy">{patient.mobile}</span>
            </div>
            {isAdmin && patient.dateOfBirth && (
              <div className="flex justify-between">
                <span className="text-brand-slate">Date of Birth</span>
                <span className="font-medium text-brand-navy">{formatDate(patient.dateOfBirth)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-brand-slate">Patient since</span>
              <span className="font-medium text-brand-navy">{formatDate(patient.createdAt?.slice(0,10))}</span>
            </div>
          </div>

          {isAdmin && patient.notes && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs font-semibold text-amber-700 mb-1 uppercase tracking-wider">Clinical Notes</p>
              <p className="text-sm text-amber-800">{patient.notes}</p>
            </div>
          )}

          {!isAdmin && (
            <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-brand-slate/50">DOB and clinical notes are visible to admins only.</p>
            </div>
          )}
        </div>

        {/* Booking history timeline */}
        <div className="px-6 py-5 flex-1">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-4">
            Appointment History ({patientBookings.length})
          </p>

          {patientBookings.length === 0 ? (
            <p className="text-sm text-brand-slate/50 text-center py-8">No appointments yet.</p>
          ) : (
            <div className="space-y-3">
              {patientBookings.map((b, i) => {
                const service  = services.find(s => s.id === b.serviceId)
                const provider = providers.find(p => p.id === b.providerId)
                return (
                  <div key={b.id} className="relative pl-6">
                    {/* Timeline line */}
                    {i < patientBookings.length - 1 && (
                      <div className="absolute left-2 top-5 bottom-0 w-px bg-gray-100" />
                    )}
                    {/* Dot */}
                    <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${
                      b.status === 'completed' ? 'border-brand-teal bg-brand-teal' :
                      b.status === 'cancelled' || b.status === 'no_show' ? 'border-gray-300 bg-gray-100' :
                      'border-brand-gold bg-white'
                    }`} />

                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-brand-navy">{service?.name}</p>
                          <p className="text-xs text-brand-slate/60">{provider?.name}</p>
                        </div>
                        <StatusBadge status={b.status} />
                      </div>
                      <div className="flex gap-3 mt-2 text-xs text-brand-slate/60">
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />{formatDate(b.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={11} />{formatTime(b.startTime)}
                        </span>
                      </div>
                      {b.cancelReason && (
                        <p className="mt-1.5 text-xs text-red-500 italic">"{b.cancelReason}"</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function PatientsPage() {
  const { patients, bookings, services, providers } = useData()
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return patients
    return patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q) ||
      p.mobile.includes(q)
    )
  }, [patients, query])

  const bookingCount = (patientId) => bookings.filter(b => b.patientId === patientId).length

  return (
    <div>
      <PageHeader title="Patients" subtitle="Patient records and history" />

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-slate/40" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by name, email, or mobile…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-brand-navy
            placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-slate/40 hover:text-brand-slate">
            <X size={14} />
          </button>
        )}
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-brand-slate/50 text-sm">
            {query ? 'No patients match your search.' : 'No patient records yet.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['Name', 'Email', 'Mobile', 'Appointments', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-slate/60">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr
                  key={p.id}
                  className="hover:bg-brand-cream/50 transition-colors cursor-pointer"
                  onClick={() => setSelected(p)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">{p.firstName[0]}{p.lastName[0]}</span>
                      </div>
                      <span className="font-medium text-brand-navy">{p.firstName} {p.lastName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-brand-slate">{p.email}</td>
                  <td className="px-4 py-3 text-brand-slate">{p.mobile}</td>
                  <td className="px-4 py-3 text-brand-slate">
                    <span className="font-medium text-brand-navy">{bookingCount(p.id)}</span>
                  </td>
                  <td className="px-4 py-3 text-brand-slate/40">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {selected && (
        <PatientDrawer
          patient={selected}
          bookings={bookings}
          services={services}
          providers={providers}
          isAdmin={isAdmin}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
