import { Text, Badge } from '@radix-ui/themes'
import { BookOpen, Calendar } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function PeminatanSection({ peminatan }) {
  if (!peminatan || peminatan.length === 0) {
    return null
  }

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Riwayat Peminatan
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          {peminatan.map((item) => (
            <div 
              key={item.id}
              className={`p-4 border-l-4 ${
                !item.tanggal_selesai
                  ? 'border-indigo-500 bg-indigo-50/50' 
                  : 'border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${
                    !item.tanggal_selesai ? 'bg-indigo-100' : 'bg-slate-100'
                  }`} style={{ borderRadius: 0 }}>
                    <BookOpen className={`h-5 w-5 ${
                      !item.tanggal_selesai ? 'text-indigo-600' : 'text-slate-600'
                    }`} />
                  </div>
                  <div>
                    <Text size="3" weight="bold" className="text-slate-900 block">
                      {item.peminatan?.nama || 'Peminatan Tidak Diketahui'}
                    </Text>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge color="indigo" variant="soft" style={{ borderRadius: 0 }}>
                        {item.peminatan?.kode || '-'}
                      </Badge>
                      <Text size="1" className="text-slate-600">
                        • {item.tahun_ajaran?.nama || '-'} • Tingkat {item.tingkat}
                      </Text>
                    </div>
                  </div>
                </div>
                {!item.tanggal_selesai && (
                  <Badge color="blue" variant="solid" style={{ borderRadius: 0 }}>
                    Berlangsung
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <div>
                    <Text size="1" className="text-slate-500">
                      Tanggal Mulai
                    </Text>
                    <Text size="2" weight="medium" className="text-slate-900">
                      {formatDate(item.tanggal_mulai)}
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <div>
                    <Text size="1" className="text-slate-500">
                      Tanggal Selesai
                    </Text>
                    <Text size="2" weight="medium" className="text-slate-900">
                      {item.tanggal_selesai ? formatDate(item.tanggal_selesai) : 'Sedang Berlangsung'}
                    </Text>
                  </div>
                </div>
              </div>

              {item.catatan && (
                <div className="mt-3 p-2 bg-white border border-slate-200">
                  <Text size="1" weight="medium" className="text-slate-600 block mb-1">
                    Catatan:
                  </Text>
                  <Text size="2" className="text-slate-700">
                    {item.catatan}
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
