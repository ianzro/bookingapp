// SHA-256 hashes of seed passwords (computed via Web Crypto / sha256sum):
// Admin123! → 3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121
// Staff123! → 05dd4a1376a72d9a5e0fad32000f7e61651a5cef5c9c9a0c3816c7443dafbf6f

const SEED_VERSION = '1'

const clinic = {
  id: 'clinic_01',
  name: 'Lumière Dermatology',
  tagline: 'Advanced Skincare & Aesthetic Medicine',
  address: '12F The Grand Tower, Ayala Ave, Makati City',
  phone: '+63 2 8888 0000',
  email: 'hello@lumierederm.ph',
  website: 'https://lumierederm.ph',
  businessHours: {
    mon: { open: '08:00', close: '18:00', enabled: true },
    tue: { open: '08:00', close: '18:00', enabled: true },
    wed: { open: '08:00', close: '18:00', enabled: true },
    thu: { open: '08:00', close: '18:00', enabled: true },
    fri: { open: '08:00', close: '18:00', enabled: true },
    sat: { open: '09:00', close: '15:00', enabled: true },
    sun: { open: null,    close: null,    enabled: false },
  },
}

const services = [
  {
    id: 'svc_001',
    name: 'Acne Consultation',
    category: 'Consultation',
    description: 'In-depth consultation to assess acne type, triggers, and treatment plan.',
    durationMinutes: 30,
    price: 1500,
    isActive: true,
  },
  {
    id: 'svc_002',
    name: 'HydraFacial',
    category: 'Facial Treatment',
    description: 'Medical-grade resurfacing treatment that cleanses, extracts, and hydrates.',
    durationMinutes: 60,
    price: 4500,
    isActive: true,
  },
  {
    id: 'svc_003',
    name: 'Laser Resurfacing',
    category: 'Laser',
    description: 'Fractional laser treatment for skin texture, scars, and pigmentation.',
    durationMinutes: 90,
    price: 12000,
    isActive: true,
  },
  {
    id: 'svc_004',
    name: 'Chemical Peel',
    category: 'Facial Treatment',
    description: 'Controlled exfoliation for brighter, smoother skin.',
    durationMinutes: 45,
    price: 3000,
    isActive: true,
  },
  {
    id: 'svc_005',
    name: 'Wart Removal',
    category: 'Minor Procedure',
    description: 'Safe removal of common and plantar warts using electrocautery or cryotherapy.',
    durationMinutes: 30,
    price: 2000,
    isActive: true,
  },
  {
    id: 'svc_006',
    name: 'Botox / Filler Consultation',
    category: 'Consultation',
    description: 'Assessment and planning for botulinum toxin or dermal filler treatments.',
    durationMinutes: 45,
    price: 1500,
    isActive: true,
  },
  {
    id: 'svc_007',
    name: 'Microneedling',
    category: 'Skin Rejuvenation',
    description: 'Collagen induction therapy for fine lines, scars, and overall skin renewal.',
    durationMinutes: 60,
    price: 6000,
    isActive: true,
  },
]

const providers = [
  {
    id: 'prov_001',
    name: 'Dr. Elena Santos',
    specialty: 'Cosmetic Dermatology',
    credentials: 'MD, DPDS',
    bio: 'Board-certified dermatologist with 12 years of experience in cosmetic and medical dermatology. Specializes in laser treatments and aesthetic procedures.',
    serviceIds: ['svc_001', 'svc_002', 'svc_003', 'svc_006', 'svc_007'],
    availability: {
      mon: [{ start: '09:00', end: '17:00' }],
      tue: [{ start: '09:00', end: '17:00' }],
      wed: [],
      thu: [{ start: '13:00', end: '18:00' }],
      fri: [{ start: '09:00', end: '17:00' }],
      sat: [{ start: '09:00', end: '13:00' }],
      sun: [],
    },
    isActive: true,
  },
  {
    id: 'prov_002',
    name: 'Dr. Marco Reyes',
    specialty: 'Clinical & Medical Dermatology',
    credentials: 'MD, FPDS',
    bio: 'Fellow of the Philippine Dermatological Society with expertise in acne management, skin infections, and minor dermatological procedures.',
    serviceIds: ['svc_001', 'svc_004', 'svc_005'],
    availability: {
      mon: [{ start: '08:00', end: '12:00' }],
      tue: [{ start: '08:00', end: '17:00' }],
      wed: [{ start: '08:00', end: '17:00' }],
      thu: [{ start: '08:00', end: '12:00' }],
      fri: [{ start: '08:00', end: '17:00' }],
      sat: [],
      sun: [],
    },
    isActive: true,
  },
]

