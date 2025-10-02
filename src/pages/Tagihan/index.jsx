import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
 
import { PageLayout } from '../../layout/PageLayout'
import { Loader } from '../../components/Loader'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useTagihan } from './hooks/useTagihan'
import { TagihanTable } from './components/TagihanTable'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { DetailPanelWithRincian } from './components/DetailPanelWithRincian'

function TagihanContent() {
  const navigate = useNavigate()
  const {
    data,
    loading,
    realtimeStatus,
    error,
    deleteItem,
  } = useTagihan()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpenCreate = () => {
    // Redirect ke halaman create tagihan
    navigate('/tagihan/create')
  }

  const handleOpenEdit = (item) => {
    // Redirect ke halaman edit tagihan
    navigate(`/tagihan/edit/${item.id}`)
  }

  const handleOpenDelete = (item) => {
    setCurrentItem(item)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (currentItem) {
      await deleteItem(currentItem.id)
      setCurrentItem(null)
      setSelectedItem(null)
    }
  }

  const handleRefresh = async () => {
    window.location.reload()
  }

  // Hindari loader layar penuh untuk sensasi native; render layout langsung

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

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-3/4 h-full">
            <TagihanTable
              data={data}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
            />
          </div>

          <div className="w-1/4 h-full">
            <DetailPanelWithRincian 
              selectedItem={selectedItem} 
              onRefresh={handleRefresh}
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

export function Tagihan() {
  return <TagihanContent />
}
