import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Button, Select, Switch, TextArea } from '@radix-ui/themes'
import { AlertCircle, UserPlus, Edit3, User, Hash, Calendar, MapPin, Phone, X } from 'lucide-react'

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
          maxWidth: '800px',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? (
                <Edit3 className="h-5 w-5 text-white" />
              ) : (
                <UserPlus className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Siswa' : 'Tambah Siswa'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi siswa' : 'Tambahkan siswa baru ke sistem'}
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
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
