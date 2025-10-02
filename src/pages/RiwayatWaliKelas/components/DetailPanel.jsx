import { Text, Badge } from '@radix-ui/themes'
import { UserCheck, Clock, Calendar } from 'lucide-react'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'aktif': return 'green'
    case 'selesai': return 'gray'
    default: return 'gray'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'aktif': return 'Aktif'
    case 'selesai': return 'Selesai'
    default: return status
  }
}

export function DetailPanel({ selectedItem }) {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur items-center justify-center p-6">
        <div className="text-center text-slate-400">
          <UserCheck className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <Text size="3" className="text-slate-500 mb-2">
            Tidak ada data dipilih
          </Text>
          <Text size="2" className="text-slate-400">
            Pilih baris pada tabel untuk melihat detail
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Status */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Status Penugasan
            </Text>
            <Badge
              variant="soft"
              color={getStatusBadgeColor(selectedItem.status)}
              size="3"
            >
              {getStatusLabel(selectedItem.status)}
            </Badge>
          </div>

          {/* Wali Kelas */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Wali Kelas
            </Text>
            <Text size="4" weight="bold" className="text-slate-900">
              {selectedItem.wali_kelas?.nama_lengkap || '—'}
            </Text>
            {selectedItem.wali_kelas?.nip && (
              <Text size="2" className="text-slate-500 mt-1">
                NIP: {selectedItem.wali_kelas.nip}
              </Text>
            )}
          </div>

          {/* Kelas */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Kelas yang Diampu
            </Text>
            <Text size="3" weight="medium" className="text-slate-900">
              {selectedItem.kelas ? `${selectedItem.kelas.tingkat} ${selectedItem.kelas.nama_sub_kelas}` : '—'}
            </Text>
          </div>

          {/* Tahun Ajaran */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tahun Ajaran
            </Text>
            <Text size="3" weight="medium" className="text-slate-900">
              {selectedItem.tahun_ajaran?.nama || '—'}
            </Text>
          </div>

          {/* Tanggal Mulai */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tanggal Mulai
            </Text>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Text size="3" weight="medium">
                {formatDate(selectedItem.tanggal_mulai)}
              </Text>
            </div>
          </div>

          {/* Tanggal Selesai */}
          {selectedItem.tanggal_selesai && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Tanggal Selesai
              </Text>
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="h-4 w-4 text-slate-400" />
                <Text size="3" weight="medium">
                  {formatDate(selectedItem.tanggal_selesai)}
                </Text>
              </div>
            </div>
          )}

          {/* Catatan */}
          {selectedItem.catatan && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Catatan
              </Text>
              <Text size="2" className="text-slate-700 leading-relaxed">
                {selectedItem.catatan}
              </Text>
            </div>
          )}

          {/* ID */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              ID
            </Text>
            <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-3 py-2 border border-slate-200">
              {selectedItem.id}
            </Text>
          </div>

          {/* Dibuat */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Dibuat Pada
            </Text>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <Text size="2">
                {formatDateTime(selectedItem.dibuat_pada)}
              </Text>
            </div>
          </div>

          {/* Diperbarui */}
          {selectedItem.diperbarui_pada && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Terakhir Diperbarui
              </Text>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <Text size="2">
                  {formatDateTime(selectedItem.diperbarui_pada)}
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
