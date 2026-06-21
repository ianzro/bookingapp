import Input from '../ui/Input'

export default function AppointmentFilters({ providers, filters, onChange }) {
  function set(key, val) { onChange({ ...filters, [key]: val }) }

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        label="From"
        type="date"
        value={filters.dateFrom}
        onChange={e => set('dateFrom', e.target.value)}
        className="w-40"
      />
      <Input
        label="To"
        type="date"
        value={filters.dateTo}
        onChange={e => set('dateTo', e.target.value)}
        className="w-40"
      />
      <div className="w-44">
        <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
          Provider
        </label>
        <select
          value={filters.providerId}
          onChange={e => set('providerId', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-brand-navy
            focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
        >
          <option value="">All Providers</option>
          {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="w-40">
        <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
          Status
        </label>
        <select
          value={filters.status}
          onChange={e => set('status', e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-brand-navy
            focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="arrived">Arrived</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
      </div>
      <button
        onClick={() => onChange({ dateFrom: '', dateTo: '', providerId: '', status: '' })}
        className="text-xs text-brand-teal hover:underline font-medium pb-2.5"
      >
        Clear filters
      </button>
    </div>
  )
}
