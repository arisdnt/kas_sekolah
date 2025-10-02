import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Button } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function KelasFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      tingkat: '',
      nama_sub_kelas: '',
      kapasitas_maksimal: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.tingkat || !formData.nama_sub_kelas) {
      setError('Tingkat dan Nama Kelas wajib diisi')
      setSubmitting(false)
      return
    }

    if (formData.kapasitas_maksimal && formData.kapasitas_maksimal <= 0) {
      setError('Kapasitas maksimal harus lebih dari 0')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        tingkat: '',
        nama_sub_kelas: '',
        kapasitas_maksimal: '',
      })
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: 500,
          borderRadius: 0
        }}
      >
        <Dialog.Title>
          {isEdit ? 'Edit Kelas' : 'Tambah Kelas'}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit
            ? 'Perbarui informasi kelas'
            : 'Tambahkan kelas baru ke sistem'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tingkat <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                placeholder="Contoh: 10, 11, 12"
                value={formData.tingkat}
                onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                style={{ borderRadius: 0 }}
                required
              />
              <Text size="1" className="text-slate-500 mt-1">
                Tingkat kelas (10, 11, 12, dst)
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nama Kelas <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                placeholder="Contoh: A, B, IPA-1, IPS-2"
                value={formData.nama_sub_kelas}
                onChange={(e) => setFormData({ ...formData, nama_sub_kelas: e.target.value })}
                style={{ borderRadius: 0 }}
                required
              />
              <Text size="1" className="text-slate-500 mt-1">
                Nama sub-kelas atau jurusan
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Kapasitas Maksimal
              </Text>
              <TextField.Root
                type="number"
                placeholder="Contoh: 30"
                value={formData.kapasitas_maksimal}
                onChange={(e) => setFormData({ ...formData, kapasitas_maksimal: e.target.value })}
                style={{ borderRadius: 0 }}
                min="1"
              />
              <Text size="1" className="text-slate-500 mt-1">
                Jumlah maksimal siswa (opsional)
              </Text>
            </label>

            {error && (
              <Flex align="center" gap="2" className="p-2 bg-red-50 border border-red-200" style={{ borderRadius: 0 }}>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <Text size="2" className="text-red-800">
                  {error}
                </Text>
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

export default KelasFormDialog
