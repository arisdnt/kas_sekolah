import { useState } from 'react'
 
import { PageLayout } from '../../layout/PageLayout'
import { Loader } from '../../components/Loader'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useRiwayatKelasSiswa } from './hooks/useRiwayatKelasSiswa'
import { RiwayatKelasSiswaTable } from './components/RiwayatKelasSiswaTable'
import RiwayatKelasSiswaFormDialog from './components/RiwayatKelasSiswaFormDialog'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { DetailPanel } from './components/DetailPanel'

function RiwayatKelasSiswaContent() {
  const {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    siswaList,
    kelasList,
    tahunAjaranList,
  } = useRiwayatKelasSiswa()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpenCreate = () => {
    setEditMode(false)
    setCurrentItem({
      id: '',
      id_siswa: undefined,
      id_kelas: undefined,
      id_tahun_ajaran: undefined,
      tanggal_masuk: '',
      tanggal_keluar: '',
      status: 'aktif',
      catatan: '',
    })
    setError('')
    setDialogOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditMode(true)
    setCurrentItem(item)
    setError('')
    setDialogOpen(true)
  }

  const handleOpenDelete = (item) => {
    setCurrentItem(item)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (currentItem) {
      await deleteItem(currentItem.id)
      setCurrentItem(null)
    }
  }

  // Hindari loader layar penuh

  return (
    <PageLayout>
        <div className="flex flex-col h-full">
        {error ? (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">
                Terjadi kesalahan
              </Text>
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        ) : null}

        {/* Layout 2 Kolom: 75% Tabel | 25% Detail */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Kolom Kiri: Tabel (75%) */}
          <div className="w-3/4 h-full">
            <RiwayatKelasSiswaTable
              data={data}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
            />
          </div>

          {/* Kolom Kanan: Detail Panel (25%) */}
          <div className="w-1/4 h-full">
            <DetailPanel
              selectedItem={selectedItem}
            />
          </div>
        </div>
      </div>

      <RiwayatKelasSiswaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={saveItem}
        initialData={currentItem}
        isEdit={editMode}
        siswaList={siswaList}
        kelasList={kelasList}
        tahunAjaranList={tahunAjaranList}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
      </PageLayout>
  )
}

export function RiwayatKelasSiswa() {
  return <RiwayatKelasSiswaContent />
}
