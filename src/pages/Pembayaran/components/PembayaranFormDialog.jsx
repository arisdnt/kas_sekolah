import { useState } from 'react'
import { Dialog, Flex, Text, Button, Select, TextArea, TextField } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function PembayaranFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  tagihanList
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_tagihan: '',
      nomor_pembayaran: '',
      catatan: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_tagihan || !formData.nomor_pembayaran) {
      setError('Tagihan dan Nomor Pembayaran wajib diisi')
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
        <Dialog.Title>{isEdit ? 'Edit Pembayaran' : 'Tambah Pembayaran'}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit ? 'Perbarui informasi pembayaran' : 'Buat header pembayaran untuk tagihan'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tagihan <span className="text-red-600">*</span>
              </Text>
              <Select.Root 
                value={formData.id_tagihan} 
                onValueChange={(value) => setFormData({ ...formData, id_tagihan: value })}
                required
              >
                <Select.Trigger 
                  style={{ borderRadius: 0, width: '100%' }}
                  placeholder="Pilih tagihan"
                  className="cursor-pointer"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  {tagihanList && tagihanList.length > 0 ? (
                    tagihanList.map((tagihan) => (
                      <Select.Item key={tagihan.id} value={tagihan.id}>
                        {tagihan.nomor_tagihan} - {tagihan.judul}
                        {tagihan.riwayat_kelas_siswa?.siswa?.nama_lengkap && 
                          ` (${tagihan.riwayat_kelas_siswa.siswa.nama_lengkap})`
                        }
                      </Select.Item>
                    ))
                  ) : (
                    <Select.Item value="" disabled>Tidak ada tagihan</Select.Item>
                  )}
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nomor Pembayaran <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                value={formData.nomor_pembayaran}
                onChange={(e) => setFormData({ ...formData, nomor_pembayaran: e.target.value })}
                placeholder="Contoh: PAY-2024-001"
                style={{ borderRadius: 0 }}
                required
              />
              <Text size="1" className="text-slate-500 mt-1">
                Nomor unik untuk identifikasi pembayaran
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Catatan
              </Text>
              <TextArea
                placeholder="Catatan pembayaran (opsional)"
                value={formData.catatan}
                onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                style={{ borderRadius: 0 }}
                rows={3}
              />
            </label>

            {error && (
              <Flex align="center" gap="2" className="p-2 bg-red-50 border border-red-200" style={{ borderRadius: 0 }}>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <Text size="2" className="text-red-800">{error}</Text>
              </Flex>
            )}
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Button 
              type="button"
              variant="soft" 
              color="gray" 
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              style={{ borderRadius: 0 }}
            >
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

export default PembayaranFormDialog
