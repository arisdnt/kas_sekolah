import { useEffect, useState } from 'react'
import { Flex, Text, Button, Select, TextArea, TextField, Switch, Dialog } from '@radix-ui/themes'
import { supabase } from '../../../lib/supabaseClient'
import { AlertCircle } from 'lucide-react'

function JenisPembayaranFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      kode: '',
      nama: '',
      deskripsi: '',
      jumlah_default: '',
      tipe_pembayaran: 'bulanan',
      wajib: true,
      id_tahun_ajaran: '',
      id_kelas: '',
      status_aktif: true,
    }
  )

  // Keep local state in sync when opening with different item
  useEffect(() => {
    if (initialData) setFormData(initialData)
  }, [initialData])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const tingkatList = Array.from(new Set(kelasList.map(k => k.tingkat))).sort()

  useEffect(() => {
    const loadRefs = async () => {
      const [{ data: tahun }, { data: kelas }] = await Promise.all([
        supabase.from('tahun_ajaran').select('id, nama').order('nama', { ascending: false }),
        supabase.from('kelas').select('id, tingkat, nama_sub_kelas').order('tingkat')
      ])
      setTahunAjaranList(tahun || [])
      setKelasList(kelas || [])
    }
    loadRefs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const validKelas = formData.apply_all_kelas ? !!formData.tingkat_for_kelas : !!formData.id_kelas
    if (!formData.kode || !formData.nama || !formData.tipe_pembayaran || !formData.id_tahun_ajaran || !validKelas) {
      setError('Kode, Nama, Tipe Pembayaran, Tahun Ajaran, dan Kelas/Tingkat wajib diisi')
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
      <Dialog.Content style={{ maxWidth: 640 }}>
        <Dialog.Title>
          {isEdit ? 'Edit Jenis Pembayaran' : 'Tambah Jenis Pembayaran'}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit ? 'Perbarui informasi jenis pembayaran' : 'Tambahkan jenis pembayaran baru ke sistem'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Kode <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                value={formData.kode}
                onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                placeholder="Contoh: SPP, SERAGAM, BUKU"
                style={{ borderRadius: 0 }}
                required
              />
              <Text size="1" className="text-slate-500 mt-1">
                Kode unik untuk identifikasi (huruf besar)
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nama <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: SPP Bulanan"
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Deskripsi
              </Text>
              <TextArea
                placeholder="Deskripsi jenis pembayaran (opsional)"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                style={{ borderRadius: 0 }}
                rows={3}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Jumlah Default (Rp)
              </Text>
              <TextField.Root
                type="number"
                value={formData.jumlah_default}
                onChange={(e) => setFormData({ ...formData, jumlah_default: e.target.value })}
                placeholder="Contoh: 500000"
                style={{ borderRadius: 0 }}
                min="0"
                step="1000"
              />
              <Text size="1" className="text-slate-500 mt-1">
                Nominal default dalam Rupiah (opsional)
              </Text>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tipe Pembayaran <span className="text-red-600">*</span>
              </Text>
              <Select.Root 
                value={formData.tipe_pembayaran} 
                onValueChange={(value) => setFormData({ ...formData, tipe_pembayaran: value })}
                required
              >
                <Select.Trigger 
                  style={{ borderRadius: 0, width: '100%' }}
                  className="cursor-pointer"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="bulanan">Bulanan (setiap bulan)</Select.Item>
                  <Select.Item value="tahunan">Tahunan (sekali per tahun)</Select.Item>
                  <Select.Item value="sekali">Sekali (one-time)</Select.Item>
                </Select.Content>
              </Select.Root>
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">Tahun Ajaran <span className="text-red-600">*</span></Text>
              <Select.Root value={formData.id_tahun_ajaran} onValueChange={(v) => setFormData({ ...formData, id_tahun_ajaran: v })}>
                <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tahun ajaran" />
                <Select.Content style={{ borderRadius: 0 }}>
                  {tahunAjaranList.map(t => (
                    <Select.Item key={t.id} value={t.id}>{t.nama}</Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label>
                <Text as="div" size="2" mb="1" weight="medium">Tingkat</Text>
                <Select.Root value={formData.tingkat_for_kelas} onValueChange={(v) => setFormData({ ...formData, tingkat_for_kelas: v, id_kelas: '', apply_all_kelas: false })}>
                  <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tingkat" />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {tingkatList.map(ting => (
                      <Select.Item key={ting} value={ting}>{ting}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </label>

              <label>
                <Text as="div" size="2" mb="1" weight="medium">Kelas <span className="text-red-600">*</span></Text>
                <Select.Root
                  value={formData.apply_all_kelas ? '__ALL__' : (formData.id_kelas || '')}
                  onValueChange={(v) => {
                    if (v === '__ALL__') setFormData({ ...formData, apply_all_kelas: true, id_kelas: '' })
                    else setFormData({ ...formData, apply_all_kelas: false, id_kelas: v })
                  }}
                >
                  <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder={formData.tingkat_for_kelas ? `Pilih kelas tingkat ${formData.tingkat_for_kelas}` : 'Pilih tingkat dahulu'} />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {formData.tingkat_for_kelas && (
                      <Select.Item value="__ALL__">Semua kelas tingkat {formData.tingkat_for_kelas}</Select.Item>
                    )}
                    {kelasList.filter(k => !formData.tingkat_for_kelas || k.tingkat === formData.tingkat_for_kelas).map(k => (
                      <Select.Item key={k.id} value={k.id}>{k.tingkat} {k.nama_sub_kelas}</Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </label>
            </div>

            <label>
              <Flex align="center" gap="2">
                <Switch
                  checked={formData.wajib}
                  onCheckedChange={(checked) => setFormData({ ...formData, wajib: checked })}
                />
                <Text size="2" weight="medium">
                  Pembayaran Wajib
                </Text>
              </Flex>
              <Text size="1" className="text-slate-500 mt-1">
                Tandai jika pembayaran ini wajib untuk semua siswa
              </Text>
            </label>

            <label>
              <Flex align="center" gap="2">
                <Switch
                  checked={formData.status_aktif}
                  onCheckedChange={(checked) => setFormData({ ...formData, status_aktif: checked })}
                />
                <Text size="2" weight="medium">
                  Status Aktif
                </Text>
              </Flex>
              <Text size="1" className="text-slate-500 mt-1">
                Nonaktifkan jika jenis pembayaran ini tidak lagi digunakan
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

export default JenisPembayaranFormDialog
