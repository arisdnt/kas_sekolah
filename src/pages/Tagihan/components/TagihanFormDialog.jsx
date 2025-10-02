import { useState, useMemo } from 'react'
import { Dialog, Flex, Text, Button, Select, TextArea, TextField } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

function TagihanFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  riwayatKelasSiswaList,
  tingkatList,
  kelasList,
  tahunAjaranList
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_riwayat_kelas_siswa: '',
      nomor_tagihan: '',
      judul: '',
      deskripsi: '',
      tanggal_tagihan: new Date().toISOString().split('T')[0],
      tanggal_jatuh_tempo: '',
    }
  )
  
  // State untuk nested selection
  const [targetType, setTargetType] = useState('siswa') // siswa, kelas, tingkat, semua
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedKelas, setSelectedKelas] = useState('')
  
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Debug log
  console.log('Form Data:', {
    tingkatList,
    kelasList,
    tahunAjaranList,
    riwayatKelasSiswaList: riwayatKelasSiswaList?.length,
    selectedTingkat,
    selectedKelas
  })

  // Filter kelas berdasarkan tingkat
  const filteredKelas = useMemo(() => {
    if (!selectedTingkat) return kelasList
    return kelasList.filter(k => k.tingkat === selectedTingkat)
  }, [kelasList, selectedTingkat])

  // Filter siswa berdasarkan kriteria
  const filteredSiswa = useMemo(() => {
    let filtered = riwayatKelasSiswaList

    if (selectedTahunAjaran) {
      filtered = filtered.filter(s => s.tahun_ajaran?.id === selectedTahunAjaran)
    }

    if (targetType === 'tingkat' && selectedTingkat) {
      filtered = filtered.filter(s => s.kelas?.tingkat === selectedTingkat)
    }

    if (targetType === 'kelas' && selectedKelas) {
      filtered = filtered.filter(s => s.kelas?.id === selectedKelas)
    }

    return filtered
  }, [riwayatKelasSiswaList, targetType, selectedTahunAjaran, selectedTingkat, selectedKelas])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.nomor_tagihan || !formData.judul || !formData.tanggal_tagihan || !formData.tanggal_jatuh_tempo) {
      setError('Nomor tagihan, judul, tanggal tagihan, dan jatuh tempo wajib diisi')
      setSubmitting(false)
      return
    }

    if (formData.tanggal_jatuh_tempo <= formData.tanggal_tagihan) {
      setError('Tanggal jatuh tempo harus setelah tanggal tagihan')
      setSubmitting(false)
      return
    }

    if (isEdit) {
      // Mode edit - single tagihan
      if (!formData.id_riwayat_kelas_siswa) {
        setError('Siswa wajib dipilih')
        setSubmitting(false)
        return
      }
      
      try {
        await onSubmit(formData, true)
        onOpenChange(false)
      } catch (err) {
        setError(err.message)
      } finally {
        setSubmitting(false)
      }
    } else {
      // Mode tambah - bisa massal
      let targetList = []

      if (targetType === 'siswa') {
        if (!formData.id_riwayat_kelas_siswa) {
          setError('Siswa wajib dipilih')
          setSubmitting(false)
          return
        }
        targetList = [formData.id_riwayat_kelas_siswa]
      } else if (targetType === 'semua') {
        if (!selectedTahunAjaran) {
          setError('Tahun ajaran wajib dipilih untuk tagihan massal')
          setSubmitting(false)
          return
        }
        targetList = filteredSiswa.map(s => s.id)
      } else if (targetType === 'tingkat') {
        if (!selectedTingkat || !selectedTahunAjaran) {
          setError('Tingkat dan tahun ajaran wajib dipilih')
          setSubmitting(false)
          return
        }
        targetList = filteredSiswa.map(s => s.id)
      } else if (targetType === 'kelas') {
        if (!selectedKelas || !selectedTahunAjaran) {
          setError('Kelas dan tahun ajaran wajib dipilih')
          setSubmitting(false)
          return
        }
        targetList = filteredSiswa.map(s => s.id)
      }

      if (targetList.length === 0) {
        setError('Tidak ada siswa yang dipilih')
        setSubmitting(false)
        return
      }

      try {
        // Buat tagihan untuk setiap siswa
        for (let i = 0; i < targetList.length; i++) {
          const nomorTagihan = targetList.length > 1 
            ? `${formData.nomor_tagihan}-${String(i + 1).padStart(3, '0')}`
            : formData.nomor_tagihan

          await onSubmit({
            ...formData,
            id_riwayat_kelas_siswa: targetList[i],
            nomor_tagihan: nomorTagihan
          }, false)
        }
        
        onOpenChange(false)
      } catch (err) {
        setError(err.message)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 650, borderRadius: 0 }}>
        <Dialog.Title>{isEdit ? 'Edit Tagihan' : 'Tambah Tagihan'}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit ? 'Perbarui informasi tagihan' : 'Buat tagihan baru untuk siswa (individu atau massal)'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            {!isEdit && (
              <>
                <label>
                  <Text as="div" size="2" mb="1" weight="medium">
                    Target Tagihan <span className="text-red-600">*</span>
                  </Text>
                  <Select.Root value={targetType} onValueChange={setTargetType}>
                    <Select.Trigger 
                      style={{ borderRadius: 0, width: '100%' }}
                      className="cursor-pointer"
                    />
                    <Select.Content style={{ borderRadius: 0 }}>
                      <Select.Item value="siswa">Siswa Individual</Select.Item>
                      <Select.Item value="kelas">Satu Kelas</Select.Item>
                      <Select.Item value="tingkat">Satu Tingkat</Select.Item>
                      <Select.Item value="semua">Semua Siswa (Tahun Ajaran)</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    {targetType === 'siswa' && 'Tagihan untuk 1 siswa'}
                    {targetType === 'kelas' && 'Tagihan untuk semua siswa dalam 1 kelas'}
                    {targetType === 'tingkat' && 'Tagihan untuk semua siswa dalam 1 tingkat'}
                    {targetType === 'semua' && 'Tagihan untuk SEMUA siswa dalam tahun ajaran'}
                  </Text>
                </label>

                {targetType !== 'siswa' && (
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Tahun Ajaran <span className="text-red-600">*</span>
                    </Text>
                    <Select.Root value={selectedTahunAjaran} onValueChange={setSelectedTahunAjaran}>
                      <Select.Trigger 
                        style={{ borderRadius: 0, width: '100%' }}
                        placeholder="Pilih tahun ajaran"
                        className="cursor-pointer"
                      />
                      <Select.Content style={{ borderRadius: 0 }}>
                        {tahunAjaranList && tahunAjaranList.length > 0 ? (
                          tahunAjaranList.map(ta => (
                            <Select.Item key={ta.id} value={ta.id}>{ta.nama}</Select.Item>
                          ))
                        ) : (
                          <Select.Item value="" disabled>Tidak ada tahun ajaran</Select.Item>
                        )}
                      </Select.Content>
                    </Select.Root>
                  </label>
                )}

                {targetType === 'tingkat' && (
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Tingkat <span className="text-red-600">*</span>
                    </Text>
                    <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                      <Select.Trigger 
                        style={{ borderRadius: 0, width: '100%' }}
                        placeholder="Pilih tingkat"
                        className="cursor-pointer"
                      />
                      <Select.Content style={{ borderRadius: 0 }}>
                        {tingkatList && tingkatList.length > 0 ? (
                          tingkatList.map(tingkat => (
                            <Select.Item key={tingkat} value={tingkat}>
                              Tingkat {tingkat}
                            </Select.Item>
                          ))
                        ) : (
                          <Select.Item value="" disabled>Tidak ada tingkat</Select.Item>
                        )}
                      </Select.Content>
                    </Select.Root>
                  </label>
                )}

                {targetType === 'kelas' && (
                  <>
                    <label>
                      <Text as="div" size="2" mb="1" weight="medium">
                        Tingkat <span className="text-red-600">*</span>
                      </Text>
                      <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                        <Select.Trigger 
                          style={{ borderRadius: 0, width: '100%' }}
                          placeholder="Pilih tingkat dulu"
                          className="cursor-pointer"
                        />
                        <Select.Content style={{ borderRadius: 0 }}>
                          {tingkatList.map(tingkat => (
                            <Select.Item key={tingkat} value={tingkat}>
                              Tingkat {tingkat}
                            </Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </label>

                    {selectedTingkat && (
                      <label>
                        <Text as="div" size="2" mb="1" weight="medium">
                          Kelas <span className="text-red-600">*</span>
                        </Text>
                        <Select.Root value={selectedKelas} onValueChange={setSelectedKelas}>
                          <Select.Trigger 
                            style={{ borderRadius: 0, width: '100%' }}
                            placeholder="Pilih kelas"
                            className="cursor-pointer"
                          />
                          <Select.Content style={{ borderRadius: 0 }}>
                            {filteredKelas.map(kelas => (
                              <Select.Item key={kelas.id} value={kelas.id}>
                                {kelas.tingkat} {kelas.nama_sub_kelas}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </label>
                    )}
                  </>
                )}

                {targetType === 'siswa' && (
                  <label>
                    <Text as="div" size="2" mb="1" weight="medium">
                      Siswa <span className="text-red-600">*</span>
                    </Text>
                    <Select.Root 
                      value={formData.id_riwayat_kelas_siswa} 
                      onValueChange={(value) => setFormData({ ...formData, id_riwayat_kelas_siswa: value })}
                    >
                      <Select.Trigger 
                        style={{ borderRadius: 0, width: '100%' }}
                        placeholder="Pilih siswa"
                        className="cursor-pointer"
                      />
                      <Select.Content style={{ borderRadius: 0 }}>
                        {riwayatKelasSiswaList && riwayatKelasSiswaList.length > 0 ? (
                          riwayatKelasSiswaList.map((item) => (
                            <Select.Item key={item.id} value={item.id}>
                              {item.siswa?.nama_lengkap} - {item.kelas?.tingkat} {item.kelas?.nama_sub_kelas} ({item.tahun_ajaran?.nama})
                            </Select.Item>
                          ))
                        ) : (
                          <Select.Item value="" disabled>Tidak ada siswa</Select.Item>
                        )}
                      </Select.Content>
                    </Select.Root>
                  </label>
                )}

                {targetType !== 'siswa' && filteredSiswa.length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200">
                    <Text size="2" weight="medium" className="text-blue-900">
                      Target: {filteredSiswa.length} siswa
                    </Text>
                    <Text size="1" className="text-blue-700 mt-1">
                      Nomor tagihan akan diberi suffix otomatis
                    </Text>
                  </div>
                )}
              </>
            )}

            {isEdit && (
              <label>
                <Text as="div" size="2" mb="1" weight="medium">
                  Siswa <span className="text-red-600">*</span>
                </Text>
                <Select.Root 
                  value={formData.id_riwayat_kelas_siswa} 
                  onValueChange={(value) => setFormData({ ...formData, id_riwayat_kelas_siswa: value })}
                >
                  <Select.Trigger 
                    style={{ borderRadius: 0, width: '100%' }}
                    placeholder="Pilih siswa"
                    className="cursor-pointer"
                  />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {riwayatKelasSiswaList.map((item) => (
                      <Select.Item key={item.id} value={item.id}>
                        {item.siswa?.nama_lengkap} - {item.kelas?.tingkat} {item.kelas?.nama_sub_kelas}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </label>
            )}

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Nomor Tagihan <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                value={formData.nomor_tagihan}
                onChange={(e) => setFormData({ ...formData, nomor_tagihan: e.target.value })}
                placeholder="Contoh: TGH-2024-001"
                style={{ borderRadius: 0 }}
                required
              />
              {!isEdit && targetType !== 'siswa' && (
                <Text size="1" className="text-slate-500 mt-1">
                  Akan ditambah suffix: -001, -002, -003, dst
                </Text>
              )}
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Judul <span className="text-red-600">*</span>
              </Text>
              <TextField.Root
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Contoh: Tagihan SPP Januari 2024"
                style={{ borderRadius: 0 }}
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Deskripsi
              </Text>
              <TextArea
                placeholder="Deskripsi tagihan (opsional)"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                style={{ borderRadius: 0 }}
                rows={3}
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tanggal Tagihan <span className="text-red-600">*</span>
              </Text>
              <input
                type="date"
                value={formData.tanggal_tagihan}
                onChange={(e) => setFormData({ ...formData, tanggal_tagihan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>

            <label>
              <Text as="div" size="2" mb="1" weight="medium">
                Tanggal Jatuh Tempo <span className="text-red-600">*</span>
              </Text>
              <input
                type="date"
                value={formData.tanggal_jatuh_tempo}
                onChange={(e) => setFormData({ ...formData, tanggal_jatuh_tempo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
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

export default TagihanFormDialog
