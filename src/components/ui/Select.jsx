export default function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-brand-navy transition
          focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
