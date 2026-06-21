import { useState } from 'react'
import { useData } from '../../context/DataContext'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { DAY_KEYS } from '../../utils/dateUtils'
import { CheckCircle2 } from 'lucide-react'

const DAY_LABELS = { mon:'Monday', tue:'Tuesday', wed:'Wednesday', thu:'Thursday', fri:'Friday', sat:'Saturday', sun:'Sunday' }

export default function ClinicProfilePage() {
  const { clinic, updateClinic } = useData()
  const [form, setForm] = useState({ ...clinic })
  const [saved, setSaved] = useState(false)

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); setSaved(false) }

  function setHours(day, field, val) {
    setForm(f => ({
      ...f,
      businessHours: {
        ...f.businessHours,
        [day]: { ...f.businessHours?.[day], [field]: val },
      },
    }))
    setSaved(false)
  }

  function handleSave(e) {
    e.preventDefault()
    updateClinic(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <PageHeader title="Clinic Profile" subtitle="Manage your clinic information" />
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">

        <Card className="p-6 space-y-4">
          <h3 className="font-display text-base font-semibold text-brand-navy mb-1">Basic Information</h3>
          <Input label="Clinic Name" value={form.name || ''} onChange={e => set('name', e.target.value)} required />
          <Input label="Tagline" value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} />
          <Input label="Address" value={form.address || ''} onChange={e => set('address', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={form.phone || ''} onChange={e => set('phone', e.target.value)} />
            <Input label="Email" type="email" value={form.email || ''} onChange={e => set('email', e.target.value)} />
          </div>
          <Input label="Website" value={form.website || ''} onChange={e => set('website', e.target.value)} />
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-base font-semibold text-brand-navy mb-4">Business Hours</h3>
          <div className="space-y-3">
            {DAY_KEYS.map(day => {
              const h = form.businessHours?.[day] || { enabled: false, open: '08:00', close: '17:00' }
              return (
                <div key={day} className="flex items-center gap-4">
                  <label className="flex items-center gap-2 w-32 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!h.enabled}
                      onChange={e => setHours(day, 'enabled', e.target.checked)}
                      className="w-4 h-4 accent-brand-teal"
                    />
                    <span className="text-sm font-medium text-brand-navy">{DAY_LABELS[day]}</span>
                  </label>
                  {h.enabled ? (
                    <div className="flex items-center gap-2 text-sm text-brand-slate">
                      <input type="time" value={h.open || '08:00'}  onChange={e => setHours(day, 'open',  e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal" />
                      <span>–</span>
                      <input type="time" value={h.close || '17:00'} onChange={e => setHours(day, 'close', e.target.value)}
                        className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-brand-teal" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Closed</span>
                  )}
                </div>
              )
            })}
          </div>
        </Card>

        <div className="flex items-center gap-4">
          <Button type="submit">Save Changes</Button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <CheckCircle2 size={16} /> Saved successfully
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
