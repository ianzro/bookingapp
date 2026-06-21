import { useState } from 'react'
import { MoreVertical, ChevronDown } from 'lucide-react'
import { StatusBadge } from '../ui/Badge'
import StatusChangeModal from './StatusChangeModal'
import { formatDate, formatTime } from '../../utils/dateUtils'

function ActionMenu({ booking, onStatusChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="p-1.5 rounded-lg hover:bg-gray-100 text-brand-slate transition"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-luxury-lg border border-gray-100 z-20 py-1 overflow-hidden">
            <button
              className="w-full text-left px-4 py-2 text-sm text-brand-navy hover:bg-brand-cream transition"
              onClick={() => { setOpen(false); onStatusChange(booking) }}
            >
              Change status
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function AppointmentTable({ bookings, services, providers, patients, onStatusChange }) {
  if (!bookings.length) {
    return (
      <div className="text-center py-12 text-brand-slate/50 text-sm">
        No appointments found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {['Patient', 'Service', 'Provider', 'Date', 'Time', 'Status', ''].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-slate/60">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {bookings.map(b => {
            const patient  = patients.find(p => p.id === b.patientId)
            const service  = services.find(s => s.id === b.serviceId)
            const provider = providers.find(p => p.id === b.providerId)
            return (
              <tr key={b.id} className="hover:bg-brand-cream/50 transition-colors">
                <td className="px-4 py-3 font-medium text-brand-navy">
                  {patient ? `${patient.firstName} ${patient.lastName}` : '—'}
                </td>
                <td className="px-4 py-3 text-brand-slate">{service?.name || '—'}</td>
                <td className="px-4 py-3 text-brand-slate">{provider?.name || '—'}</td>
                <td className="px-4 py-3 text-brand-slate whitespace-nowrap">{formatDate(b.date)}</td>
                <td className="px-4 py-3 text-brand-slate whitespace-nowrap">
                  {formatTime(b.startTime)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3">
                  <ActionMenu booking={b} onStatusChange={onStatusChange} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
