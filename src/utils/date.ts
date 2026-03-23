export function parseISO(date?: string) {
  return date ? new Date(date) : null
}

export function formatShort(date?: string) {
  const d = parseISO(date)
  return d ? d.toDateString() : ''
}
