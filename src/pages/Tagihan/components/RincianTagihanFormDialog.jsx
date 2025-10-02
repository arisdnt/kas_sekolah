import { useState } from 'react'
import { Dialog, Flex, Text, Button, Select, TextField } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function RincianTagihanFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  jenisPembayaranList
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_tagihan: '',
      id_jenis_pembayaran: '',
      deskripsi: '',
      jumlah: '',
      urutan: 1,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Auto-fill jumlah dan deskripsi dari jenis pembayaran
  const handleJenisPembayaranChange = (jenisId) => {
    const jenis = jenisPembayaranList?.find(j => j.id === jenisId)
    setFormData({
      ...formData,
      id_jenis_pembayaran: jenisId,
      jumlah: jenis?.jumlah_default || formData.jumlah,
      deskripsi: jenis?.nama || formData.deskripsi
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_jenis_pembayaran || !formData.deskripsi || !formData.jumlah) {
      setError('Jenis Pembayaran, Deskripsi, dan Jumlah wajib diisi')
      setSubmitting(false)
      return
    }

    if (parseFloat(formData.jumlah) <= 0) {
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

  // Sync initialData changes
  useState(() => {
    if (initialData) setFormData(initialData)
  }, [initialData])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 500, borderRadius: 0 }}>
        <Dialog.Title>{isEdit ? 'Edit Item' : 'Tambah Item'}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit ? 'Perbarui item rincian tagihan' : 'Tambahkan item ke tagihan'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Jenis Pembayaran <span className="text-red-600">*</span>
              </Text>
              <Select.Root value={formData.id_jenis_pembayaran} onValueChange={handleJenisPembayaranChange} required>
                <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih jenis" className="cursor-pointer" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {jenisPembayaranList && jenisPembayaranList.length > 0 ? (
                    jenisPembayaranList.map((jenis) => (
                      <Select.Item key={jenis.id} value={jenis.id}>
                        {jenis.kode} - {jenis.nama}
                        {jenis.jumlah_default && ` (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(jenis.jumlah_default)})`}
                      </Select.Item>
                    ))
                  ) : (
                    <Select.Item value="" disabled>Tidak ada data</Select.Item>
                  )}
                </Select.Content>
              </Select.Root>
              <Text size="1" className="text-slate-500 mt-1">
                Jumlah akan terisi otomatis dari nilai default
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Deskripsi <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="SPP Bulan Januari 2024"
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Jumlah (Rp) <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                type="number"
                value={formData.jumlah}
                onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })}
                placeholder="500000"
                style={{ borderRadius: 0 }}
                min="0"
                step="1000"
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Urutan
              </Text>
              <TextField.Root
                type="number"
                value={formData.urutan}
                onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 1 })}
                style={{ borderRadius: 0 }}
                min="1"
              />
              <Text size="1" className="text-slate-500 mt-1">
                Urutan tampilan (default: {formData.urutan})
              </Text>
            </label>

            {error && (
              <Flex align="center" gap="2" className="p-2 bg-red-50 border border-red-200" style={{ borderRadius: 0 }}>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <Text size="2" className="text-red-800">{error}</Text>
              </Flex>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button type="button" variant="soft" color="gray" disabled={submitting} onClick={() => onOpenChange(false)} style={{ borderRadius: 0 }}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting} style={{ borderRadius: 0 }}>
              {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RincianTagihanFormDialog
