export function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function getStatusBadgeColor(status) {
  switch (status) {
    case 'verified': return 'green'
    case 'pending': return 'yellow'
    case 'rejected': return 'red'
    default: return 'gray'
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'verified': return 'Terverifikasi'
    case 'pending': return 'Menunggu'
    case 'rejected': return 'Ditolak'
    default: return status
  }
}
