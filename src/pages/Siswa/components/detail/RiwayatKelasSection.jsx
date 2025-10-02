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
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-purple-600" />
          <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Riwayat Kelas
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {riwayatKelas.map((riwayat, index) => (
            <div 
              key={riwayat.id}
              className={`p-4 border-l-4 ${
                riwayat.status === 'aktif' 
                  ? 'border-green-500 bg-green-50/50' 
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${
                    riwayat.status === 'aktif' ? 'bg-green-100' : 'bg-slate-100'
                  }`} style={{ borderRadius: 0 }}>
                    <GraduationCap className={`h-5 w-5 ${
                      riwayat.status === 'aktif' ? 'text-green-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <Text size="3" weight="bold" className="text-slate-900 block">
                      {riwayat.tahun_ajaran?.nama || 'Tahun Ajaran Tidak Diketahui'}
                    </Text>
                    <Text size="2" className="text-slate-600">
                      Kelas {riwayat.kelas?.tingkat || '-'} {riwayat.kelas?.nama_sub_kelas || '-'}
                    </Text>
                  </div>
                </div>
                {getStatusBadge(riwayat.status)}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <Text size="1" className="text-slate-500">
                      Tanggal Masuk
                    </Text>
                    <Text size="2" weight="medium" className="text-slate-900">
                      {formatDate(riwayat.tanggal_masuk)}
                    </Text>
                  </div>
                </div>

                {riwayat.tanggal_keluar && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-red-600" />
                    <div>
                      <Text size="1" className="text-slate-500">
                        Tanggal Keluar
                      </Text>
                      <Text size="2" weight="medium" className="text-slate-900">
                        {formatDate(riwayat.tanggal_keluar)}
                      </Text>
                    </div>
                  </div>
                )}
              </div>

              {riwayat.catatan && (
                <div className="mt-3 p-2 bg-white border border-slate-200">
                  <Text size="1" weight="medium" className="text-slate-600 block mb-1">
                    Catatan:
                  </Text>
                  <Text size="2" className="text-slate-700">
                    {riwayat.catatan}
                  </Text>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
