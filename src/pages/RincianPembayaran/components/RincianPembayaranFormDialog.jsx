import { useState } from 'react'
import { Dialog, Flex, Text, Button, Select, TextArea, TextField } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

const METODE_PEMBAYARAN = ['transfer', 'tunai', 'va', 'qris', 'ewallet', 'kartu_kredit']

function RincianPembayaranFormDialog({ open, onOpenChange, onSubmit, initialData, isEdit, pembayaranList }) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_pembayaran: undefined,
      nomor_transaksi: '',
      jumlah_dibayar: '',
      tanggal_bayar: new Date().toISOString().split('T')[0],
      metode_pembayaran: 'transfer',
      referensi_pembayaran: '',
      catatan: '',
      status: 'pending',
      cicilan_ke: '',
      alasan_reject: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_pembayaran || !formData.nomor_transaksi || !formData.jumlah_dibayar || !formData.metode_pembayaran) {
      setError('Pembayaran, Nomor Transaksi, Jumlah, dan Metode wajib diisi')
      setSubmitting(false)
      return
    }

    if (parseFloat(formData.jumlah_dibayar) <= 0) {
      setError('Jumlah harus lebih dari 0')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 600, borderRadius: 0 }}>
        <Dialog.Title>{isEdit ? 'Edit Rincian Pembayaran' : 'Tambah Rincian Pembayaran'}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit ? 'Perbarui transaksi pembayaran' : 'Tambahkan transaksi pembayaran / cicilan'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Pembayaran <span className="text-red-600">*</span>
              </Text>
              <Select.Root value={formData.id_pembayaran} onValueChange={(value) => setFormData({ ...formData, id_pembayaran: value })} required>
                <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih pembayaran" className="cursor-pointer" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {pembayaranList?.length > 0 ? pembayaranList.map((p) => (
                    <Select.Item key={p.id} value={p.id}>
                      {p.nomor_pembayaran} - {p.tagihan?.riwayat_kelas_siswa?.siswa?.nama_lengkap || 'N/A'}
                    </Select.Item>
                  )) : <Select.Item value="no-data" disabled>Tidak ada data</Select.Item>}
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nomor Transaksi <span className="text-red-600">*</span>
              </Text>
              <TextField.Root value={formData.nomor_transaksi} onChange={(e) => setFormData({ ...formData, nomor_transaksi: e.target.value })} placeholder="TRX-2024-001" style={{ borderRadius: 0 }} required />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Jumlah (Rp) <span className="text-red-600">*</span>
              </Text>
              <TextField.Root type="number" value={formData.jumlah_dibayar} onChange={(e) => setFormData({ ...formData, jumlah_dibayar: e.target.value })} placeholder="500000" style={{ borderRadius: 0 }} min="0" step="1000" required />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Metode Pembayaran <span className="text-red-600">*</span>
              </Text>
              <Select.Root value={formData.metode_pembayaran} onValueChange={(value) => setFormData({ ...formData, metode_pembayaran: value })} required>
                <Select.Trigger style={{ borderRadius: 0, width: '100%' }} className="cursor-pointer" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {METODE_PEMBAYARAN.map(m => <Select.Item key={m} value={m} className="capitalize">{m.replace('_', ' ')}</Select.Item>)}
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tanggal Bayar <span className="text-red-600">*</span>
              </Text>
              <input type="date" value={formData.tanggal_bayar} onChange={(e) => setFormData({ ...formData, tanggal_bayar: e.target.value })} className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">Referensi Pembayaran</Text>
              <TextField.Root value={formData.referensi_pembayaran} onChange={(e) => setFormData({ ...formData, referensi_pembayaran: e.target.value })} placeholder="Nomor referensi / VA" style={{ borderRadius: 0 }} />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">Cicilan Ke</Text>
              <TextField.Root type="number" value={formData.cicilan_ke} onChange={(e) => setFormData({ ...formData, cicilan_ke: e.target.value })} placeholder="1, 2, 3..." style={{ borderRadius: 0 }} min="1" />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">Catatan</Text>
              <TextArea placeholder="Catatan (opsional)" value={formData.catatan} onChange={(e) => setFormData({ ...formData, catatan: e.target.value })} style={{ borderRadius: 0 }} rows={2} />
            </label>

            {error && (
              <Flex align="center" gap="2" className="p-2 bg-red-50 border border-red-200" style={{ borderRadius: 0 }}>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <Text size="2" className="text-red-800">{error}</Text>
              </Flex>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button type="button" variant="soft" color="gray" disabled={submitting} onClick={() => onOpenChange(false)} style={{ borderRadius: 0 }}>Batal</Button>
            <Button type="submit" disabled={submitting} style={{ borderRadius: 0 }}>{submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RincianPembayaranFormDialog
