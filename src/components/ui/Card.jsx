export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-white rounded-2xl shadow-luxury ${className}`} {...props}>
      {children}
    </div>
  )
}
