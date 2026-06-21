/**
 * Finds patients whose email or mobile matches the given values.
 * Returns an array of matching patient objects (may be empty).
 */
export function findDuplicatePatients(patients, { email, mobile }) {
  const normEmail  = email?.trim().toLowerCase()
  const normMobile = mobile?.trim()
  return patients.filter(p => {
    const emailMatch  = normEmail  && p.email?.toLowerCase() === normEmail
    const mobileMatch = normMobile && p.mobile === normMobile
    return emailMatch || mobileMatch
  })
}