const users = [
  {
    id: 'usr_admin',
    email: 'admin@lumierederm.ph',
    passwordHash: '3eb3fe66b31e3b4d10fa70b5cad49c7112294af6ae4e476a1c405155d45aa121',
    role: 'admin',
    name: 'Admin User',
  },
  {
    id: 'usr_staff',
    email: 'staff@lumierederm.ph',
    passwordHash: '05dd4a1376a72d9a5e0fad32000f7e61651a5cef5c9c9a0c3816c7443dafbf6f',
    role: 'staff',
    name: 'Front Desk',
  },
]

const patients = [
  {
    id: 'pat_001',
    firstName: 'Maria',
    lastName: 'Dela Cruz',
    email: 'maria@example.com',
    mobile: '+63 917 123 4567',
    dateOfBirth: '1990-04-15',
    gender: 'female',
    notes: 'Sensitive skin; allergic to salicylic acid.',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'pat_002',
    firstName: 'James',
    lastName: 'Tan',
    email: 'james.tan@example.com',
    mobile: '+63 918 987 6543',
    dateOfBirth: '1985-11-22',
    gender: 'male',
    notes: '',
    createdAt: '2026-02-03T10:30:00Z',
    updatedAt: '2026-02-03T10:30:00Z',
  },
]

const bookings = [
  {
    id: 'bkg_001',
    patientId: 'pat_001',
    providerId: 'prov_001',
    serviceId: 'svc_001',
    date: '2026-06-25',
    startTime: '10:00',
    endTime: '10:30',
    status: 'confirmed',
    cancelReason: null,
    notes: '',
    bookedBy: 'patient',
    createdAt: '2026-06-20T09:00:00Z',
    updatedAt: '2026-06-20T09:00:00Z',
  },
  {
    id: 'bkg_002',
    patientId: 'pat_002',
    providerId: 'prov_002',
    serviceId: 'svc_004',
    date: '2026-06-25',
    startTime: '09:00',
    endTime: '09:45',
    status: 'pending',
    cancelReason: null,
    notes: '',
    bookedBy: 'patient',
    createdAt: '2026-06-21T07:15:00Z',
    updatedAt: '2026-06-21T07:15:00Z',
  },
]

const notifications = [
  {
    id: 'notif_001',
    type: 'new_booking',
    bookingId: 'bkg_002',
    message: 'New booking request from James Tan',
    read: false,
    createdAt: '2026-06-21T07:15:00Z',
  },
]

export function seedLocalStorage() {
  const current = localStorage.getItem('derm_seed_version')
  if (current === SEED_VERSION) return

  localStorage.setItem('derm_clinic',         JSON.stringify(clinic))
  localStorage.setItem('derm_services',        JSON.stringify(services))
  localStorage.setItem('derm_providers',       JSON.stringify(providers))
  localStorage.setItem('derm_users',           JSON.stringify(users))
  localStorage.setItem('derm_patients',        JSON.stringify(patients))
  localStorage.setItem('derm_bookings',        JSON.stringify(bookings))
  localStorage.setItem('derm_notifications',   JSON.stringify(notifications))
  // Don't overwrite an active session on re-seed
  if (!localStorage.getItem('derm_session')) {
    localStorage.setItem('derm_session', JSON.stringify(null))
  }

  localStorage.setItem('derm_seed_version', SEED_VERSION)
}

export { clinic, services, providers, users, patients, bookings, notifications, SEED_VERSION }
