import { useState } from 'react'
import { useData } from '../../context/DataContext'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Modal from '../../components/ui/Modal'
import { Badge } from '../../components/ui/Badge'
import { Plus, Pencil, ToggleLeft, ToggleRight, Clock } from 'lucide-react'

const CATEGORIES = ['Consultation', 'Facial Treatment', 'Laser', 'Minor Procedure', 'Skin Rejuvenation', 'Other']

const EMPTY = { name: '', category: 'Consultation', description: '', durationMinutes: 30, price: 0 }

export default function ServicesPage() {
  const { services, addService, updateService } = useData()
  const [modal, setModal] = useState(null) // null | 'add' | {service}
  const [form, setForm] = useState(EMPTY)

  function openAdd() { setForm(EMPTY); setModal('add') }
  function openEdit(svc) { setForm({ ...svc }); setModal(svc) }
  function closeModal() { setModal(null) }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSubmit(e) {
    e.preventDefault()
    if (modal === 'add') {
      addService({ ...form, durationMinutes: Number(form.durationMinutes), price: Number(form.price) })
    } else {
      updateService(modal.id, { ...form, durationMinutes: Number(form.durationMinutes), price: Number(form.price) })
    }
    closeModal()
  }

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Manage your service catalog and appointment durations"
        action={<Button onClick={openAdd}><Plus size={16} className="mr-1.5" />Add Service</Button>}
      />

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              {['Service', 'Category', 'Duration', 'Price', 'Status', ''].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-brand-slate">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.map(svc => (
              <tr key={svc.id} className="hover:bg-gray-50/50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-brand-navy">{svc.name}</p>
                  {svc.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{svc.description}</p>}
                </td>
                <td className="px-6 py-4 text-brand-slate">{svc.category}</td>
                <td className="px-6 py-4">
                  <span className="flex items-center gap-1 text-brand-slate">
                    <Clock size={13} />{svc.durationMinutes} min
                  </span>
                </td>
                <td className="px-6 py-4 text-brand-slate">₱{svc.price?.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <Badge color={svc.isActive ? 'teal' : 'gray'}>{svc.isActive ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => openEdit(svc)} className="p-1.5 rounded-lg hover:bg-gray-100 transition text-brand-slate">
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => updateService(svc.id, { isActive: !svc.isActive })}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition text-brand-slate"
                      title={svc.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {svc.isActive ? <ToggleRight size={16} className="text-brand-teal" /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">No services yet. Add your first service.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <Modal open={!!modal} onClose={closeModal} title={modal === 'add' ? 'Add Service' : 'Edit Service'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Service Name" value={form.name} onChange={e => set('name', e.target.value)} required />
          <Select label="Category" value={form.category} onChange={e => set('category', e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duration (minutes)" type="number" min="5" step="5" value={form.durationMinutes} onChange={e => set('durationMinutes', e.target.value)} required />
            <Input label="Price (₱)" type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">Description</label>
            <textarea
              value={form.description} onChange={e => set('description', e.target.value)} rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-teal resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">{modal === 'add' ? 'Add Service' : 'Save Changes'}</Button>
            <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
