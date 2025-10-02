import { Text, Badge } from '@radix-ui/themes'
import { History, Calendar, GraduationCap } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function getStatusBadge(status) {
  const statusMap = {
    aktif: { color: 'green', label: 'Aktif' },
    pindah_kelas: { color: 'blue', label: 'Pindah Kelas' },
    lulus: { color: 'purple', label: 'Lulus' },
    keluar: { color: 'gray', label: 'Keluar' },
  }
  
  const config = statusMap[status] || { color: 'gray', label: status }
  
  return (
    <Badge color={config.color} variant="solid" style={{ borderRadius: 0 }}>
      {config.label}
    </Badge>
  )
}

export function RiwayatKelasSection({ riwayatKelas }) {
  if (!riwayatKelas || riwayatKelas.length === 0) {
    return null
  }

  return (
    <div className="bg-white border-l-4 border-purple-600 shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-purple-600" />
          <Text size="4" weight="bold" className="text-slate-800 uppercase tracking-wide">
            Riwayat Kelas
          </Text>
        </div>

        <div className="space-y-3">
          {riwayatKelas.map((riwayat) => (
            <div key={riwayat.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <Text size="2" weight="bold" className="text-slate-900 block">
                    {riwayat.tahun_ajaran?.nama || '-'}
                  </Text>
                  <Text size="1" className="text-slate-600">
                    Kelas {riwayat.kelas?.tingkat || '-'} {riwayat.kelas?.nama_sub_kelas || '-'}
                  </Text>
                </div>
                <div className="text-sm text-slate-600">
                  {formatDate(riwayat.tanggal_masuk)}
                  {riwayat.tanggal_keluar && ` - ${formatDate(riwayat.tanggal_keluar)}`}
                </div>
                {riwayat.catatan && (
                  <Text size="1" className="text-slate-500 italic">• {riwayat.catatan}</Text>
                )}
              </div>
              {getStatusBadge(riwayat.status)}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
