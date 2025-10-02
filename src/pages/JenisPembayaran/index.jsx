import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useJenisPembayaran } from './hooks/useJenisPembayaran'
import { JenisPembayaranTable } from './components/JenisPembayaranTable'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'

function JenisPembayaranContent() {
  const navigate = useNavigate()
  const {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
  } = useJenisPembayaran()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const handleOpenCreate = () => {
    navigate('/jenis-pembayaran/create')
  }

  const handleOpenEdit = (item) => {
    navigate(`/jenis-pembayaran/edit/${item.id}`)
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
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        ) : null}

        <div className="flex-1 min-h-0">
          <div className="w-full h-full">
            <JenisPembayaranTable
              data={data}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
            />
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
      </PageLayout>
  )
}

export function JenisPembayaran() {
  return <JenisPembayaranContent />
}
