import { useState } from 'react'
import { useData } from '../../context/DataContext'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Plus, Pencil, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { DAY_KEYS, dayLabel } from '../../utils/dateUtils'

const EMPTY_AVAIL = { mon:[], tue:[], wed:[], thu:[], fri:[], sat:[], sun:[] }
const EMPTY = { name:'', specialty:'', credentials:'', bio:'', serviceIds:[], availability: EMPTY_AVAIL }

export default function ProvidersPage() {
  const { providers, services, addProvider, updateProvider } = useData()
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY)

  function openAdd() { setForm(JSON.parse(JSON.stringify(EMPTY))); setModal('add') }
  function openEdit(p) { setForm(JSON.parse(JSON.stringify(p))); setModal(p) }
  function closeModal() { setModal(null) }
  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function toggleService(svcId) {
    setForm(f => ({
      ...f,
      serviceIds: f.serviceIds.includes(svcId)
        ? f.serviceIds.filter(id => id !== svcId)
        : [...f.serviceIds, svcId],
    }))
  }

  function addBlock(day) {
    setForm(f => ({
      ...f,
      availability: {
        ...f.availability,
        [day]: [...(f.availability[day] || []), { start: '09:00', end: '17:00' }],
      },
    }))
  }

  function removeBlock(day, idx) {
    setForm(f => ({
      ...f,
      availability: {
        ...f.availability,
        [day]: f.availability[day].filter((_, i) => i !== idx),
      },
    }))
  }

  function setBlock(day, idx, field, val) {
    setForm(f => {
      const blocks = [...f.availability[day]]
      blocks[idx] = { ...blocks[idx], [field]: val }
      return { ...f, availability: { ...f.availability, [day]: blocks } }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (modal === 'add') addProvider(form)
    else updateProvider(modal.id, form)
    closeModal()
  }

  return (
    <div>
      <PageHeader
        title="Providers"
        subtitle="Manage doctors and specialists"
        action={<Button onClick={openAdd}><Plus size={16} className="mr-1.5" />Add Provider</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {providers.map(p => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal font-display font-semibold text-lg">
                  {p.name.split(' ').filter(Boolean).pop()?.[0]}
                </div>
                <div>
                  <p className="font-display font-semibold text-brand-navy">{p.name}</p>
                  <p className="text-xs text-brand-slate">{p.specialty}</p>
                  {p.credentials && <p className="text-xs text-gray-400">{p.credentials}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-brand-slate">
                  <Pencil size={14} />
                </button>
                <button onClick={() => updateProvider(p.id, { isActive: !p.isActive })} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-brand-slate">
                  {p.isActive ? <ToggleRight size={16} className="text-brand-teal" /> : <ToggleLeft size={16} />}
                </button>
              </div>
            </div>

            {/* Services */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.serviceIds?.map(id => {
                const svc = services.find(s => s.id === id)
                return svc ? <Badge key={id} color="teal">{svc.name}</Badge> : null
              })}
            </div>

            {/* Availability summary */}
            <div className="mt-3 text-xs text-gray-400">
              {DAY_KEYS.filter(d => p.availability?.[d]?.length > 0).map(d => (
                <span key={d} className="mr-2 font-medium capitalize">{d.toUpperCase()}</span>
              ))}
              {DAY_KEYS.every(d => !p.availability?.[d]?.length) && 'No availability set'}
            </div>
          </Card>
        ))}
        {providers.length === 0 && (
          <div className="col-span-2 py-12 text-center text-sm text-gray-400">No providers yet.</div>
        )}
      </div>

      {/* Modal */}
      <Modal open={!!modal} onClose={closeModal} title={modal === 'add' ? 'Add Provider' : 'Edit Provider'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={e => set('name', e.target.value)} required className="col-span-2" />
            <Input label="Specialty" value={form.specialty} onChange={e => set('specialty', e.target.value)} />
            <Input label="Credentials" value={form.credentials} onChange={e => set('credentials', e.target.value)} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">Bio</label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none" />
          </div>

          {/* Services */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">Services Offered</p>
            <div className="flex flex-wrap gap-2">
              {services.filter(s => s.isActive).map(svc => (
                <button
                  key={svc.id} type="button"
                  onClick={() => toggleService(svc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition
                    ${form.serviceIds.includes(svc.id)
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-white text-brand-slate border-gray-200 hover:border-brand-teal'}`}
                >
                  {svc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-slate mb-3">Availability</p>
            <div className="space-y-2">
              {DAY_KEYS.map(day => {
                const blocks = form.availability?.[day] || []
                return (
                  <div key={day} className="flex items-start gap-3">
                    <span className="w-8 text-xs font-semibold text-brand-slate pt-2 uppercase">{day}</span>
                    <div className="flex-1 space-y-1.5">
                      {blocks.map((block, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input type="time" value={block.start} onChange={e => setBlock(day, idx, 'start', e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal" />
                          <span className="text-gray-400 text-xs">–</span>
                          <input type="time" value={block.end} onChange={e => setBlock(day, idx, 'end', e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-brand-teal" />
                          <button type="button" onClick={() => removeBlock(day, idx)} className="text-gray-400 hover:text-red-500 transition">
                            <X size={13} />
                          </button>
                        </div>
                      ))}
                      <button type="button" onClick={() => addBlock(day)}
                        className="text-xs text-brand-teal hover:underline font-medium">
                        + Add block
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{modal === 'add' ? 'Add Provider' : 'Save Changes'}</Button>
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
