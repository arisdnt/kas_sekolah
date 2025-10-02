import { Text, Badge } from '@radix-ui/themes'
import { Receipt, DollarSign, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function TagihanPembayaranSection({ tagihanData }) {
  if (!tagihanData || tagihanData.length === 0) {
    return (
      <div className="bg-white border-l-4 border-green-600 shadow-sm">
        <div className="p-5 text-center">
          <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <Text size="2" className="text-slate-500">Belum ada data tagihan dan pembayaran</Text>
        </div>
      </div>
    )
  }

  const grandTotal = {
    totalTagihan: tagihanData.reduce((sum, group) => sum + group.totalTagihan, 0),
    totalDibayar: tagihanData.reduce((sum, group) => sum + group.totalDibayar, 0),
  }
  grandTotal.sisaTagihan = grandTotal.totalTagihan - grandTotal.totalDibayar

  return (
    <div className="bg-white border-l-4 border-green-600 shadow-sm">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-green-600" />
            <Text size="4" weight="bold" className="text-slate-800 uppercase tracking-wide">
              Tagihan & Pembayaran
            </Text>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">Total: {formatCurrency(grandTotal.totalTagihan)}</span>
            <span className="text-green-600">Dibayar: {formatCurrency(grandTotal.totalDibayar)}</span>
            <Badge color={grandTotal.sisaTagihan <= 0 ? 'green' : 'red'} variant="solid" style={{ borderRadius: 0 }}>
              {grandTotal.sisaTagihan <= 0 ? 'LUNAS' : `Sisa: ${formatCurrency(grandTotal.sisaTagihan)}`}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          {tagihanData.map((group, groupIndex) => (
            <div key={groupIndex}>
              <div className="bg-slate-100 px-3 py-2 mb-2">
                <div className="flex items-center justify-between">
                  <Text size="2" weight="bold" className="text-slate-800">
                    {group.tahunAjaran} / Kelas {group.kelas}
                  </Text>
                  <Badge color={group.sisaTagihan <= 0 ? 'green' : 'red'} style={{ borderRadius: 0 }}>
                    {group.sisaTagihan <= 0 ? 'LUNAS' : `Kurang ${formatCurrency(group.sisaTagihan)}`}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 ml-3">
                {group.tagihan.map((tagihan) => (
                  <div key={tagihan.id} className="border-l-2 border-blue-400 pl-3">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <Text size="2" weight="bold" className="text-slate-900">{tagihan.judul}</Text>
                        <Text size="1" className="text-slate-500">{tagihan.nomor_tagihan} • {formatDate(tagihan.tanggal_tagihan)}</Text>
                      </div>
                      <Text size="2" weight="bold" className="text-blue-700">{formatCurrency(tagihan.totalTagihan)}</Text>
                    </div>

                    {tagihan.pembayaran && tagihan.pembayaran.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {tagihan.pembayaran.map((pembayaran) => (
                          <div key={pembayaran.id}>
                            {pembayaran.rincian_pembayaran?.map((rincian) => (
                              <div key={rincian.id} className="flex items-center justify-between text-xs text-slate-600 py-1">
                                <span>✓ {rincian.nomor_transaksi} • {formatDate(rincian.tanggal_bayar)} • {rincian.metode_pembayaran}</span>
                                <span className="text-green-700 font-mono">{formatCurrency(rincian.jumlah_dibayar)}</span>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-1 flex items-center justify-between text-xs">
                      <span className={tagihan.sisaTagihan <= 0 ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                        {tagihan.sisaTagihan <= 0 ? '✓ Lunas' : `! Kurang ${formatCurrency(tagihan.sisaTagihan)}`}
                      </span>
                      <span className="text-slate-500">Terbayar: {formatCurrency(tagihan.totalDibayar)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
