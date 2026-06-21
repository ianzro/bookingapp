import { timeToMinutes, addMinutes } from './dateUtils'

/**
 * Generates available time slots for a provider on a given date,
 * filtered against existing bookings to prevent overlaps.
 *
 * @param {object} provider - Provider object with availability blocks
 * @param {string} date - ISO date string "YYYY-MM-DD"
 * @param {number} durationMinutes - Length of the service in minutes
 * @param {Array} existingBookings - All bookings to check for conflicts
 * @param {number} slotIntervalMinutes - Increment between slot start times
 * @returns {Array<{start: string, end: string}>} Available slots
 */
export function generateSlots(provider, date, durationMinutes, existingBookings, slotIntervalMinutes = 30) {
  const dayKey = ['sun','mon','tue','wed','thu','fri','sat'][new Date(date + 'T00:00:00').getDay()]
  const blocks = provider.availability?.[dayKey] || []

  const providerBookings = existingBookings.filter(
    b => b.providerId === provider.id && b.date === date && b.status !== 'cancelled'
  )

  const slots = []

  for (const block of blocks) {
    const blockStart = timeToMinutes(block.start)
    const blockEnd   = timeToMinutes(block.end)

    let cursor = blockStart
    while (cursor + durationMinutes <= blockEnd) {
      const slotStart = cursor
      const slotEnd   = cursor + durationMinutes

      const slotStartStr = minutesToTime(slotStart)
      const slotEndStr   = minutesToTime(slotEnd)

      const hasOverlap = providerBookings.some(b => {
        const bStart = timeToMinutes(b.startTime)
        const bEnd   = timeToMinutes(b.endTime)
        return slotStart < bEnd && slotEnd > bStart
      })

      if (!hasOverlap) {
        slots.push({ start: slotStartStr, end: slotEndStr })
      }

      cursor += slotIntervalMinutes
    }
  }

  return slots
}

function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`
}
