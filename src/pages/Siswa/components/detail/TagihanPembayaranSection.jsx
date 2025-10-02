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
      <div className="border-2 border-slate-300 bg-white shadow-lg">
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-5 py-3">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-green-600" />
            <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
              Riwayat Tagihan & Pembayaran
            </Text>
          </div>
        </div>
        <div className="p-6 text-center">
          <Receipt className="h-16 w-16 text-slate-300 mx-auto mb-3" />
          <Text size="3" className="text-slate-500">
            Belum ada data tagihan dan pembayaran
          </Text>
        </div>
      </div>
    )
  }

  // Calculate grand total
  const grandTotal = {
    totalTagihan: tagihanData.reduce((sum, group) => sum + group.totalTagihan, 0),
    totalDibayar: tagihanData.reduce((sum, group) => sum + group.totalDibayar, 0),
  }
  grandTotal.sisaTagihan = grandTotal.totalTagihan - grandTotal.totalDibayar

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-green-600" />
            <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
              Riwayat Tagihan & Pembayaran
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Text size="2" className="text-slate-600">
              Total {tagihanData.reduce((sum, g) => sum + g.tagihan.length, 0)} Tagihan
            </Text>
          </div>
        </div>
      </div>

      {/* Content - Ledger Style */}
      <div className="p-6 bg-slate-50">
        <div className="space-y-6">
          {tagihanData.map((group, groupIndex) => (
            <div key={groupIndex} className="bg-white border-2 border-slate-300 shadow">
              {/* Group Header: Tahun Ajaran / Kelas */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 border-b-2 border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2" style={{ borderRadius: 0 }}>
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <Text size="4" weight="bold" className="text-white block">
                        {group.tahunAjaran} / Kelas {group.kelas}
                      </Text>
                    </div>
                  </div>
                  <Badge 
                    color={group.sisaTagihan <= 0 ? 'green' : 'red'} 
                    variant="solid" 
                    size="2"
                    style={{ borderRadius: 0 }}
                  >
                    {group.sisaTagihan <= 0 ? 'LUNAS' : `KURANG ${formatCurrency(group.sisaTagihan)}`}
                  </Badge>
                </div>
              </div>

              {/* Tagihan List */}
              <div className="divide-y divide-slate-200">
                {group.tagihan.map((tagihan) => (
                  <div key={tagihan.id} className="p-4">
                    {/* Tagihan Header */}
                    <div className="mb-3 pl-4 border-l-4 border-blue-500">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Text size="3" weight="bold" className="text-slate-900 block">
                            {tagihan.judul}
                          </Text>
                          <Text size="2" className="text-slate-600">
                            {tagihan.nomor_tagihan} • {formatDate(tagihan.tanggal_tagihan)}
                          </Text>
                        </div>
                        <Text size="3" weight="bold" className="text-blue-700">
                          {formatCurrency(tagihan.totalTagihan)}
                        </Text>
                      </div>

                      {/* Rincian Tagihan */}
                      {tagihan.rincian_tagihan && tagihan.rincian_tagihan.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {tagihan.rincian_tagihan.map((rincian) => (
                            <div key={rincian.id} className="flex items-center justify-between text-sm">
                              <Text size="1" className="text-slate-600">
                                • {rincian.deskripsi}
                              </Text>
                              <Text size="1" className="text-slate-700 font-mono">
                                {formatCurrency(rincian.jumlah)}
                              </Text>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pembayaran List */}
                    {tagihan.pembayaran && tagihan.pembayaran.length > 0 && (
                      <div className="ml-8 space-y-2">
                        {tagihan.pembayaran.map((pembayaran) => (
                          <div key={pembayaran.id}>
                            {pembayaran.rincian_pembayaran?.map((rincian) => (
                              <div 
                                key={rincian.id} 
                                className="flex items-center justify-between p-2 bg-green-50 border-l-4 border-green-500"
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                                  <div className="flex-1">
                                    <Text size="2" className="text-slate-700 block">
                                      Pembayaran: {rincian.nomor_transaksi}
                                    </Text>
                                    <Text size="1" className="text-slate-500">
                                      {formatDateTime(rincian.tanggal_bayar)} • {rincian.metode_pembayaran}
                                    </Text>
                                  </div>
                                </div>
                                <Text size="2" weight="bold" className="text-green-700 font-mono">
                                  {formatCurrency(rincian.jumlah_dibayar)}
                                </Text>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Status Tagihan */}
                    <div className={`mt-3 ml-8 p-3 border-2 ${
                      tagihan.sisaTagihan <= 0 
                        ? 'bg-green-50 border-green-300' 
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {tagihan.sisaTagihan <= 0 ? (
                            <>
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <Text size="2" weight="bold" className="text-green-800">
                                Status: LUNAS
                              </Text>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-5 w-5 text-red-600" />
                              <Text size="2" weight="bold" className="text-red-800">
                                Status: KURANG BAYAR
                              </Text>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <Text size="1" className="text-slate-600 block">
                            Terbayar: {formatCurrency(tagihan.totalDibayar)} dari {formatCurrency(tagihan.totalTagihan)}
                          </Text>
                          {tagihan.sisaTagihan > 0 && (
                            <Text size="2" weight="bold" className="text-red-700">
                              Sisa: {formatCurrency(tagihan.sisaTagihan)}
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Group Footer: Status Per Tahun/Kelas */}
              <div className={`border-t-2 px-4 py-3 ${
                group.sisaTagihan <= 0 
                  ? 'bg-green-50 border-green-300' 
                  : 'bg-red-50 border-red-300'
              }`}>
                <div className="flex items-center justify-between">
                  <Text size="3" weight="bold" className={group.sisaTagihan <= 0 ? 'text-green-800' : 'text-red-800'}>
                    Status Tahun Ajaran {group.tahunAjaran} - Kelas {group.kelas}
                  </Text>
                  <div className="text-right">
                    <Text size="2" className="text-slate-700 block">
                      Total: {formatCurrency(group.totalTagihan)} • Terbayar: {formatCurrency(group.totalDibayar)}
                    </Text>
                    <Badge 
                      color={group.sisaTagihan <= 0 ? 'green' : 'red'} 
                      variant="solid" 
                      size="3"
                      style={{ borderRadius: 0 }}
                    >
                      {group.sisaTagihan <= 0 ? '✓ LUNAS' : `! KURANG ${formatCurrency(group.sisaTagihan)}`}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grand Total */}
        <div className="mt-6 bg-gradient-to-r from-slate-800 to-slate-900 border-4 border-slate-700 shadow-xl">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/10 p-3" style={{ borderRadius: 0 }}>
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <Text size="5" weight="bold" className="text-white uppercase tracking-wider">
                  Total Keseluruhan
                </Text>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white/10">
                <Text size="2" className="text-slate-300 block mb-1">
                  Total Tagihan
                </Text>
                <Text size="4" weight="bold" className="text-white">
                  {formatCurrency(grandTotal.totalTagihan)}
                </Text>
              </div>
              <div className="text-center p-3 bg-white/10">
                <Text size="2" className="text-slate-300 block mb-1">
                  Total Dibayar
                </Text>
                <Text size="4" weight="bold" className="text-green-400">
                  {formatCurrency(grandTotal.totalDibayar)}
                </Text>
              </div>
              <div className={`text-center p-3 ${
                grandTotal.sisaTagihan <= 0 ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <Text size="2" className="text-white block mb-1">
                  {grandTotal.sisaTagihan <= 0 ? 'Status' : 'Sisa'}
                </Text>
                <Text size="4" weight="bold" className="text-white">
                  {grandTotal.sisaTagihan <= 0 ? '✓ LUNAS' : formatCurrency(grandTotal.sisaTagihan)}
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
