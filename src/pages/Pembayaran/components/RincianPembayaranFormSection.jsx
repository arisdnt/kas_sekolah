import { Text, TextField, Select, TextArea, Button } from '@radix-ui/themes'
import { DollarSign, Plus, Trash2, Calendar, CreditCard, Hash, FileText } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function RincianPembayaranFormSection({
  rincianItems,
  onAdd,
  onRemove,
  onChange,
  totalPembayaran,
  nextCicilanKe,
  tagihanSummary
}) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex-1 overflow-hidden flex flex-col">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-slate-600" />
            <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
              Rincian Transaksi Pembayaran
            </Text>
          </div>
          <Button
            onClick={onAdd}
            size="1"
            style={{ borderRadius: 0 }}
            className="cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {tagihanSummary && (
        <div className="shrink-0 px-4 py-3 bg-blue-50 border-b-2 border-blue-200">
          <div className="flex items-center justify-between">
            <Text size="2" className="text-blue-700">
              <strong>Info:</strong> Cicilan berikutnya ke-{nextCicilanKe}
            </Text>
            <Text size="2" className="text-blue-700">
              Sisa tagihan: <strong>{formatCurrency(tagihanSummary.sisa)}</strong>
            </Text>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto p-4">
        {rincianItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <DollarSign className="h-16 w-16 text-slate-300 mb-4" />
            <Text size="3" className="text-slate-500 mb-2">
              Belum ada transaksi pembayaran
            </Text>
            <Text size="2" className="text-slate-400 mb-4">
              Klik tombol "Tambah Transaksi" untuk menambahkan transaksi pembayaran
            </Text>
            <Button
              onClick={onAdd}
              size="2"
              style={{ borderRadius: 0 }}
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Tambah Transaksi Pertama
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {rincianItems.map((item, index) => (
              <div 
                key={index}
                className="border-2 border-slate-300 bg-white shadow-sm"
              >
                <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2 border-b-2 border-slate-300 flex items-center justify-between">
                  <Text size="2" weight="bold" className="text-slate-700">
                    Transaksi #{index + 1} - Cicilan ke-{nextCicilanKe + index}
                  </Text>
                  <button
                    onClick={() => onRemove(index)}
                    className="p-1.5 hover:bg-red-100 text-red-600 transition-colors border border-transparent hover:border-red-300"
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Nomor Transaksi */}
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Hash className="h-3.5 w-3.5 text-blue-500" />
                        <Text size="2" weight="medium" className="text-slate-700">
                          Nomor Transaksi <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <TextField.Root
                        placeholder="Contoh: TRX-001"
                        value={item.nomor_transaksi}
                        onChange={(e) => onChange(index, 'nomor_transaksi', e.target.value)}
                        style={{ borderRadius: 0 }}
                      />
                    </div>

                    {/* Jumlah Dibayar */}
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <DollarSign className="h-3.5 w-3.5 text-green-500" />
                        <Text size="2" weight="medium" className="text-slate-700">
                          Jumlah Dibayar <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <TextField.Root
                        type="number"
                        placeholder="0"
                        value={item.jumlah_dibayar}
                        onChange={(e) => onChange(index, 'jumlah_dibayar', e.target.value)}
                        style={{ borderRadius: 0 }}
                      />
                    </div>

                    {/* Tanggal Bayar */}
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Calendar className="h-3.5 w-3.5 text-purple-500" />
                        <Text size="2" weight="medium" className="text-slate-700">
                          Tanggal Bayar <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <TextField.Root
                        type="date"
                        value={item.tanggal_bayar}
                        onChange={(e) => onChange(index, 'tanggal_bayar', e.target.value)}
                        style={{ borderRadius: 0 }}
                      />
                    </div>

                    {/* Metode Pembayaran */}
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
                        <Text size="2" weight="medium" className="text-slate-700">
                          Metode Pembayaran <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <Select.Root
                        value={item.metode_pembayaran}
                        onValueChange={(value) => onChange(index, 'metode_pembayaran', value)}
                      >
                        <Select.Trigger style={{ borderRadius: 0 }} className="w-full" placeholder="Pilih metode" />
                        <Select.Content style={{ borderRadius: 0 }}>
                          <Select.Item value="cash">Tunai (Cash)</Select.Item>
                          <Select.Item value="transfer">Transfer Bank</Select.Item>
                          <Select.Item value="qris">QRIS</Select.Item>
                          <Select.Item value="e-wallet">E-Wallet (GoPay/OVO/Dana)</Select.Item>
                          <Select.Item value="kartu_debit">Kartu Debit</Select.Item>
                          <Select.Item value="kartu_kredit">Kartu Kredit</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>

                    {/* Referensi Pembayaran */}
                    <div className="col-span-2">
                      <label className="flex items-center gap-1.5 mb-2">
                        <Hash className="h-3.5 w-3.5 text-slate-500" />
                        <Text size="2" weight="medium" className="text-slate-700">
                          Referensi Pembayaran
                        </Text>
                      </label>
                      <TextField.Root
                        placeholder="No. referensi bank / kode transaksi (opsional)"
                        value={item.referensi_pembayaran}
                        onChange={(e) => onChange(index, 'referensi_pembayaran', e.target.value)}
                        style={{ borderRadius: 0 }}
                      />
                      <Text size="1" className="text-slate-500 mt-1">
                        Contoh: REF123456, no. rekening pengirim, atau kode QRIS
                      </Text>
                    </div>

                    {/* Catatan */}
                    <div className="col-span-2">
                      <label className="flex items-center gap-1.5 mb-2">
                        <FileText className="h-3.5 w-3.5 text-slate-500" />
                        <Text size="2" weight="medium" className="text-slate-700">
                          Catatan Transaksi
                        </Text>
                      </label>
                      <TextArea
                        placeholder="Catatan untuk transaksi ini (opsional)"
                        value={item.catatan}
                        onChange={(e) => onChange(index, 'catatan', e.target.value)}
                        style={{ borderRadius: 0, minHeight: '60px' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Total */}
      {rincianItems.length > 0 && (
        <div className="shrink-0 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
          <div className="flex items-center justify-between">
            <Text size="3" weight="bold" className="text-slate-700">
              Total Pembayaran:
            </Text>
            <Text size="5" weight="bold" className="text-green-600 font-mono">
              {formatCurrency(totalPembayaran)}
            </Text>
          </div>
          {tagihanSummary && totalPembayaran > tagihanSummary.sisa && (
            <div className="mt-2 px-3 py-2 bg-amber-50 border-2 border-amber-200">
              <Text size="1" className="text-amber-700">
                ⚠️ Peringatan: Total pembayaran melebihi sisa tagihan ({formatCurrency(tagihanSummary.sisa)})
              </Text>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
