import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useData } from '../../context/DataContext'
import ServicePicker from '../../components/booking/ServicePicker'
import ProviderPicker from '../../components/booking/ProviderPicker'
import DateTimePicker from '../../components/booking/DateTimePicker'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { formatDate, formatTime } from '../../utils/dateUtils'

const STEPS = ['Service', 'Provider', 'Date & Time', 'Your Details', 'Review']

const GENDERS = [
  { value: '', label: 'Prefer not to say' },
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
]

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? 'bg-brand-teal text-white' :
              i === current ? 'bg-brand-navy text-white' :
              'bg-stone-200 text-stone-400'
            }`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <p className={`text-xs mt-1 font-medium whitespace-nowrap ${
              i === current ? 'text-brand-navy' : 'text-stone-400'
            }`}>{label}</p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 mx-1 mb-4 transition-all ${i < current ? 'bg-brand-teal' : 'bg-stone-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function PatientDetailsForm({ value, onChange, errors }) {
  function set(field, val) { onChange({ ...value, [field]: val }) }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name *"
          value={value.firstName}
          onChange={e => set('firstName', e.target.value)}
          error={errors.firstName}
          placeholder="Maria"
        />
        <Input
          label="Last Name *"
          value={value.lastName}
          onChange={e => set('lastName', e.target.value)}
          error={errors.lastName}
          placeholder="Dela Cruz"
        />
      </div>
      <Input
        label="Email *"
        type="email"
        value={value.email}
        onChange={e => set('email', e.target.value)}
        error={errors.email}
        placeholder="maria@example.com"
      />
      <Input
        label="Mobile Number *"
        type="tel"
        value={value.mobile}
        onChange={e => set('mobile', e.target.value)}
        error={errors.mobile}
        placeholder="+63 917 000 0000"
      />
      <Input
        label="Date of Birth"
        type="date"
        value={value.dateOfBirth}
        onChange={e => set('dateOfBirth', e.target.value)}
      />
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
          Gender
        </label>
        <select
          value={value.gender}
          onChange={e => set('gender', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-brand-navy
            focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
        >
          {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
          Notes / Concerns
        </label>
        <textarea
          value={value.notes}
          onChange={e => set('notes', e.target.value)}
          rows={3}
          placeholder="Any skin concerns, allergies, or notes for your provider..."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-brand-navy
            placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent resize-none"
        />
      </div>
    </div>
  )
}

function ReviewStep({ service, provider, date, slot, patient }) {
  return (
    <div className="space-y-4">
      <div className="bg-brand-cream rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest">Appointment</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-slate">Service</span>
            <span className="font-medium text-brand-navy">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-slate">Provider</span>
            <span className="font-medium text-brand-navy">{provider.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-slate">Date</span>
            <span className="font-medium text-brand-navy">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-slate">Time</span>
            <span className="font-medium text-brand-navy">
              {formatTime(slot.start)} – {formatTime(slot.end)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-slate">Duration</span>
            <span className="font-medium text-brand-navy">{service.durationMinutes} min</span>
          </div>
          <div className="flex justify-between border-t border-stone-200 pt-2 mt-2">
            <span className="text-brand-slate">Estimated Fee</span>
            <span className="font-semibold text-brand-teal">₱{service.price?.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-brand-cream rounded-xl p-5 space-y-3">
        <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest">Patient Details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-slate">Name</span>
            <span className="font-medium text-brand-navy">{patient.firstName} {patient.lastName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-slate">Email</span>
            <span className="font-medium text-brand-navy">{patient.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-slate">Mobile</span>
            <span className="font-medium text-brand-navy">{patient.mobile}</span>
          </div>
        </div>
      </div>

      <p className="text-xs text-brand-slate/60 text-center">
        By confirming, you agree to our cancellation policy. Please arrive 10 minutes early.
      </p>
    </div>
  )
}

function validatePatient(p) {
  const errors = {}
  if (!p.firstName.trim()) errors.firstName = 'Required'
  if (!p.lastName.trim()) errors.lastName = 'Required'
  if (!p.email.trim()) errors.email = 'Required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) errors.email = 'Invalid email'
  if (!p.mobile.trim()) errors.mobile = 'Required'
  return errors
}

const emptyPatient = { firstName: '', lastName: '', email: '', mobile: '', dateOfBirth: '', gender: '', notes: '' }

export default function BookingPage() {
  const navigate = useNavigate()
  const { services, providers, patients, addPatient, addBooking } = useData()

  const [step, setStep] = useState(0)
  const [service, setService] = useState(null)
  const [provider, setProvider] = useState(null)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState(null)
  const [patient, setPatient] = useState(emptyPatient)
  const [patientErrors, setPatientErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function handleDateTimeSelect({ date: d, slot: s }) {
    setDate(d)
    setSlot(s)
  }

  function canAdvance() {
    if (step === 0) return !!service
    if (step === 1) return !!provider
    if (step === 2) return !!date && !!slot
    if (step === 3) return true
    return true
  }

  function advance() {
    if (step === 3) {
      const errors = validatePatient(patient)
      if (Object.keys(errors).length) { setPatientErrors(errors); return }
      setPatientErrors({})
    }
    setStep(s => s + 1)
  }

  function back() { setStep(s => s - 1) }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      // Find or create patient by email
      let existingPatient = patients.find(
        p => p.email.toLowerCase() === patient.email.toLowerCase() ||
             p.mobile === patient.mobile
      )

      let patientId
      if (existingPatient) {
        patientId = existingPatient.id
      } else {
        const newPatient = addPatient({
          firstName: patient.firstName.trim(),
          lastName: patient.lastName.trim(),
          email: patient.email.trim().toLowerCase(),
          mobile: patient.mobile.trim(),
          dateOfBirth: patient.dateOfBirth || null,
          gender: patient.gender || null,
          notes: patient.notes.trim(),
        })
        patientId = newPatient.id
      }

      const booking = addBooking({
        patientId,
        providerId: provider.id,
        serviceId: service.id,
        date,
        startTime: slot.start,
        endTime: slot.end,
        status: 'pending',
        notes: patient.notes.trim(),
        bookedBy: 'patient',
      })

      navigate(`/book/confirmation/${booking.id}`)
    } finally {
      setSubmitting(false)
    }
  }

  const stepContent = [
    <ServicePicker key="svc" services={services} selectedId={service?.id} onSelect={setService} />,
    <ProviderPicker key="prov" providers={providers} selectedServiceId={service?.id} selectedId={provider?.id} onSelect={setProvider} />,
    <DateTimePicker key="dt" provider={provider} durationMinutes={service?.durationMinutes} selectedDate={date} selectedSlot={slot} onSelect={handleDateTimeSelect} />,
    <PatientDetailsForm key="pat" value={patient} onChange={setPatient} errors={patientErrors} />,
    service && provider && date && slot
      ? <ReviewStep key="rev" service={service} provider={provider} date={date} slot={slot} patient={patient} />
      : null,
  ]

  const isLastStep = step === STEPS.length - 1

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Header */}
      <div className="bg-brand-navy text-white py-6 px-4 text-center">
        <p className="font-display text-xl font-semibold tracking-wide">Lumière Dermatology</p>
        <p className="text-white/60 text-xs mt-1">Book Your Appointment</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <StepIndicator current={step} />

        <div className="bg-white rounded-2xl shadow-luxury p-6">
          <h2 className="font-display text-lg font-semibold text-brand-navy mb-1">{STEPS[step]}</h2>
          <div className="w-8 h-0.5 bg-brand-gold mb-5" />

          <div className="mb-6">
            {stepContent[step]}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <Button variant="secondary" onClick={back} className="flex-1 gap-1">
                <ChevronLeft size={16} /> Back
              </Button>
            )}
            {!isLastStep ? (
              <Button
                variant="primary"
                onClick={advance}
                disabled={!canAdvance()}
                className="flex-1 gap-1"
              >
                Continue <ChevronRight size={16} />
              </Button>
            ) : (
              <Button
                variant="gold"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Booking…' : 'Confirm Appointment'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
