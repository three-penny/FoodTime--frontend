const CST_TIMEZONE = 'Asia/Shanghai'

const dateTimeOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: CST_TIMEZONE,
}

const dateOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: CST_TIMEZONE,
}

const timeOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: CST_TIMEZONE,
}

function parseDate(value) {
  if (value instanceof Date) return value
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}

export function formatDateTime(iso) {
  const d = parseDate(iso)
  if (!d) return ''
  return d.toLocaleString('zh-CN', dateTimeOptions)
}

export function formatDate(iso) {
  const d = parseDate(iso)
  if (!d) return ''
  return d.toLocaleDateString('zh-CN', dateOptions)
}

export function formatTime(iso) {
  const d = parseDate(iso)
  if (!d) return ''
  return d.toLocaleTimeString('zh-CN', timeOptions)
}

export function formatShortDateTime(iso) {
  const d = parseDate(iso)
  if (!d) return ''
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: CST_TIMEZONE,
  })
}

export function getTodayDateString() {
  const now = new Date()
  return now.toLocaleDateString('zh-CN', dateOptions)
}
