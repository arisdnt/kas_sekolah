import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
 
import { PageLayout } from '../../layout/PageLayout'
import { Text, Button, TextField, TextArea, Select, Card, IconButton, Badge, Table } from '@radix-ui/themes'
import { AlertCircle, ArrowLeft, Plus, Trash2, Save, Search, ShoppingCart } from 'lucide-react'
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
  const [selectedJenis, setSelectedJenis] = useState('')
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

      // Tentukan tahun ajaran dan tingkat untuk filter
      let filterTahunAjaran = null
      let filterTingkat = null

      if (targetType === 'siswa' && formData.id_riwayat_kelas_siswa) {
        // Ambil info dari siswa yang dipilih
        const selectedSiswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
        if (selectedSiswa) {
          filterTahunAjaran = selectedSiswa.tahun_ajaran?.id
          filterTingkat = selectedSiswa.kelas?.tingkat
        }
      } else if (targetType !== 'siswa') {
        // Gunakan filter dari form
        filterTahunAjaran = selectedTahunAjaran
        filterTingkat = selectedTingkat
      }

      // Terapkan filter jika ada
      if (filterTahunAjaran) {
        query = query.eq('id_tahun_ajaran', filterTahunAjaran)
      }

      const { data } = await query.order('kode')
      
      // Filter tingkat di client-side karena harus join dengan tabel kelas
      let filteredData = data || []
      if (filterTingkat && filteredData.length > 0) {
        filteredData = filteredData.filter(jp => jp.kelas?.tingkat === filterTingkat)
      }
      
      setJenisPembayaranList(filteredData)
    }
    fetchJenis()
  }, [targetType, formData.id_riwayat_kelas_siswa, selectedTahunAjaran, selectedTingkat, riwayatKelasSiswaList])

  const handleAddRincian = () => {
    setRincianItems([...rincianItems, {
      id_jenis_pembayaran: '',
      deskripsi: '',
      jumlah: '',
      urutan: rincianItems.length + 1,
    }])
  }

  const handleRemoveRincian = (index) => {
    setRincianItems(rincianItems.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    const updated = [...rincianItems]
    updated[index][field] = value
    
    // Auto-fill dari jenis pembayaran
    if (field === 'id_jenis_pembayaran') {
      const jenis = jenisPembayaranList.find(j => j.id === value)
      if (jenis) {
        updated[index].deskripsi = jenis.nama
        updated[index].jumlah = jenis.jumlah_default || ''
      }
    }
    
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
      // Update existing item
      const updated = [...rincianItems]
      updated[existingIndex].jumlah = (parseFloat(updated[existingIndex].jumlah || 0) + parseFloat(jenis.jumlah_default || 0)).toString()
      setRincianItems(updated)
    } else {
      // Add new item
      setRincianItems([...rincianItems, {
        id_jenis_pembayaran: jenis.id,
        deskripsi: jenis.nama,
        jumlah: jenis.jumlah_default || '',
        urutan: rincianItems.length + 1,
      }])
    }
    // Reset search and dropdown
    setSearchTerm('')
    setSelectedJenis('')
    setShowDropdown(false)
  }

  const handleSearchFocus = () => {
    setShowDropdown(true)
  }

  const handleSearchBlur = () => {
    // Delay to allow dropdown click
    setTimeout(() => setShowDropdown(false), 200)
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

    // Validasi
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

    // Validate rincian
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

      // Create tagihan untuk setiap siswa
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

        // Insert rincian
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

      // Success - navigate back
      navigate('/tagihan')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return (
      <PageLayout>
        <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="soft"
              color="gray"
              onClick={() => navigate('/tagihan')}
              style={{ borderRadius: 0 }}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div>
              <Text size="5" weight="bold" className="text-slate-900">
                Buat Tagihan Baru
              </Text>
              <Text size="2" className="text-slate-500">
                Buat tagihan untuk siswa dengan rincian item pembayaran
              </Text>
            </div>
          </div>
        </div>

        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <Text size="2" className="text-red-700">{error}</Text>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="w-full grid grid-cols-[20%_80%] gap-6">
            {/* Left Column 20% - Target Only */}
            <div className="space-y-6">
              <Card style={{ borderRadius: 0 }}>
                <div className="p-4 space-y-4">
                  <Text size="3" weight="bold">Target Siswa</Text>
                
                <div>
                  <Text size="2" mb="1" weight="medium">Target Tagihan</Text>
                  <Select.Root value={targetType} onValueChange={setTargetType}>
                    <Select.Trigger style={{ borderRadius: 0, width: '100%' }} />
                    <Select.Content style={{ borderRadius: 0 }}>
                      <Select.Item value="siswa">Siswa Individual</Select.Item>
                      <Select.Item value="kelas">Satu Kelas</Select.Item>
                      <Select.Item value="tingkat">Satu Tingkat</Select.Item>
                      <Select.Item value="semua">Semua Siswa</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>

                {targetType !== 'siswa' && (
                  <>
                    <div>
                      <Text size="2" mb="1" weight="medium">Tahun Ajaran *</Text>
                      <Select.Root value={selectedTahunAjaran} onValueChange={setSelectedTahunAjaran}>
                        <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tahun ajaran" />
                        <Select.Content style={{ borderRadius: 0 }}>
                          {tahunAjaranList?.map(ta => (
                            <Select.Item key={ta.id} value={ta.id}>{ta.nama}</Select.Item>
                          ))}
                        </Select.Content>
                      </Select.Root>
                    </div>

                    {targetType === 'tingkat' && (
                      <div>
                        <Text size="2" mb="1" weight="medium">Tingkat *</Text>
                        <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                          <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tingkat" />
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
                          <Text size="2" mb="1" weight="medium">Tingkat *</Text>
                          <Select.Root value={selectedTingkat} onValueChange={setSelectedTingkat}>
                            <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tingkat" />
                            <Select.Content style={{ borderRadius: 0 }}>
                              {tingkatList?.map(t => (
                                <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
                              ))}
                            </Select.Content>
                          </Select.Root>
                        </div>
                        {selectedTingkat && (
                          <div>
                            <Text size="2" mb="1" weight="medium">Kelas *</Text>
                            <Select.Root value={selectedKelas} onValueChange={setSelectedKelas}>
                              <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih kelas" />
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

                    {(targetType !== 'siswa' && selectedTahunAjaran) && (
                      <div className="p-3 bg-blue-50 border border-blue-200">
                        <Text size="2" weight="medium" className="text-blue-900">
                          Target: {filteredSiswa.length} siswa
                        </Text>
                        {filteredSiswa.length === 0 && (
                          <Text size="1" className="text-blue-700">
                            Tidak ada siswa yang sesuai dengan filter
                          </Text>
                        )}
                      </div>
                    )}
                  </>
                )}

                {targetType === 'siswa' && (
                  <div>
                    <Text size="2" mb="1" weight="medium">Siswa *</Text>
                    <Select.Root value={formData.id_riwayat_kelas_siswa} onValueChange={(v) => setFormData({...formData, id_riwayat_kelas_siswa: v})}>
                      <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih siswa" />
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
              </Card>

            </div>

            {/* Right Column 80% - Shopping Cart Style */}
            <div className="space-y-4">
              {/* Integrated Tagihan Info & Cart */}
              <Card style={{ borderRadius: 0, position: 'relative', zIndex: 10 }}>
                <div className="border border-gray-200 rounded overflow-hidden">
                  {/* Tagihan Information Header */}
                  <div className="bg-blue-50 border-b border-blue-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      <Text size="3" weight="bold">Informasi Tagihan & Keranjang</Text>
                    </div>

                    {/* Tagihan Form Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 mb-2">
                      <div>
                        <Text size="2" mb="1" weight="medium">Nomor Tagihan *</Text>
                        <TextField.Root
                          value={formData.nomor_tagihan}
                          onChange={(e) => setFormData({...formData, nomor_tagihan: e.target.value})}
                          placeholder="TGH-2024-001"
                          style={{ borderRadius: 0, backgroundColor: 'white' }}
                          size="2"
                        />
                      </div>
                      <div>
                        <Text size="2" mb="1" weight="medium">Judul *</Text>
                        <TextField.Root
                          value={formData.judul}
                          onChange={(e) => setFormData({...formData, judul: e.target.value})}
                          placeholder="Tagihan SPP Januari 2024"
                          style={{ borderRadius: 0, backgroundColor: 'white' }}
                          size="2"
                        />
                      </div>
                      <div>
                        <Text size="2" mb="1" weight="medium">Tanggal Tagihan *</Text>
                        <input
                          type="date"
                          value={formData.tanggal_tagihan}
                          onChange={(e) => setFormData({...formData, tanggal_tagihan: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ borderRadius: 0, backgroundColor: 'white' }}
                        />
                      </div>
                      <div>
                        <Text size="2" mb="1" weight="medium">Jatuh Tempo *</Text>
                        <input
                          type="date"
                          value={formData.tanggal_jatuh_tempo}
                          onChange={(e) => setFormData({...formData, tanggal_jatuh_tempo: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          style={{ borderRadius: 0, backgroundColor: 'white' }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <Text size="2" mb="1" weight="medium">Deskripsi</Text>
                      <TextField.Root
                        value={formData.deskripsi}
                        onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                        placeholder="Deskripsi tagihan (opsional)"
                        style={{ borderRadius: 0, backgroundColor: 'white' }}
                        size="2"
                      />
                    </div>
                  </div>

                  {/* Search Section */}
                  <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Text size="3" weight="medium">Item Pembayaran</Text>
                      <Text size="2" className="text-gray-500">({rincianItems.length} item dipilih)</Text>
                      {jenisPembayaranList.length > 0 && (
                        <Badge size="1" color="blue">
                          {jenisPembayaranList.length} item tersedia
                        </Badge>
                      )}
                    </div>
                    
                    {/* Filter indicator */}
                    {(targetType === 'siswa' && formData.id_riwayat_kelas_siswa) || (targetType !== 'siswa' && selectedTahunAjaran) ? (
                      <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                        <Text size="1" className="text-blue-700">
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
                      <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded">
                        <Text size="1" className="text-amber-700">
                          Pilih siswa atau tahun ajaran terlebih dahulu untuk menampilkan item pembayaran yang sesuai
                        </Text>
                      </div>
                    )}

                    {/* Integrated Search */}
                    <div className="relative" style={{ zIndex: 100 }}>
                      <div className="relative">
                        <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                        <TextField.Root
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onFocus={handleSearchFocus}
                          onBlur={handleSearchBlur}
                          placeholder="Cari dan pilih jenis pembayaran untuk ditambahkan..."
                          style={{ borderRadius: 0, paddingLeft: '2.5rem', backgroundColor: 'white' }}
                          className="pl-10"
                        />
                        <Plus className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>

                      {/* Dropdown Options */}
                      {showDropdown && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 border-t-0 max-h-64 overflow-y-auto z-50 shadow-xl">
                          {filteredJenisPembayaran.length === 0 ? (
                            <div className="p-3 text-center text-gray-500">
                              <Text size="2">Tidak ada jenis pembayaran yang ditemukan</Text>
                            </div>
                          ) : (
                            filteredJenisPembayaran.map(jenis => (
                              <div
                                key={jenis.id}
                                onClick={() => addJenisToCart(jenis)}
                                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <Badge size="1" color="blue">{jenis.kode}</Badge>
                                      <Text size="2" weight="medium">{jenis.nama}</Text>
                                    </div>
                                    <Text size="1" className="text-gray-500 mt-1">
                                      {jenis.jumlah_default ?
                                        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(jenis.jumlah_default)
                                        : 'Harga belum diatur'
                                      }
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
                  </div>

                  {/* Table Content */}
                  <div className="bg-white">
                    {rincianItems.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <Text size="3" weight="medium" className="text-slate-500">Keranjang Kosong</Text>
                        <Text size="2" className="text-slate-400 mt-1">Gunakan pencarian di atas untuk menambahkan item</Text>
                      </div>
                    ) : (
                      <>
                        <Table.Root>
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeaderCell>Kode</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>Deskripsi</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell>Jumlah (Rp)</Table.ColumnHeaderCell>
                              <Table.ColumnHeaderCell width="80px">Aksi</Table.ColumnHeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {rincianItems.map((item, idx) => {
                              const jenis = jenisPembayaranList.find(j => j.id === item.id_jenis_pembayaran)
                              return (
                                <Table.Row key={idx}>
                                  <Table.Cell>
                                    <Badge size="2" color="blue">{jenis?.kode || '-'}</Badge>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <TextField.Root
                                      value={item.deskripsi}
                                      onChange={(e) => handleRincianChange(idx, 'deskripsi', e.target.value)}
                                      placeholder="Deskripsi item"
                                      style={{ borderRadius: 0 }}
                                      size="1"
                                    />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <TextField.Root
                                      type="number"
                                      value={item.jumlah}
                                      onChange={(e) => handleRincianChange(idx, 'jumlah', e.target.value)}
                                      placeholder="0"
                                      style={{ borderRadius: 0 }}
                                      size="1"
                                      min="0"
                                      step="1000"
                                    />
                                  </Table.Cell>
                                  <Table.Cell>
                                    <IconButton
                                      size="1"
                                      variant="ghost"
                                      color="red"
                                      onClick={() => handleRemoveRincian(idx)}
                                      className="cursor-pointer"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </IconButton>
                                  </Table.Cell>
                                </Table.Row>
                              )
                            })}
                          </Table.Body>
                        </Table.Root>

                        {/* Total Footer */}
                        <div className="border-t border-gray-200 bg-green-50 p-4">
                          <div className="flex items-center justify-between">
                            <Text size="3" weight="bold" className="text-green-900">Total Tagihan</Text>
                            <Text size="4" weight="bold" className="text-green-700">
                              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalTagihan)}
                            </Text>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Actions - Full Width */}
          <div className="w-full mt-6">
            <div className="flex gap-3 justify-end pb-8">
              <Button
                variant="soft"
                color="gray"
                onClick={() => navigate('/tagihan')}
                style={{ borderRadius: 0 }}
                disabled={submitting}
                className="cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || rincianItems.length === 0}
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Menyimpan...' : 'Simpan Tagihan'}
              </Button>
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
