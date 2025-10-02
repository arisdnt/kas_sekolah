import { useNavigate } from 'react-router-dom'
 
import { PageLayout } from '../../layout/PageLayout'
import { Button } from '@radix-ui/themes'
import { Save } from 'lucide-react'
import { useCreatePembayaran } from './hooks/useCreatePembayaran'
import { CreatePembayaranHeader } from './components/CreatePembayaranHeader'
import { TagihanSelector } from './components/TagihanSelector'
import { PembayaranInfoForm } from './components/PembayaranInfoForm'
import { RincianPembayaranList } from './components/RincianPembayaranList'

function CreatePembayaranContent() {
  const navigate = useNavigate()
  
  const {
    tagihanList,
    selectedTagihan,
    formData,
    setFormData,
    rincianItems,
    error,
    submitting,
    handleTagihanChange,
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    totalPembayaran,
    handleSubmit,
  } = useCreatePembayaran()

  return (
       <PageLayout>
        <div className="flex flex-col h-full">
        <CreatePembayaranHeader onBack={() => navigate('/pembayaran')} error={error} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <TagihanSelector
              tagihanList={tagihanList}
              selectedTagihan={selectedTagihan}
              value={formData.id_tagihan}
              onChange={handleTagihanChange}
            />

            <PembayaranInfoForm
              formData={formData}
              onChange={(field, value) => setFormData({...formData, [field]: value})}
            />

            <RincianPembayaranList
              rincianItems={rincianItems}
              selectedTagihan={selectedTagihan}
              totalPembayaran={totalPembayaran}
              onAdd={handleAddRincian}
              onChange={handleRincianChange}
              onRemove={handleRemoveRincian}
            />

            {/* Actions */}
            <div className="flex gap-3 justify-end pb-8">
              <Button
                variant="soft"
                color="gray"
                onClick={() => navigate('/pembayaran')}
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
                {submitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
              </Button>
            </div>
          </div>
        </div>
        </div>
      </PageLayout>
  )
}

export function CreatePembayaran() {
  return <CreatePembayaranContent />
}
