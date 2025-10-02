import { Button, Flex } from '@radix-ui/themes'
import { Save } from 'lucide-react'

export function EditJenisPembayaranActions({ submitting, onCancel }) {
  return (
    <div className="mt-6 pt-6 border-t border-slate-200">
      <Flex gap="3" justify="end">
        <Button 
          type="button"
          variant="soft" 
          color="gray" 
          disabled={submitting}
          onClick={onCancel}
        >
          Batal
        </Button>
        <Button type="submit" disabled={submitting}>
          <Save className="h-4 w-4 mr-2" />
          {submitting ? 'Menyimpan...' : 'Perbarui'}
        </Button>
      </Flex>
    </div>
  )
}
