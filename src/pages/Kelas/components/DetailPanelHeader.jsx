import { Text } from '@radix-ui/themes'
import { Hash } from 'lucide-react'

export function DetailPanelHeader({ selectedItem, schoolName, schoolAddress }) {
  return (
    <div className="shrink-0 px-4 pt-4 pb-3">
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <Text size="2" className="uppercase tracking-wider text-slate-500">{schoolName}</Text>
          {schoolAddress ? (
            <Text size="1" className="text-slate-500">{schoolAddress}</Text>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Hash className="h-3.5 w-3.5" />
          <span className="font-mono text-xs">KLS-{selectedItem.id.toString().padStart(4, '0')}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Text size="6" weight="bold" className="text-slate-900 leading-tight">
          {selectedItem.tingkat} {selectedItem.nama_sub_kelas}
        </Text>
      </div>
      <div className="mt-3 h-px bg-slate-200/60" />
    </div>
  )
}
