export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-widest text-brand-slate mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2.5 rounded-xl border text-sm text-brand-navy placeholder-gray-300 transition
          focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-transparent
          ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
