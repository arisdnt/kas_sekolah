import { Text } from '@radix-ui/themes'
import { FileText } from 'lucide-react'

export function TahunAjaranDetailEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center border border-slate-300 bg-white shadow-sm p-8 text-center">
      <div className="mb-6 border border-slate-200 bg-slate-50 p-4">
        <FileText className="h-12 w-12 text-slate-400" />
      </div>
      <Text size="4" weight="medium" className="mb-2 text-slate-600">
        Tidak Ada Dokumen Dipilih
      </Text>
      <Text size="2" className="max-w-48 text-slate-400">
        Pilih periode tahun ajaran dari tabel untuk melihat detail lengkap
      </Text>
    </div>
  )
}
