import { Clock } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

export function DetailPanelFooter({ selectedItem, footerInfo }) {
  return (
    <div className="shrink-0 px-4 py-3 text-xs text-slate-500 border-t border-slate-200/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          <span>Diperbarui {selectedItem.diperbarui_pada ? formatDateTime(selectedItem.diperbarui_pada) : formatDateTime(selectedItem.dibuat_pada)}</span>
        </div>
        <span className="font-mono">ID {selectedItem.id}</span>
      </div>
      {footerInfo ? <div className="mt-1 text-right">{footerInfo}</div> : null}
    </div>
  )
}
