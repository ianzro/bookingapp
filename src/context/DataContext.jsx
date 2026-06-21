import { createContext, useContext, useState, useCallback } from 'react'
import { getItem, setItem, getArray, setArray } from '../utils/storage'
import { generateId } from '../utils/dateUtils'

const DataContext = createContext(null)

function useCollection(key) {
  const [items, setItems] = useState(() => getArray(key))

  const save = useCallback((next) => {
    setArray(key, next)
    setItems(next)
  }, [key])

  const add = useCallback((item) => {
    setItems(prev => {
      const next = [...prev, item]
      setArray(key, next)
      return next
    })
    return item
  }, [key])

  const update = useCallback((id, patch) => {
    setItems(prev => {
      const next = prev.map(i => i.id === id ? { ...i, ...patch, updatedAt: new Date().toISOString() } : i)
      setArray(key, next)
      return next
    })
  }, [key])

  const remove = useCallback((id) => {
    setItems(prev => {
      const next = prev.filter(i => i.id !== id)
      setArray(key, next)
      return next
    })
  }, [key])

  return { items, save, add, update, remove }
}

export function DataProvider({ children }) {
  // Clinic (singleton)
  const [clinic, setClinicState] = useState(() => getItem('derm_clinic') || {})
  const updateClinic = useCallback((patch) => {
    const next = { ...clinic, ...patch }
    setItem('derm_clinic', next)
    setClinicState(next)
  }, [clinic])

  const services   = useCollection('derm_services')
  const providers  = useCollection('derm_providers')
  const patients   = useCollection('derm_patients')
  const bookings   = useCollection('derm_bookings')
  const notifications = useCollection('derm_notifications')

  const addService = useCallback((data) => {
    return services.add({ ...data, id: generateId('svc'), isActive: true })
  }, [services])

  const addProvider = useCallback((data) => {
    return providers.add({ ...data, id: generateId('prov'), isActive: true })
  }, [providers])

  const addPatient = useCallback((data) => {
    return patients.add({
      ...data,
      id: generateId('pat'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }, [patients])

  const addBooking = useCallback((data) => {
    const booking = bookings.add({
      ...data,
      id: generateId('bkg'),
      status: data.status || 'pending',
      cancelReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
    // Fire notification
    notifications.add({
      id: generateId('notif'),
      type: 'new_booking',
      bookingId: booking.id,
      message: `New booking request`,
      read: false,
      createdAt: new Date().toISOString(),
    })
    return booking
  }, [bookings, notifications])

  const value = {
    clinic, updateClinic,
    services: services.items, addService, updateService: services.update, removeService: services.remove,
    providers: providers.items, addProvider, updateProvider: providers.update, removeProvider: providers.remove,
    patients: patients.items, addPatient, updatePatient: patients.update,
    bookings: bookings.items, addBooking, updateBooking: bookings.update,
    notifications: notifications.items, updateNotification: notifications.update,
    markNotificationRead: (id) => notifications.update(id, { read: true }),
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used inside DataProvider')
  return ctx
}
