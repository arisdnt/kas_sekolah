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
    <div className="bg-white border-l-4 border-indigo-600 shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <Text size="4" weight="bold" className="text-slate-800 uppercase tracking-wide">
            Riwayat Peminatan
          </Text>
        </div>

        <div className="space-y-3">
          {peminatan.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
              <div className="flex items-center gap-4 flex-1">
                <div>
                  <Text size="2" weight="bold" className="text-slate-900 block">
                    {item.peminatan?.nama || '-'}
                  </Text>
                  <Text size="1" className="text-slate-600">
                    {item.peminatan?.kode || '-'} • {item.tahun_ajaran?.nama || '-'} • Tingkat {item.tingkat}
                  </Text>
                </div>
                <div className="text-sm text-slate-600">
                  {formatDate(item.tanggal_mulai)} - {item.tanggal_selesai ? formatDate(item.tanggal_selesai) : 'Berlangsung'}
                </div>
                {item.catatan && (
                  <Text size="1" className="text-slate-500 italic">• {item.catatan}</Text>
                )}
              </div>
              {!item.tanggal_selesai && (
                <Badge color="blue" variant="solid" style={{ borderRadius: 0 }}>
                  Berlangsung
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
