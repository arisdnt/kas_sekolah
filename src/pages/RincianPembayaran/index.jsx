import { useState } from 'react'
 
import { PageLayout } from '../../layout/PageLayout'
import { Loader } from '../../components/Loader'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useRincianPembayaran } from './hooks/useRincianPembayaran'
import { RincianPembayaranTable } from './components/RincianPembayaranTable'
import RincianPembayaranFormDialog from './components/RincianPembayaranFormDialog'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { VerifyDialog } from './components/VerifyDialog'
import { DetailPanel } from './components/DetailPanel'

function RincianPembayaranContent() {
  const {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    verifyItem,
    pembayaranList,
  } = useRincianPembayaran()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false)
  const [isReject, setIsReject] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpenCreate = () => {
    setEditMode(false)
    setCurrentItem({
      id: '',
      id_pembayaran: undefined,
      nomor_transaksi: '',
      jumlah_dibayar: '',
      tanggal_bayar: new Date().toISOString().split('T')[0],
      metode_pembayaran: 'transfer',
      referensi_pembayaran: '',
      catatan: '',
      status: 'pending',
      cicilan_ke: '',
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

  const handleOpenVerify = (item) => {
    setCurrentItem(item)
    setIsReject(false)
    setVerifyDialogOpen(true)
  }

  const handleOpenReject = (item) => {
    setCurrentItem(item)
    setIsReject(true)
    setVerifyDialogOpen(true)
  }

  const handleDelete = async () => {
    if (currentItem) {
      await deleteItem(currentItem.id)
      setCurrentItem(null)
    }
  }

  const handleVerify = async (rejectReason) => {
    if (currentItem) {
      await verifyItem(currentItem.id, !isReject, rejectReason)
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
              <Text size="2" weight="medium" className="text-red-700">Terjadi kesalahan</Text>
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        ) : null}

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-3/4 h-full">
            <RincianPembayaranTable
              data={data}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
              onVerify={handleOpenVerify}
              onReject={handleOpenReject}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
            />
          </div>

          <div className="w-1/4 h-full">
            <DetailPanel selectedItem={selectedItem} />
          </div>
        </div>
      </div>

      <RincianPembayaranFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={saveItem}
        initialData={currentItem}
        isEdit={editMode}
        pembayaranList={pembayaranList}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <VerifyDialog
        open={verifyDialogOpen}
        onOpenChange={setVerifyDialogOpen}
        onConfirm={handleVerify}
        isReject={isReject}
      />
      </PageLayout>
  )
}

export function RincianPembayaran() {
  return <RincianPembayaranContent />
}
