import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Button, Select, Switch, TextArea } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function SiswaFormDialog({ 
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
      nisn: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat: '',
      nomor_whatsapp_wali: '',
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

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        nama_lengkap: '',
        nisn: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        nomor_whatsapp_wali: '',
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
          maxWidth: 600,
          borderRadius: 0
        }}
      >
        <Dialog.Title>
          {isEdit ? 'Edit Siswa' : 'Tambah Siswa'}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit
            ? 'Perbarui informasi siswa'
            : 'Tambahkan siswa baru ke sistem'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nama Lengkap <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                placeholder="Masukkan nama lengkap siswa"
                value={formData.nama_lengkap}
                onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                NISN
              </Text>
              <TextField.Root
                placeholder="Nomor Induk Siswa Nasional"
                value={formData.nisn}
                onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                style={{ borderRadius: 0 }}
              />
              <Text size="1" className="text-slate-500 mt-1">
                Opsional - Nomor identitas siswa
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tanggal Lahir
              </Text>
              <input
                type="date"
                value={formData.tanggal_lahir}
                onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Jenis Kelamin
              </Text>
              <Select.Root 
                value={formData.jenis_kelamin} 
                onValueChange={(value) => setFormData({ ...formData, jenis_kelamin: value })}
              >
                <Select.Trigger 
                  style={{ borderRadius: 0, width: '100%' }}
                  placeholder="Pilih jenis kelamin"
                  className="cursor-pointer"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="Laki-laki">Laki-laki</Select.Item>
                  <Select.Item value="Perempuan">Perempuan</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Alamat
              </Text>
              <TextArea
                placeholder="Alamat lengkap siswa"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                style={{ borderRadius: 0 }}
                rows={3}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nomor WhatsApp Wali
              </Text>
              <TextField.Root
                placeholder="Contoh: 08123456789"
                value={formData.nomor_whatsapp_wali}
                onChange={(e) => setFormData({ ...formData, nomor_whatsapp_wali: e.target.value })}
                style={{ borderRadius: 0 }}
              />
              <Text size="1" className="text-slate-500 mt-1">
                Untuk notifikasi tagihan ke orang tua/wali
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
                Siswa dengan status aktif dapat menerima tagihan
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

export default SiswaFormDialog
