import { Dialog, Flex, Button } from '@radix-ui/themes'
import { useRiwayatWaliKelasForm } from '../../../hooks/useRiwayatWaliKelasForm'
import { RiwayatWaliKelasFormFields } from '../../../components/riwayat-wali-kelas/RiwayatWaliKelasFormFields'

function RiwayatWaliKelasFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  waliKelasList,
  kelasList,
  tahunAjaranList
}) {
  const { formData, setFormData, submitting, error, handleSubmit } = useRiwayatWaliKelasForm(
    initialData,
    onSubmit,
    isEdit,
    onOpenChange
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: 600,
          borderRadius: 0
        }}
      >
        <Dialog.Title>
          {isEdit ? 'Edit Riwayat Wali Kelas' : 'Tambah Riwayat Wali Kelas'}
        </Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isEdit
            ? 'Perbarui informasi riwayat wali kelas'
            : 'Tambahkan riwayat penugasan wali kelas'}
        </Dialog.Description>

        <form onSubmit={handleSubmit}>
          <RiwayatWaliKelasFormFields
            formData={formData}
            setFormData={setFormData}
            waliKelasList={waliKelasList}
            kelasList={kelasList}
            tahunAjaranList={tahunAjaranList}
            error={error}
          />

          <Flex gap="3" mt="4" justify="end">
            <Button 
              type="button"
              variant="soft" 
              color="gray" 
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              style={{ borderRadius: 0 }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={submitting} style={{ borderRadius: 0 }}>
              {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RiwayatWaliKelasFormDialog
