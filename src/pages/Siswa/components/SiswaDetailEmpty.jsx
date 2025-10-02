import { Text } from '@radix-ui/themes'
import { Users } from 'lucide-react'

export function SiswaDetailEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center border border-slate-200/80 bg-white/80 backdrop-blur p-6">
      <div className="text-center text-slate-400">
        <Users className="mx-auto mb-4 h-16 w-16 text-slate-300" />
        <Text size="3" className="mb-2 text-slate-500">
          Tidak ada data dipilih
        </Text>
        <Text size="2" className="text-slate-400">
          Pilih baris pada tabel untuk melihat detail
        </Text>
      </div>
    </div>
  )
}
