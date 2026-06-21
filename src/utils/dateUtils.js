const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const DAY_LABELS = {
  sun: 'Sunday', mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday',
}
const DAY_SHORT = {
  sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed',
  thu: 'Thu', fri: 'Fri', sat: 'Sat',
}

export function dayKeyFromDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return DAY_KEYS[d.getDay()]
}

export function dayLabel(key) { return DAY_LABELS[key] || key }
export function dayShort(key) { return DAY_SHORT[key] || key }
export { DAY_KEYS }

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  const [h, min] = timeStr.split(':').map(Number)
  const ampm = h < 12 ? 'AM' : 'PM'
  const hour = h % 12 || 12
  return `${hour}:${String(min).padStart(2,'0')} ${ampm}`
}

export function addMinutes(timeStr, minutes) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + minutes
  const rh = Math.floor(total / 60) % 24
  const rm = total % 60
  return `${String(rh).padStart(2,'0')}:${String(rm).padStart(2,'0')}`
}

export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number)
  return h * 60 + m
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function generateId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`
}
