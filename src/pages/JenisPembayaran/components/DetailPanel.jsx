import { Text, Badge } from '@radix-ui/themes'
import { CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react'

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

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

function getTipeBadgeColor(tipe) {
  switch (tipe) {
    case 'bulanan': return 'blue'
    case 'tahunan': return 'purple'
    case 'sekali': return 'green'
    default: return 'gray'
  }
}

export function DetailPanel({ selectedItem }) {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur items-center justify-center p-6">
        <div className="text-center text-slate-400">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-slate-300" />
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
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Kode
            </Text>
            <Text size="4" weight="bold" className="text-slate-900 font-mono uppercase">
              {selectedItem.kode}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Nama
            </Text>
            <Text size="3" weight="medium" className="text-slate-900">
              {selectedItem.nama}
            </Text>
          </div>

          {selectedItem.deskripsi && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Deskripsi
              </Text>
              <Text size="2" className="text-slate-700 leading-relaxed">
                {selectedItem.deskripsi}
              </Text>
            </div>
          )}

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Jumlah Default
            </Text>
            <Text size="4" weight="bold" className="text-emerald-700">
              {formatCurrency(selectedItem.jumlah_default)}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tipe Pembayaran
            </Text>
            <Badge
              variant="soft"
              color={getTipeBadgeColor(selectedItem.tipe_pembayaran)}
              size="3"
              className="capitalize"
            >
              {selectedItem.tipe_pembayaran}
            </Badge>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tahun Ajaran
            </Text>
            <Text size="2" className="text-slate-700">
              {selectedItem.tahun_ajaran?.nama || '—'}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Kelas
            </Text>
            <Text size="2" className="text-slate-700">
              {selectedItem.kelas ? `${selectedItem.kelas.tingkat} ${selectedItem.kelas.nama_sub_kelas}` : '—'}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Sifat Pembayaran
            </Text>
            <div className="flex items-center gap-2">
              {selectedItem.wajib ? (
                <>
                  <CheckCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="soft" color="red" size="2">
                    Wajib
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-gray-400" />
                  <Badge variant="soft" color="gray" size="2">
                    Opsional
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Status
            </Text>
            <Badge
              variant="soft"
              color={selectedItem.status_aktif ? 'green' : 'gray'}
              size="3"
            >
              {selectedItem.status_aktif ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              ID
            </Text>
            <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-3 py-2 border border-slate-200">
              {selectedItem.id}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Dibuat Pada
            </Text>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <Text size="2">{formatDateTime(selectedItem.dibuat_pada)}</Text>
            </div>
          </div>

          {selectedItem.diperbarui_pada && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Terakhir Diperbarui
              </Text>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <Text size="2">{formatDateTime(selectedItem.diperbarui_pada)}</Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
