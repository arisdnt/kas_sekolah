import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Button, Switch } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function WaliKelasFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      nama_lengkap: '',
      nip: '',
      nomor_telepon: '',
      email: '',
      status_aktif: true,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.nama_lengkap) {
      setError('Nama lengkap wajib diisi')
      setSubmitting(false)
      return
    }

    // Validasi email jika diisi
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Format email tidak valid')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        nama_lengkap: '',
        nip: '',
        nomor_telepon: '',
        email: '',
        status_aktif: true,
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
          maxWidth: 550,
          borderRadius: 0
        }}
      >
        <Dialog.Title>
          {isEdit ? 'Edit Wali Kelas' : 'Tambah Wali Kelas'}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit
            ? 'Perbarui informasi wali kelas'
            : 'Tambahkan data wali kelas baru'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nama Lengkap <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                placeholder="Masukkan nama lengkap"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                NIP
              </Text>
              <TextField.Root
                placeholder="Nomor Induk Pegawai"
                value={formData.nip}
                onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                style={{ borderRadius: 0 }}
              />
              <Text size="1" className="text-slate-500 mt-1">
                Opsional - Nomor identitas pegawai
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nomor Telepon
              </Text>
              <TextField.Root
                placeholder="Contoh: 08123456789"
                value={formData.nomor_telepon}
                onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                style={{ borderRadius: 0 }}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Email
              </Text>
              <TextField.Root
                type="email"
                placeholder="Contoh: nama@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ borderRadius: 0 }}
              />
              <Text size="1" className="text-slate-500 mt-1">
                Opsional - Untuk komunikasi
              </Text>
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
                  Status aktif
                </Text>
              </Flex>
              <Text size="1" className="text-slate-500 mt-1">
                Wali kelas dengan status aktif dapat ditugaskan
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

export default WaliKelasFormDialog
