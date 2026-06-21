import { formatTime } from '../../utils/dateUtils'

const CATEGORY_ORDER = ['Consultation', 'Facial Treatment', 'Laser', 'Skin Rejuvenation', 'Minor Procedure']

export default function ServicePicker({ services, selectedId, onSelect }) {
  const active = services.filter(s => s.isActive)

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = active.filter(s => s.category === cat)
    if (items.length) acc[cat] = items
    return acc
  }, {})
  const otherCats = [...new Set(active.map(s => s.category))].filter(c => !CATEGORY_ORDER.includes(c))
  otherCats.forEach(cat => { grouped[cat] = active.filter(s => s.category === cat) })

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <p className="text-xs font-semibold text-brand-gold uppercase tracking-widest mb-3">{cat}</p>
          <div className="space-y-2">
            {items.map(svc => (
              <button
                key={svc.id}
                onClick={() => onSelect(svc)}
                className={`w-full text-left px-4 py-4 rounded-lg border transition-all ${
                  selectedId === svc.id
                    ? 'border-brand-teal bg-brand-teal/5 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-brand-teal/50 hover:bg-brand-cream'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium text-sm ${selectedId === svc.id ? 'text-brand-teal' : 'text-brand-navy'}`}>
                      {svc.name}
                    </p>
                    {svc.description && (
                      <p className="text-xs text-brand-slate/70 mt-0.5 line-clamp-1">{svc.description}</p>
                    )}
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    <p className="text-sm font-semibold text-brand-navy">
                      ₱{svc.price?.toLocaleString()}
                    </p>
                    <p className="text-xs text-brand-slate/60">{svc.durationMinutes} min</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
