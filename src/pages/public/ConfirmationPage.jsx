import { useParams, Link } from 'react-router-dom'
import { CheckCircle, Calendar, Clock, User, Phone, Mail } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatDate, formatTime } from '../../utils/dateUtils'

export default function ConfirmationPage() {
  const { id } = useParams()
  const { bookings, services, providers, patients } = useData()

  const booking = bookings.find(b => b.id === id)

  if (!booking) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="text-center px-4">
          <p className="font-display text-2xl font-semibold text-brand-navy mb-2">Booking Not Found</p>
          <p className="text-brand-slate text-sm mb-6">This confirmation link may have expired.</p>
          <Link to="/book" className="text-sm text-brand-teal hover:underline font-medium">
            Book a new appointment →
          </Link>
        </div>
      </div>
    )
  }

  const service  = services.find(s => s.id === booking.serviceId)
  const provider = providers.find(p => p.id === booking.providerId)
  const patient  = patients.find(p => p.id === booking.patientId)

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-navy text-white py-6 px-4 text-center">
        <p className="font-display text-xl font-semibold tracking-wide">Lumière Dermatology</p>
        <p className="text-white/60 text-xs mt-1">Appointment Confirmation</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        {/* Success icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-brand-teal/10 flex items-center justify-center">
            <CheckCircle size={44} className="text-brand-teal" />
          </div>
        </div>

        <p className="font-display text-2xl font-semibold text-brand-navy mb-1">You're all set!</p>
        <p className="text-brand-slate text-sm mb-2">
          Your appointment request has been received. We'll confirm it shortly.
        </p>
        <div className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-8">
          Pending Confirmation
        </div>

        {/* Booking details card */}
        <div className="bg-white rounded-2xl shadow-luxury p-6 text-left space-y-5 mb-6">
          <div>
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">
              Appointment Details
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-brand-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-slate/60">Date</p>
                  <p className="text-sm font-medium text-brand-navy">{formatDate(booking.date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-brand-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-slate/60">Time</p>
                  <p className="text-sm font-medium text-brand-navy">
                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User size={16} className="text-brand-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-slate/60">Provider</p>
                  <p className="text-sm font-medium text-brand-navy">{provider?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-100 pt-5">
            <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">
              Service
            </p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-brand-navy">{service?.name}</p>
                <p className="text-xs text-brand-slate/60">{service?.durationMinutes} min</p>
              </div>
              <p className="text-sm font-semibold text-brand-teal">₱{service?.price?.toLocaleString()}</p>
            </div>
          </div>

          {patient && (
            <div className="border-t border-stone-100 pt-5">
              <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">
                Patient
              </p>
              <p className="text-sm font-medium text-brand-navy mb-2">
                {patient.firstName} {patient.lastName}
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-brand-slate/70">
                  <Mail size={12} className="text-brand-teal" />
                  {patient.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-slate/70">
                  <Phone size={12} className="text-brand-teal" />
                  {patient.mobile}
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-xs text-brand-slate/60 mb-6">
          Booking reference: <span className="font-mono text-brand-navy">{booking.id}</span>
        </p>

        <div className="space-y-3">
          <Link
            to="/book"
            className="block w-full py-3 rounded-xl bg-brand-teal text-white text-sm font-semibold hover:bg-brand-teal-light transition text-center"
          >
            Book Another Appointment
          </Link>
          <p className="text-xs text-brand-slate/50">
            Questions? Call us at <span className="text-brand-teal font-medium">+63 2 8888 0000</span>
          </p>
        </div>
      </div>
    </div>
  )
}
