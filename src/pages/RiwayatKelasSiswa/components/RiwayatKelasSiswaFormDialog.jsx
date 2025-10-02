import { Dialog } from '@radix-ui/themes'
import { useRiwayatKelasSiswaForm } from '../hooks/useRiwayatKelasSiswaForm'
import { PrimaryInfoSection } from './PrimaryInfoSection'
import { TimelineSection } from './TimelineSection'
import { FormError } from './FormError'
import { FormActions } from './FormActions'

function RiwayatKelasSiswaFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  siswaList,
  kelasList,
  tahunAjaranList
}) {
  const {
    formData,
    setFormData,
    submitting,
    error,
    handleSubmit,
  } = useRiwayatKelasSiswaForm(initialData, isEdit, onSubmit, onOpenChange)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: 900,
          borderRadius: 0,
          width: '90vw'
        }}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <PrimaryInfoSection
              formData={formData}
              setFormData={setFormData}
              siswaList={siswaList}
              kelasList={kelasList}
              tahunAjaranList={tahunAjaranList}
            />

            <TimelineSection
              formData={formData}
              setFormData={setFormData}
            />
          </div>

          <FormError error={error} />

          <FormActions
            submitting={submitting}
            isEdit={isEdit}
            onCancel={() => onOpenChange(false)}
          />
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RiwayatKelasSiswaFormDialog
