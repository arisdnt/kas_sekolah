import { useState, useEffect } from 'react'
import { Text, Button, IconButton, Badge } from '@radix-ui/themes'
import { Receipt, Clock, Calendar, User, Plus, Pencil, Trash } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'
import RincianTagihanFormDialog from './RincianTagihanFormDialog'
import { DeleteConfirmDialog } from './DeleteConfirmDialog'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function DetailPanelWithRincian({ selectedItem, onRefresh }) {
  const [rincianList, setRincianList] = useState([])
  const [jenisPembayaranList, setJenisPembayaranList] = useState([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentRincian, setCurrentRincian] = useState(null)

  useEffect(() => {
    if (selectedItem?.id) {
      fetchRincian()
      fetchJenisPembayaran()
    }
  }, [selectedItem?.id])

  const fetchRincian = async () => {
    if (!selectedItem?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('rincian_tagihan')
      .select(`
        *,
        jenis_pembayaran:id_jenis_pembayaran(kode, nama)
      `)
      .eq('id_tagihan', selectedItem.id)
      .order('urutan')
    
    if (!error) setRincianList(data || [])
    setLoading(false)
  }

  const fetchJenisPembayaran = async () => {
    const { data } = await supabase
      .from('jenis_pembayaran')
      .select('id, kode, nama, jumlah_default')
      .eq('status_aktif', true)
      .order('kode')
    
    if (data) setJenisPembayaranList(data)
  }

  const handleAddRincian = () => {
    setEditMode(false)
    setCurrentRincian({
      id_tagihan: selectedItem.id,
      id_jenis_pembayaran: '',
      deskripsi: '',
      jumlah: '',
      urutan: rincianList.length + 1,
    })
    setDialogOpen(true)
  }

  const handleEditRincian = (rincian) => {
    setEditMode(true)
    setCurrentRincian(rincian)
    setDialogOpen(true)
  }

  const handleDeleteRincian = (rincian) => {
    setCurrentRincian(rincian)
    setDeleteDialogOpen(true)
  }

  const handleSaveRincian = async (formData, isEdit) => {
    if (isEdit) {
      await supabase
        .from('rincian_tagihan')
        .update({
          id_jenis_pembayaran: formData.id_jenis_pembayaran,
          deskripsi: formData.deskripsi,
          jumlah: formData.jumlah,
          urutan: formData.urutan,
        })
        .eq('id', formData.id)
    } else {
      await supabase
        .from('rincian_tagihan')
        .insert(formData)
    }
    await fetchRincian()
    if (onRefresh) onRefresh()
  }

  const handleConfirmDelete = async () => {
    if (currentRincian) {
      await supabase
        .from('rincian_tagihan')
        .delete()
        .eq('id', currentRincian.id)
      
      await fetchRincian()
      if (onRefresh) onRefresh()
    }
  }

  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur items-center justify-center p-6">
        <div className="text-center text-slate-400">
          <Receipt className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <Text size="3" className="text-slate-500 mb-2">
            Tidak ada data dipilih
          </Text>
          <Text size="2" className="text-slate-400">
            Pilih baris pada tabel untuk melihat detail
          </Text>
        </div>
      </div>
    )
  }

  const totalRincian = rincianList.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0)

  return (
    <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex-1 overflow-auto">
        {/* Header Tagihan */}
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            Nomor Tagihan
          </Text>
          <Text size="4" weight="bold" className="text-slate-900 font-mono">
            {selectedItem.nomor_tagihan}
          </Text>
          
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 mt-3 block">
            Judul
          </Text>
          <Text size="2" weight="medium" className="text-slate-900">
            {selectedItem.judul}
          </Text>

          <div className="mt-3 pt-3 border-t border-slate-200">
            <Text size="5" weight="bold" className="text-emerald-700">
              {formatCurrency(totalRincian)}
            </Text>
            <Text size="1" className="text-slate-500">
              Total {rincianList.length} item
            </Text>
          </div>
        </div>

        {/* Rincian Items */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Text size="2" weight="bold" className="text-slate-700">
              Rincian Item
            </Text>
            <Button
              size="1"
              onClick={handleAddRincian}
              className="cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              <Plus className="h-3 w-3" />
              Tambah
            </Button>
          </div>

          {loading ? (
            <Text size="2" className="text-slate-500">Memuat...</Text>
          ) : rincianList.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Text size="2">Belum ada rincian</Text>
            </div>
          ) : (
            <div className="space-y-2">
              {rincianList.map((rincian, idx) => (
                <div
                  key={rincian.id}
                  className="p-3 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="soft" size="1">
                          {idx + 1}
                        </Badge>
                        <Text size="1" weight="bold" className="text-slate-900 uppercase font-mono">
                          {rincian.jenis_pembayaran?.kode}
                        </Text>
                      </div>
                      <Text size="2" className="text-slate-700 truncate">
                        {rincian.deskripsi}
                      </Text>
                      <Text size="3" weight="bold" className="text-emerald-700 mt-1">
                        {formatCurrency(rincian.jumlah)}
                      </Text>
                    </div>
                    <div className="flex gap-1">
                      <IconButton
                        size="1"
                        variant="ghost"
                        onClick={() => handleEditRincian(rincian)}
                        className="cursor-pointer"
                      >
                        <Pencil className="h-3 w-3" />
                      </IconButton>
                      <IconButton
                        size="1"
                        variant="ghost"
                        color="red"
                        onClick={() => handleDeleteRincian(rincian)}
                        className="cursor-pointer"
                      >
                        <Trash className="h-3 w-3" />
                      </IconButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata Tagihan */}
        <div className="p-6 border-t border-slate-200 space-y-4 bg-slate-50">
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">
              Siswa
            </Text>
            <Text size="2" weight="medium" className="text-slate-900">
              {selectedItem.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
            </Text>
            {selectedItem.riwayat_kelas_siswa?.siswa?.nisn && (
              <Text size="1" className="text-slate-500 font-mono">
                NISN: {selectedItem.riwayat_kelas_siswa.siswa.nisn}
              </Text>
            )}
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">
              Kelas
            </Text>
            <Text size="2" className="text-slate-700">
              {selectedItem.riwayat_kelas_siswa?.kelas
                ? `${selectedItem.riwayat_kelas_siswa.kelas.tingkat} ${selectedItem.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
                : '—'}
            </Text>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">
                Tgl Tagihan
              </Text>
              <Text size="2" className="text-slate-700">
                {formatDate(selectedItem.tanggal_tagihan)}
              </Text>
            </div>
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">
                Jatuh Tempo
              </Text>
              <Text size="2" className="text-slate-700">
                {formatDate(selectedItem.tanggal_jatuh_tempo)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <RincianTagihanFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSaveRincian}
        initialData={currentRincian}
        isEdit={editMode}
        jenisPembayaranList={jenisPembayaranList}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        itemName="rincian tagihan"
      />
    </div>
  )
}
