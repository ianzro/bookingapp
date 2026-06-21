import { useState } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'
import ServicePicker from '../booking/ServicePicker'
import ProviderPicker from '../booking/ProviderPicker'
import DateTimePicker from '../booking/DateTimePicker'
import { useData } from '../../context/DataContext'
import { formatDate, formatTime } from '../../utils/dateUtils'

const STEPS = ['Service', 'Provider', 'Date & Time', 'Patient', 'Review']

function PatientStep({ value, onChange, errors, patients }) {
  const [mode, setMode] = useState('search')
  const [query, setQuery] = useState('')

  const matches = query.trim().length >= 2
    ? patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
        p.email.toLowerCase().includes(query.toLowerCase()) ||
        p.mobile.includes(query)
      )
    : []

  function set(field, val) { onChange({ ...value, [field]: val }) }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {['search', 'new'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); onChange({ patientId: null, firstName: '', lastName: '', email: '', mobile: '', dateOfBirth: '', gender: '', notes: '' }) }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === m ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-slate hover:text-brand-navy'
            }`}
          >
            {m === 'search' ? 'Existing Patient' : 'New Patient'}
          </button>
        ))}
      </div>

      {mode === 'search' ? (
        <div className="space-y-3">
          <Input
            label="Search by name, email, or mobile"
            value={query}
            onChange={e => { setQuery(e.target.value); onChange({ ...value, patientId: null }) }}
            placeholder="Maria Dela Cruz…"
          />
          {matches.map(p => (
            <button
              key={p.id}
              onClick={() => onChange({ patientId: p.id, firstName: p.firstName, lastName: p.lastName, email: p.email, mobile: p.mobile })}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                value.patientId === p.id
                  ? 'border-brand-teal bg-brand-teal/5'
                  : 'border-gray-200 hover:border-brand-teal/40'
              }`}
            >
              <p className="font-medium text-brand-navy">{p.firstName} {p.lastName}</p>
              <p className="text-xs text-brand-slate/60">{p.email} · {p.mobile}</p>
            </button>
          ))}
          {query.trim().length >= 2 && !matches.length && (
            <p className="text-sm text-brand-slate/60 text-center py-2">No patients found.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name *" value={value.firstName} onChange={e => set('firstName', e.target.value)} error={errors?.firstName} placeholder="Maria" />
            <Input label="Last Name *" value={value.lastName} onChange={e => set('lastName', e.target.value)} error={errors?.lastName} placeholder="Dela Cruz" />
          </div>
          <Input label="Email *" type="email" value={value.email} onChange={e => set('email', e.target.value)} error={errors?.email} placeholder="maria@example.com" />
          <Input label="Mobile *" value={value.mobile} onChange={e => set('mobile', e.target.value)} error={errors?.mobile} placeholder="+63 917 000 0000" />
          <Input label="Date of Birth" type="date" value={value.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} />
        </div>
      )}
    </div>
  )
}

const emptyPatient = { patientId: null, firstName: '', lastName: '', email: '', mobile: '', dateOfBirth: '', gender: '', notes: '' }

