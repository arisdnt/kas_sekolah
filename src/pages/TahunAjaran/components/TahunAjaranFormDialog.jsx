import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Switch, Button } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function TahunAjaranFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      nama: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status_aktif: false,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.nama || !formData.tanggal_mulai || !formData.tanggal_selesai) {
      setError('Semua field wajib diisi')
      setSubmitting(false)
      return
    }

    if (formData.tanggal_selesai <= formData.tanggal_mulai) {
      setError('Tanggal selesai harus setelah tanggal mulai')
      setSubmitting(false)
      return
    }

    if (formData.nama.length > 20) {
      setError('Nama maksimal 20 karakter')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        nama: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status_aktif: false,
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
          {isEdit ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit
            ? 'Perbarui informasi tahun ajaran'
            : 'Tambahkan periode tahun ajaran baru'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nama Tahun Ajaran <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                placeholder="Contoh: 2024/2025"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                maxLength={20}
                required
                style={{ borderRadius: 0 }}
              />
              <Text size="1" className="text-gray-500 mt-1">
                Maksimal 20 karakter
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tanggal Mulai <span className="text-red-600">*</span>
              </Text>
              <input
                type="date"
                value={formData.tanggal_mulai}
                onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tanggal Selesai <span className="text-red-600">*</span>
              </Text>
              <input
                type="date"
                value={formData.tanggal_selesai}
                onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Flex align="center" gap="2">
                <Switch
                  checked={formData.status_aktif}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status_aktif: checked })
                  }
                />
                <Text size="2" weight="medium">
                  Aktifkan tahun ajaran ini
                </Text>
              </Flex>
              <Text size="1" className="text-gray-500 mt-1">
                Hanya satu tahun ajaran yang bisa aktif
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

export default TahunAjaranFormDialog
