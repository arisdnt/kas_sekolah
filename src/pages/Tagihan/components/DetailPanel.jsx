import { Text } from '@radix-ui/themes'
import { Receipt, Clock, Calendar, User } from 'lucide-react'

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

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function DetailPanel({ selectedItem }) {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur items-center justify-center p-6">
        <div className="text-center text-slate-400">
          <Receipt className="h-16 w-16 mx-auto mb-4 text-slate-300" />
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
              Nomor Tagihan
            </Text>
            <Text size="4" weight="bold" className="text-slate-900 font-mono">
              {selectedItem.nomor_tagihan}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Judul
            </Text>
            <Text size="3" weight="medium" className="text-slate-900">
              {selectedItem.judul}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Total Tagihan
            </Text>
            <Text size="5" weight="bold" className="text-emerald-700">
              {formatCurrency(selectedItem.total_tagihan)}
            </Text>
            {selectedItem.rincian_tagihan && selectedItem.rincian_tagihan.length > 0 && (
              <Text size="2" className="text-slate-500 mt-1">
                {selectedItem.rincian_tagihan.length} item rincian
              </Text>
            )}
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
              Siswa
            </Text>
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-slate-400 mt-0.5" />
              <div>
                <Text size="3" weight="medium" className="text-slate-900">
                  {selectedItem.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
                </Text>
                {selectedItem.riwayat_kelas_siswa?.siswa?.nisn && (
                  <Text size="2" className="text-slate-500 font-mono mt-0.5">
                    NISN: {selectedItem.riwayat_kelas_siswa.siswa.nisn}
                  </Text>
                )}
              </div>
            </div>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Kelas
            </Text>
            <Text size="2" className="text-slate-700">
              {selectedItem.riwayat_kelas_siswa?.kelas
                ? `${selectedItem.riwayat_kelas_siswa.kelas.tingkat} ${selectedItem.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
                : '—'}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tahun Ajaran
            </Text>
            <Text size="2" className="text-slate-700">
              {selectedItem.riwayat_kelas_siswa?.tahun_ajaran?.nama || '—'}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tanggal Tagihan
            </Text>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Text size="3" weight="medium">
                {formatDate(selectedItem.tanggal_tagihan)}
              </Text>
            </div>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tanggal Jatuh Tempo
            </Text>
            <div className="flex items-center gap-2 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Text size="3" weight="medium">
                {formatDate(selectedItem.tanggal_jatuh_tempo)}
              </Text>
            </div>
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
              <Text size="2">{formatDateTime(selectedItem.tanggal_dibuat)}</Text>
            </div>
          </div>

          {selectedItem.tanggal_diperbarui && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Terakhir Diperbarui
              </Text>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <Text size="2">{formatDateTime(selectedItem.tanggal_diperbarui)}</Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
