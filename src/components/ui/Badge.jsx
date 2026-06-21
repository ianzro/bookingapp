const STATUS_STYLES = {
  pending:   'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-teal-50 text-teal-700 border-teal-200',
  arrived:   'bg-blue-50 text-blue-700 border-blue-200',
  completed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
  no_show:   'bg-gray-100 text-gray-500 border-gray-200',
}

export function StatusBadge({ status }) {
  const label = status === 'no_show' ? 'No Show' : status.charAt(0).toUpperCase() + status.slice(1)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {label}
    </span>
  )
}

export function Badge({ children, color = 'gray' }) {
  const colors = {
    gray:  'bg-gray-100 text-gray-600',
    teal:  'bg-teal-50 text-teal-700',
    gold:  'bg-amber-50 text-amber-700',
    navy:  'bg-brand-navy text-white',
    red:   'bg-red-50 text-red-600',
    green: 'bg-green-50 text-green-700',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  )
}
