import { Text, Badge } from '@radix-ui/themes'
import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
  })
}

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

function getStatusBadgeColor(status) {
  return status === 'verified' ? 'green' : status === 'pending' ? 'yellow' : 'red'
}

export function DetailPanel({ selectedItem }) {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur items-center justify-center p-6">
        <div className="text-center text-slate-400">
          <DollarSign className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <Text size="3" className="text-slate-500 mb-2">Tidak ada data dipilih</Text>
          <Text size="2" className="text-slate-400">Pilih baris pada tabel untuk melihat detail</Text>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Nomor Transaksi</Text>
            <Text size="4" weight="bold" className="text-slate-900 font-mono">{selectedItem.nomor_transaksi}</Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Jumlah Dibayar</Text>
            <Text size="5" weight="bold" className="text-emerald-700">{formatCurrency(selectedItem.jumlah_dibayar)}</Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Status</Text>
            <Badge variant="soft" color={getStatusBadgeColor(selectedItem.status)} size="3">
              {selectedItem.status === 'verified' ? 'Terverifikasi' : selectedItem.status === 'pending' ? 'Menunggu' : 'Ditolak'}
            </Badge>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Metode Pembayaran</Text>
            <Text size="3" weight="medium" className="text-slate-900 capitalize">{selectedItem.metode_pembayaran?.replace('_', ' ')}</Text>
          </div>

          {selectedItem.referensi_pembayaran && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Referensi</Text>
              <Text size="2" className="text-slate-700 font-mono">{selectedItem.referensi_pembayaran}</Text>
            </div>
          )}

          {selectedItem.cicilan_ke && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Cicilan Ke</Text>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 border-2 border-blue-200">
                <Text size="5" weight="bold" className="text-blue-700 font-mono">{selectedItem.cicilan_ke}</Text>
              </div>
            </div>
          )}

          {selectedItem.tanggal_verifikasi && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Tanggal Verifikasi</Text>
              <div className="flex items-center gap-2 text-slate-600">
                {selectedItem.status === 'verified' ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <Text size="2">{formatDateTime(selectedItem.tanggal_verifikasi)}</Text>
              </div>
            </div>
          )}

          {selectedItem.alasan_reject && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Alasan Penolakan</Text>
              <div className="p-3 bg-red-50 border border-red-200">
                <Text size="2" className="text-red-800">{selectedItem.alasan_reject}</Text>
              </div>
            </div>
          )}

          {selectedItem.catatan && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Catatan</Text>
              <Text size="2" className="text-slate-700 leading-relaxed">{selectedItem.catatan}</Text>
            </div>
          )}

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Tanggal Bayar</Text>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <Text size="2">{formatDateTime(selectedItem.tanggal_bayar)}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
