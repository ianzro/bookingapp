export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed'
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3 text-sm' }
  const variants = {
    primary:   'bg-brand-teal text-white hover:bg-brand-teal-light',
    secondary: 'bg-white text-brand-navy border border-gray-200 hover:border-brand-teal hover:text-brand-teal',
    danger:    'bg-red-500 text-white hover:bg-red-600',
    ghost:     'text-brand-slate hover:bg-gray-100',
    gold:      'bg-brand-gold text-white hover:opacity-90',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
