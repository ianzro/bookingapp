export default function ProviderPicker({ providers, selectedServiceId, selectedId, onSelect }) {
  const eligible = selectedServiceId
    ? providers.filter(p => p.isActive && p.serviceIds?.includes(selectedServiceId))
    : providers.filter(p => p.isActive)

  if (!eligible.length) {
    return (
      <p className="text-sm text-brand-slate/70 text-center py-8">
        No providers available for this service.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {eligible.map(prov => (
        <button
          key={prov.id}
          onClick={() => onSelect(prov)}
          className={`w-full text-left px-4 py-4 rounded-lg border transition-all ${
            selectedId === prov.id
              ? 'border-brand-teal bg-brand-teal/5 shadow-sm'
              : 'border-stone-200 bg-white hover:border-brand-teal/50 hover:bg-brand-cream'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center shrink-0">
              <span className="text-white text-sm font-semibold">
                {prov.name.split(' ').filter(w => w !== 'Dr.').map(w => w[0]).join('').slice(0,2)}
              </span>
            </div>
            <div className="min-w-0">
              <p className={`font-medium text-sm ${selectedId === prov.id ? 'text-brand-teal' : 'text-brand-navy'}`}>
                {prov.name}
              </p>
              <p className="text-xs text-brand-slate/70">{prov.specialty}</p>
              {prov.credentials && (
                <p className="text-xs text-brand-gold font-medium">{prov.credentials}</p>
              )}
            </div>
          </div>
          {prov.bio && (
            <p className="text-xs text-brand-slate/60 mt-2 ml-14 line-clamp-2">{prov.bio}</p>
          )}
        </button>
      ))}
    </div>
  )
}
