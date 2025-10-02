import { Text } from '@radix-ui/themes'
import { UserCheck, School, Calendar, Clock, FileText, AlertCircle } from 'lucide-react'
import { format, formatDistanceToNow, differenceInDays } from 'date-fns'
import { id } from 'date-fns/locale'

const FieldItem = ({ label, icon: Icon, children, className = '' }) => (
  <div className={`border-b border-slate-200 pb-3 ${className}`}>
    <div className="flex items-center gap-2 mb-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
      <Text size="1" className="text-slate-600 font-medium uppercase tracking-wide">
        {label}
      </Text>
    </div>
    <div className="pl-5">{children}</div>
  </div>
)

export function RiwayatWaliKelasDetailInfo({ riwayat }) {
  if (!riwayat) return null

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
    } catch {
      return '—'
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '—'
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id })
    } catch {
      return '—'
    }
  }

  const getRelativeTime = (dateString) => {
    if (!dateString) return ''
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id })
    } catch {
      return ''
    }
  }

  const calculateDuration = (startDate, endDate) => {
    if (!startDate) return '—'
    try {
      const start = new Date(startDate)
      const end = endDate ? new Date(endDate) : new Date()
      const days = differenceInDays(end, start)

      if (days < 30) return `${days} hari`
      if (days < 365) return `${Math.floor(days / 30)} bulan`

      const years = Math.floor(days / 365)
      const months = Math.floor((days % 365) / 30)
      return months > 0 ? `${years} tahun ${months} bulan` : `${years} tahun`
    } catch {
      return '—'
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      aktif: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: '✓ Aktif' },
      selesai: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', label: '◉ Selesai' },
      diganti: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: '🔄 Diganti' }
    }
    const config = statusConfig[status] || statusConfig.aktif
    return (
      <div className={`inline-flex items-center px-3 py-1.5 border ${config.border} ${config.bg} ${config.text}`}>
        <Text size="2" weight="medium">{config.label}</Text>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Wali Kelas Info */}
      <FieldItem label="Wali Kelas" icon={UserCheck}>
        <Text size="3" weight="bold" className="text-slate-900 leading-tight">
          {riwayat.wali_kelas?.nama || '—'}
        </Text>
        {riwayat.wali_kelas?.nip && (
          <Text size="1" className="text-slate-500 block mt-1">
            NIP: {riwayat.wali_kelas.nip}
          </Text>
        )}
      </FieldItem>

      {/* Kelas Info */}
      <FieldItem label="Kelas" icon={School}>
        <Text size="2" weight="medium" className="text-slate-800">
          {riwayat.kelas?.nama_kelas || '—'}
        </Text>
        {riwayat.kelas?.tingkat && (
          <Text size="1" className="text-slate-500 block mt-1">
            Tingkat: {riwayat.kelas.tingkat}
          </Text>
        )}
      </FieldItem>

      {/* Tahun Ajaran Info */}
      <FieldItem label="Tahun Ajaran" icon={Calendar}>
        <Text size="2" weight="medium" className="text-slate-800">
          {riwayat.tahun_ajaran?.nama || '—'}
        </Text>
        {riwayat.tahun_ajaran?.tanggal_mulai && riwayat.tahun_ajaran?.tanggal_selesai && (
          <Text size="1" className="text-slate-500 block mt-1">
            {formatDate(riwayat.tahun_ajaran.tanggal_mulai)} - {formatDate(riwayat.tahun_ajaran.tanggal_selesai)}
          </Text>
        )}
      </FieldItem>

      {/* Timeline Info */}
      <FieldItem label="Tanggal Mulai" icon={Calendar}>
        <Text size="2" className="text-slate-800">
          {formatDate(riwayat.tanggal_mulai)}
        </Text>
        {riwayat.tanggal_mulai && (
          <Text size="1" className="text-slate-500 block mt-1">
            {getRelativeTime(riwayat.tanggal_mulai)}
          </Text>
        )}
      </FieldItem>

      <FieldItem label="Tanggal Selesai" icon={Calendar}>
        <Text size="2" className="text-slate-800">
          {riwayat.tanggal_selesai ? formatDate(riwayat.tanggal_selesai) : '—'}
        </Text>
        {riwayat.tanggal_selesai && (
          <Text size="1" className="text-slate-500 block mt-1">
            {getRelativeTime(riwayat.tanggal_selesai)}
          </Text>
        )}
      </FieldItem>

      <FieldItem label="Durasi Menjabat" icon={Clock}>
        <Text size="2" className="text-slate-800">
          {calculateDuration(riwayat.tanggal_mulai, riwayat.tanggal_selesai)}
        </Text>
      </FieldItem>

      {/* Status */}
      <FieldItem label="Status" icon={AlertCircle}>
        {getStatusBadge(riwayat.status)}
      </FieldItem>

      {/* Catatan */}
      {riwayat.catatan && (
        <FieldItem label="Catatan" icon={FileText} className="border-b-0">
          <Text size="2" className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {riwayat.catatan}
          </Text>
        </FieldItem>
      )}

      {/* Metadata */}
      <div className="pt-4 mt-4 border-t-2 border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-slate-400" />
          <Text size="1" className="text-slate-500">
            Dibuat: {formatDateTime(riwayat.created_at)}
          </Text>
        </div>
        {riwayat.updated_at && riwayat.updated_at !== riwayat.created_at && (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-slate-400" />
            <Text size="1" className="text-slate-500">
              Diperbarui: {formatDateTime(riwayat.updated_at)}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
