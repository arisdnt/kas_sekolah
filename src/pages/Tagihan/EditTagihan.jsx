import { PageLayout } from '../../layout/PageLayout'
import { Button } from '@radix-ui/themes'
import { Save } from 'lucide-react'
import { useEditTagihan } from '../../hooks/useEditTagihan'
import { useRincianItems } from '../../hooks/useRincianItems'
import { EditTagihanHeader } from '../../components/tagihan/EditTagihanHeader'
import { TagihanFormFields } from '../../components/tagihan/TagihanFormFields'
import { RincianSection } from '../../components/tagihan/RincianSection'

function EditTagihanContent() {
  const {
    riwayatKelasSiswaList,
    jenisPembayaranList,
    formData,
    setFormData,
    rincianItems,
    setRincianItems,
    error,
    submitting,
    handleSubmit,
    navigate,
  } = useEditTagihan()

  const {
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    totalTagihan,
  } = useRincianItems(rincianItems, setRincianItems, jenisPembayaranList)

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        <EditTagihanHeader onBack={() => navigate('/tagihan')} error={error} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <TagihanFormFields
              formData={formData}
              setFormData={setFormData}
              riwayatKelasSiswaList={riwayatKelasSiswaList}
            />

            <RincianSection
              rincianItems={rincianItems}
              jenisPembayaranList={jenisPembayaranList}
              onAdd={handleAddRincian}
              onRemove={handleRemoveRincian}
              onChange={handleRincianChange}
              totalTagihan={totalTagihan}
            />

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
                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function EditTagihan() {
  return <EditTagihanContent />
}