export default function ManualBookingModal({ open, onClose }) {
  const { services, providers, patients, addPatient, addBooking } = useData()
  const [step, setStep] = useState(0)
  const [service, setService] = useState(null)
  const [provider, setProvider] = useState(null)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState(null)
  const [patient, setPatient] = useState(emptyPatient)
  const [patientErrors, setPatientErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function reset() {
    setStep(0); setService(null); setProvider(null)
    setDate(''); setSlot(null); setPatient(emptyPatient); setPatientErrors({})
  }

  function handleClose() { reset(); onClose() }

  function canAdvance() {
    if (step === 0) return !!service
    if (step === 1) return !!provider
    if (step === 2) return !!date && !!slot
    if (step === 3) return patient.patientId || (patient.firstName && patient.lastName && patient.email && patient.mobile)
    return true
  }

  function advance() {
    if (step === 3 && !patient.patientId) {
      const errors = {}
      if (!patient.firstName.trim()) errors.firstName = 'Required'
      if (!patient.lastName.trim()) errors.lastName = 'Required'
      if (!patient.email.trim()) errors.email = 'Required'
      if (!patient.mobile.trim()) errors.mobile = 'Required'
      if (Object.keys(errors).length) { setPatientErrors(errors); return }
      setPatientErrors({})
    }
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      let patientId = patient.patientId
      if (!patientId) {
        const existing = patients.find(
          p => p.email.toLowerCase() === patient.email.toLowerCase() || p.mobile === patient.mobile
        )
        if (existing) {
          patientId = existing.id
        } else {
          const np = addPatient({
            firstName: patient.firstName.trim(),
            lastName: patient.lastName.trim(),
            email: patient.email.trim().toLowerCase(),
            mobile: patient.mobile.trim(),
            dateOfBirth: patient.dateOfBirth || null,
            gender: patient.gender || null,
            notes: '',
          })
          patientId = np.id
        }
      }
      addBooking({
        patientId,
        providerId: provider.id,
        serviceId: service.id,
        date,
        startTime: slot.start,
        endTime: slot.end,
        status: 'confirmed',
        notes: '',
        bookedBy: 'staff',
      })
      handleClose()
    } finally {
      setSubmitting(false)
    }
  }

  const stepContent = [
    <ServicePicker key="svc" services={services} selectedId={service?.id} onSelect={setService} />,
    <ProviderPicker key="prov" providers={providers} selectedServiceId={service?.id} selectedId={provider?.id} onSelect={setProvider} />,
    <DateTimePicker key="dt" provider={provider} durationMinutes={service?.durationMinutes} selectedDate={date} selectedSlot={slot}
      onSelect={({ date: d, slot: s }) => { setDate(d); setSlot(s) }} />,
    <PatientStep key="pat" value={patient} onChange={setPatient} errors={patientErrors} patients={patients} />,
    service && provider && date && slot ? (
      <div key="rev" className="space-y-3 text-sm">
        <div className="bg-brand-cream rounded-xl p-4 space-y-2">
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-2">Summary</p>
          <div className="flex justify-between"><span className="text-brand-slate">Service</span><span className="font-medium text-brand-navy">{service.name}</span></div>
          <div className="flex justify-between"><span className="text-brand-slate">Provider</span><span className="font-medium text-brand-navy">{provider.name}</span></div>
          <div className="flex justify-between"><span className="text-brand-slate">Date</span><span className="font-medium text-brand-navy">{formatDate(date)}</span></div>
          <div className="flex justify-between"><span className="text-brand-slate">Time</span><span className="font-medium text-brand-navy">{formatTime(slot.start)} – {formatTime(slot.end)}</span></div>
          <div className="flex justify-between"><span className="text-brand-slate">Patient</span><span className="font-medium text-brand-navy">{patient.firstName} {patient.lastName}</span></div>
        </div>
        <p className="text-xs text-brand-slate/60 text-center">Staff booking — will be set to Confirmed automatically.</p>
      </div>
    ) : null,
  ]

  return (
    <Modal open={open} onClose={handleClose} title="New Manual Booking" size="md">
      <div className="space-y-5">
        {/* mini step indicator */}
        <div className="flex gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-brand-teal' : 'bg-gray-100'}`} />
          ))}
        </div>
        <p className="text-xs font-semibold text-brand-slate/60 uppercase tracking-widest">Step {step+1}: {STEPS[step]}</p>

        <div className="max-h-[55vh] overflow-y-auto pr-1">{stepContent[step]}</div>

        <div className="flex gap-3 border-t border-gray-100 pt-4">
          {step > 0 && <Button variant="secondary" onClick={() => setStep(s=>s-1)} className="flex-1 gap-1"><ChevronLeft size={16}/>Back</Button>}
          {step < STEPS.length - 1
            ? <Button variant="primary" onClick={advance} disabled={!canAdvance()} className="flex-1 gap-1">Continue<ChevronRight size={16}/></Button>
            : <Button variant="gold" onClick={handleSubmit} disabled={submitting} className="flex-1">{submitting ? 'Saving…' : 'Confirm Booking'}</Button>
          }
        </div>
      </div>
    </Modal>
  )
}
