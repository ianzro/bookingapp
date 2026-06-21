export function getItem(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getArray(key) {
  const val = getItem(key)
  return Array.isArray(val) ? val : []
}

export function setArray(key, arr) {
  setItem(key, arr)
}
