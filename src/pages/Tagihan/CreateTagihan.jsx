import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageLayout } from '../../layout/PageLayout'
import { Text, TextField, Select, Badge } from '@radix-ui/themes'
import { AlertCircle, ArrowLeft, Plus, X, Save, Search, ShoppingCart, Receipt, User, Calendar, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useTagihan } from './hooks/useTagihan'

function CreateTagihanContent() {
  const navigate = useNavigate()
  const { riwayatKelasSiswaList, tingkatList, kelasList, tahunAjaranList } = useTagihan()

  const [targetType, setTargetType] = useState('siswa')
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedKelas, setSelectedKelas] = useState('')
  const [jenisPembayaranList, setJenisPembayaranList] = useState([])

  const [formData, setFormData] = useState({
    id_riwayat_kelas_siswa: '',
    nomor_tagihan: '',
    judul: '',
    deskripsi: '',
    tanggal_tagihan: new Date().toISOString().split('T')[0],
    tanggal_jatuh_tempo: '',
  })

  const [rincianItems, setRincianItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch jenis pembayaran dengan filter tahun ajaran dan tingkat kelas
  useEffect(() => {
    const fetchJenis = async () => {
      let query = supabase
        .from('jenis_pembayaran')
        .select(`
          id,
          kode,
          nama,
          jumlah_default,
          id_tahun_ajaran,
          id_kelas,
          kelas:id_kelas(tingkat),
          tahun_ajaran:id_tahun_ajaran(nama)
        `)
        .eq('status_aktif', true)

      let filterTahunAjaran = null
      let filterTingkat = null

      if (targetType === 'siswa' && formData.id_riwayat_kelas_siswa) {
        const selectedSiswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
        if (selectedSiswa) {
          filterTahunAjaran = selectedSiswa.tahun_ajaran?.id
          filterTingkat = selectedSiswa.kelas?.tingkat
        }
      } else if (targetType !== 'siswa') {
        filterTahunAjaran = selectedTahunAjaran
        filterTingkat = selectedTingkat
      }

      if (filterTahunAjaran) {
        query = query.eq('id_tahun_ajaran', filterTahunAjaran)
      }

      const { data } = await query.order('kode')

      let filteredData = data || []
      if (filterTingkat && filteredData.length > 0) {
        filteredData = filteredData.filter(jp => jp.kelas?.tingkat === filterTingkat)
      }

      setJenisPembayaranList(filteredData)
    }
    fetchJenis()
  }, [targetType, formData.id_riwayat_kelas_siswa, selectedTahunAjaran, selectedTingkat, riwayatKelasSiswaList])

  const handleRemoveRincian = (index) => {
    setRincianItems(rincianItems.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    const updated = [...rincianItems]
    updated[index][field] = value
    setRincianItems(updated)
  }

  const totalTagihan = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah || 0), 0)

  const filteredJenisPembayaran = jenisPembayaranList.filter(jenis =>
    jenis.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jenis.kode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addJenisToCart = (jenis) => {
    const existingIndex = rincianItems.findIndex(item => item.id_jenis_pembayaran === jenis.id)
    if (existingIndex >= 0) {
      const updated = [...rincianItems]
      updated[existingIndex].jumlah = (parseFloat(updated[existingIndex].jumlah || 0) + parseFloat(jenis.jumlah_default || 0)).toString()
      setRincianItems(updated)
    } else {
      setRincianItems([...rincianItems, {
        id_jenis_pembayaran: jenis.id,
        deskripsi: jenis.nama,
        jumlah: jenis.jumlah_default || '',
        urutan: rincianItems.length + 1,
      }])
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const filteredSiswa = riwayatKelasSiswaList?.filter(s => {
    if (selectedTahunAjaran && s.tahun_ajaran?.id !== selectedTahunAjaran) return false
    if (targetType === 'tingkat' && selectedTingkat && s.kelas?.tingkat !== selectedTingkat) return false
    if (targetType === 'kelas' && selectedKelas && s.kelas?.id !== selectedKelas) return false
    return true
  }) || []

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    if (!formData.nomor_tagihan || !formData.judul || !formData.tanggal_tagihan || !formData.tanggal_jatuh_tempo) {
      setError('Nomor tagihan, judul, tanggal tagihan, dan jatuh tempo wajib diisi')
      setSubmitting(false)
      return
    }

    if (rincianItems.length === 0) {
      setError('Minimal harus ada 1 rincian item')
      setSubmitting(false)
      return
    }

    for (let i = 0; i < rincianItems.length; i++) {
      if (!rincianItems[i].id_jenis_pembayaran || !rincianItems[i].jumlah) {
        setError(`Rincian item ${i + 1}: Jenis pembayaran dan jumlah wajib diisi`)
        setSubmitting(false)
        return
      }
    }

    try {
      let targetList = []

      if (targetType === 'siswa') {
        if (!formData.id_riwayat_kelas_siswa) {
          setError('Siswa wajib dipilih')
          setSubmitting(false)
          return
        }
        targetList = [formData.id_riwayat_kelas_siswa]
      } else {
        if (!selectedTahunAjaran) {
          setError('Tahun ajaran wajib dipilih untuk tagihan massal')
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

      for (let i = 0; i < targetList.length; i++) {
        const nomorTagihan = targetList.length > 1
          ? `${formData.nomor_tagihan}-${String(i + 1).padStart(3, '0')}`
          : formData.nomor_tagihan

        const { data: tagihanData, error: tagihanError } = await supabase
          .from('tagihan')
          .insert({
            id_riwayat_kelas_siswa: targetList[i],
            nomor_tagihan: nomorTagihan,
            judul: formData.judul,
            deskripsi: formData.deskripsi || null,
            tanggal_tagihan: formData.tanggal_tagihan,
            tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
          })
          .select()
          .single()

        if (tagihanError) throw tagihanError

        const rincianData = rincianItems.map(item => ({
          id_tagihan: tagihanData.id,
          id_jenis_pembayaran: item.id_jenis_pembayaran,
          deskripsi: item.deskripsi,
          jumlah: item.jumlah,
          urutan: item.urutan,
        }))

        const { error: rincianError } = await supabase
          .from('rincian_tagihan')
          .insert(rincianData)

        if (rincianError) throw rincianError
      }

      navigate('/tagihan')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const formatCurrency = (value) => {
    if (!value) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header - Excel style */}
        <div className="shrink-0 border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/tagihan')}
              className="flex h-8 w-8 items-center justify-center border border-slate-400 bg-white hover:bg-slate-50 transition-colors"
              type="button"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center border border-green-700 bg-green-600 shadow-sm">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <div>
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Buat Tagihan Baru
                </Text>
                <Text size="1" className="text-slate-600">
                  Buat tagihan pembayaran untuk siswa
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="shrink-0 mx-5 mt-4 flex items-start gap-3 bg-red-50 border-2 border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">
                Terjadi kesalahan
              </Text>
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          <div className="w-full space-y-4">
            {/* 2 Kolom: Target Siswa | Informasi Tagihan */}
            <div className="grid grid-cols-2 gap-4">
              {/* Target Siswa Section */}
              <div className="border-2 border-slate-300 bg-white shadow-lg">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-600" />
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Target Siswa
                    </Text>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Text size="2" weight="medium" className="text-slate-700">
                          Target Tagihan <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <Select.Root value={targetType} onValueChange={setTargetType}>
                        <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" />
                        <Select.Content style={{ borderRadius: 0 }}>
                          <Select.Item value="siswa">Siswa Individual</Select.Item>
                          <Select.Item value="kelas">Satu Kelas</Select.Item>
                          <Select.Item value="tingkat">Satu Tingkat</Select.Item>
                          <Select.Item value="semua">Semua Siswa</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </div>

                    {targetType !== 'siswa' && (
                      <div>
                        <label className="flex items-center gap-1.5 mb-2">
                          <Text size="2" weight="medium" className="text-slate-700">
                            Tahun Ajaran <span className="text-red-500">*</span>
                          </Text>
                        </label>
                        <Select.Root value={selectedTahunAjaran} onValueChange={setSelectedTahunAjaran}>
                          <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tahun ajaran" />
                          <Select.Content style={{ borderRadius: 0 }}>
                            {tahunAjaranList?.map(ta => (
                              <Select.Item key={ta.id} value={ta.id}>{ta.nama}</Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </div>
                    )}

                    {targetType === 'tingkat' && (
                      <div>
                        <label className="flex items-center gap-1.5 mb-2">
                          <Text size="2" weight="medium" className="text-slate-700">
                            Tingkat <span className="text-red-500">*</span>
                          </Text>
                        </label>
                        <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                          <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tingkat" />
                          <Select.Content style={{ borderRadius: 0 }}>
                            {tingkatList?.map(t => (
                              <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </div>
                    )}

                    {targetType === 'kelas' && (
                      <>
                        <div>
                          <label className="flex items-center gap-1.5 mb-2">
                            <Text size="2" weight="medium" className="text-slate-700">
                              Tingkat <span className="text-red-500">*</span>
                            </Text>
                          </label>
                          <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                            <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih tingkat" />
                            <Select.Content style={{ borderRadius: 0 }}>
                              {tingkatList?.map(t => (
                                <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </div>
                        {selectedTingkat && (
                          <div>
                            <label className="flex items-center gap-1.5 mb-2">
                              <Text size="2" weight="medium" className="text-slate-700">
                                Kelas <span className="text-red-500">*</span>
                              </Text>
                            </label>
                            <Select.Root value={selectedKelas} onValueChange={setSelectedKelas}>
                              <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih kelas" />
                              <Select.Content style={{ borderRadius: 0 }}>
                                {kelasList?.filter(k => k.tingkat === selectedTingkat).map(k => (
                                  <Select.Item key={k.id} value={k.id}>{k.tingkat} {k.nama_sub_kelas}</Select.Item>
                                ))}
                              </Select.Content>
                            </Select.Root>
                          </div>
                        )}
                      </>
                    )}

                    {targetType === 'siswa' && (
                      <div>
                        <label className="flex items-center gap-1.5 mb-2">
                          <Text size="2" weight="medium" className="text-slate-700">
                            Siswa <span className="text-red-500">*</span>
                          </Text>
                        </label>
                        <Select.Root value={formData.id_riwayat_kelas_siswa} onValueChange={(v) => setFormData({...formData, id_riwayat_kelas_siswa: v})}>
                          <Select.Trigger style={{ borderRadius: 0 }} className="w-full border-slate-300" placeholder="Pilih siswa" />
                          <Select.Content style={{ borderRadius: 0 }}>
                            {riwayatKelasSiswaList?.map(s => (
                              <Select.Item key={s.id} value={s.id}>
                                {s.siswa?.nama_lengkap} - {s.kelas?.tingkat} {s.kelas?.nama_sub_kelas} ({s.tahun_ajaran?.nama})
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                      </div>
                    )}
                  </div>

                  {(targetType !== 'siswa' && selectedTahunAjaran) && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-2 border-blue-300 mt-4">
                      <Text size="2" weight="medium" className="text-blue-900">
                        Target: {filteredSiswa.length} siswa
                      </Text>
                      {filteredSiswa.length === 0 && (
                        <Text size="1" className="text-blue-700">
                          • Tidak ada siswa yang sesuai filter
                        </Text>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Informasi Tagihan Section */}
              <div className="border-2 border-slate-300 bg-white shadow-lg">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-600" />
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Informasi Tagihan
                    </Text>
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Text size="2" weight="medium" className="text-slate-700">
                          Nomor Tagihan <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <TextField.Root
                        value={formData.nomor_tagihan}
                        onChange={(e) => setFormData({...formData, nomor_tagihan: e.target.value})}
                        placeholder="TGH-2024-001"
                        style={{ borderRadius: 0 }}
                        className="border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Text size="2" weight="medium" className="text-slate-700">
                          Judul <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <TextField.Root
                        value={formData.judul}
                        onChange={(e) => setFormData({...formData, judul: e.target.value})}
                        placeholder="Tagihan SPP Januari 2024"
                        style={{ borderRadius: 0 }}
                        className="border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Text size="2" weight="medium" className="text-slate-700">
                          Tanggal Tagihan <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <input
                        type="date"
                        value={formData.tanggal_tagihan}
                        onChange={(e) => setFormData({...formData, tanggal_tagihan: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderRadius: 0 }}
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 mb-2">
                        <Text size="2" weight="medium" className="text-slate-700">
                          Jatuh Tempo <span className="text-red-500">*</span>
                        </Text>
                      </label>
                      <input
                        type="date"
                        value={formData.tanggal_jatuh_tempo}
                        onChange={(e) => setFormData({...formData, tanggal_jatuh_tempo: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderRadius: 0 }}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-1.5 mb-2">
                        <Text size="2" weight="medium" className="text-slate-700">
                          Deskripsi
                        </Text>
                      </label>
                      <TextField.Root
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                        placeholder="Deskripsi tagihan (opsional)"
                        style={{ borderRadius: 0 }}
                        className="border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Rincian Tagihan Section */}
            <div className="border-2 border-slate-300 bg-white shadow-lg">
              <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-slate-600" />
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Rincian Tagihan
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge color="blue">{rincianItems.length} item</Badge>
                    {jenisPembayaranList.length > 0 && (
                      <Badge color="green">{jenisPembayaranList.length} tersedia</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Filter Info */}
                {(targetType === 'siswa' && formData.id_riwayat_kelas_siswa) || (targetType !== 'siswa' && selectedTahunAjaran) ? (
                  <div className="px-3 py-2 bg-blue-50 border-2 border-blue-200">
                    <Text size="2" className="text-blue-700">
                      <strong>Filter aktif:</strong> Item difilter berdasarkan{' '}
                      {targetType === 'siswa' ?
                        (() => {
                          const siswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
                          return `${siswa?.tahun_ajaran?.nama || ''}${siswa?.kelas?.tingkat ? ` - Tingkat ${siswa.kelas.tingkat}` : ''}`
                        })() :
                        `${tahunAjaranList?.find(ta => ta.id === selectedTahunAjaran)?.nama || ''}${selectedTingkat ? ` - Tingkat ${selectedTingkat}` : ''}`
                      }
                    </Text>
                  </div>
                ) : (
                  <div className="px-3 py-2 bg-amber-50 border-2 border-amber-200">
                    <Text size="2" className="text-amber-700">
                      Pilih siswa atau tahun ajaran terlebih dahulu untuk menampilkan item pembayaran yang sesuai
                    </Text>
                  </div>
                )}

                {/* Search Bar */}
                <div className="relative">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" />
                    <TextField.Root
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder="Cari dan pilih jenis pembayaran untuk ditambahkan..."
                      style={{ borderRadius: 0, paddingLeft: '2.5rem' }}
                      className="border-slate-300"
                    />
                    <Plus className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  </div>

                  {/* Dropdown */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border-2 border-slate-300 border-t-0 max-h-64 overflow-y-auto z-50 shadow-xl">
                      {filteredJenisPembayaran.length === 0 ? (
                        <div className="p-4 text-center">
                          <Text size="2" className="text-slate-500">Tidak ada jenis pembayaran yang ditemukan</Text>
                        </div>
                      ) : (
                        filteredJenisPembayaran.map(jenis => (
                          <div
                            key={jenis.id}
                            onClick={() => addJenisToCart(jenis)}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-200 last:border-b-0"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Badge size="1" color="blue">{jenis.kode}</Badge>
                                  <Text size="2" weight="medium">{jenis.nama}</Text>
                                </div>
                                <Text size="1" className="text-slate-500 mt-1">
                                  {formatCurrency(jenis.jumlah_default)}
                                </Text>
                              </div>
                              <Plus className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Cart Items */}
                {rincianItems.length === 0 ? (
                  <div className="text-center py-12 border-2 border-slate-200 bg-slate-50">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                    <Text size="3" weight="medium" className="text-slate-600">Keranjang Kosong</Text>
                    <Text size="2" className="text-slate-500 mt-1">Gunakan pencarian di atas untuk menambahkan item</Text>
                  </div>
                ) : (
                  <div className="border-2 border-slate-300">
                    <table className="w-full border-collapse">
                      <thead className="bg-gradient-to-b from-slate-100 to-slate-50">
                        <tr className="border-b-2 border-slate-300">
                          <th className="px-4 py-3 text-left border-r border-slate-200">
                            <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">No</Text>
                          </th>
                          <th className="px-4 py-3 text-left border-r border-slate-200">
                            <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Kode</Text>
                          </th>
                          <th className="px-4 py-3 text-left border-r border-slate-200">
                            <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Deskripsi</Text>
                          </th>
                          <th className="px-4 py-3 text-left border-r border-slate-200">
                            <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Jumlah</Text>
                          </th>
                          <th className="px-4 py-3 text-center">
                            <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Aksi</Text>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rincianItems.map((item, idx) => {
                          const jenis = jenisPembayaranList.find(j => j.id === item.id_jenis_pembayaran)
                          return (
                            <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                              <td className="px-4 py-3 border-r border-slate-200">
                                <Text size="2" className="text-slate-700">{idx + 1}</Text>
                              </td>
                              <td className="px-4 py-3 border-r border-slate-200">
                                <Badge color="blue">{jenis?.kode || '-'}</Badge>
                              </td>
                              <td className="px-4 py-3 border-r border-slate-200">
                                <TextField.Root
                                  value={item.deskripsi}
                                  onChange={(e) => handleRincianChange(idx, 'deskripsi', e.target.value)}
                                  placeholder="Deskripsi item"
                                  style={{ borderRadius: 0 }}
                                  size="1"
                                  className="border-slate-300"
                                />
                              </td>
                              <td className="px-4 py-3 border-r border-slate-200">
                                <TextField.Root
                                  type="number"
                                  value={item.jumlah}
                                  onChange={(e) => handleRincianChange(idx, 'jumlah', e.target.value)}
                                  placeholder="0"
                                  style={{ borderRadius: 0 }}
                                  size="1"
                                  min="0"
                                  step="1000"
                                  className="border-slate-300"
                                />
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleRemoveRincian(idx)}
                                  className="h-7 w-7 inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-red-50 hover:border-red-400 transition-colors"
                                  type="button"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-slate-600" />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>

                    {/* Total */}
                    <div className="border-t-2 border-slate-300 bg-emerald-50 px-4 py-3">
                      <div className="flex items-center justify-between">
                        <Text size="3" weight="bold" className="text-emerald-900 uppercase tracking-wider">Total Tagihan</Text>
                        <Text size="4" weight="bold" className="text-emerald-700 font-mono">
                          {formatCurrency(totalTagihan)}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-4 flex justify-end gap-3 -mx-5 -mb-5">
              <button
                onClick={() => navigate('/tagihan')}
                disabled={submitting}
                className="px-6 py-2 border border-slate-400 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                type="button"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || rincianItems.length === 0}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white border border-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                type="button"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Menyimpan...' : 'Simpan Tagihan'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function CreateTagihan() {
  return <CreateTagihanContent />
}
