import { useMemo } from 'react'
import { useData } from '../context/DataContext'
import { generateSlots } from '../utils/slotGenerator'

export function useAvailability(provider, date, durationMinutes) {
  const { bookings } = useData()

  return useMemo(() => {
    if (!provider || !date || !durationMinutes) return []
    return generateSlots(provider, date, durationMinutes, bookings)
  }, [provider, date, durationMinutes, bookings])
}
