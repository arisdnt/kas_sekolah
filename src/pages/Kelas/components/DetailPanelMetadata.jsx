import { Text } from '@radix-ui/themes'
import { formatDateTime } from '../utils/dateHelpers'

export function DetailPanelMetadata({ selectedItem }) {
  return (
    <section className="space-y-3 pt-6">
      <Text size="1" className="uppercase tracking-wide text-slate-500">Metadata</Text>
      <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
        <div>
          <div className="text-xs text-slate-500">Dibuat</div>
          <div className="mt-1 text-sm text-slate-800">{formatDateTime(selectedItem.dibuat_pada)}</div>
        </div>
        {selectedItem.diperbarui_pada ? (
          <div>
            <div className="text-xs text-slate-500">Diperbarui</div>
            <div className="mt-1 text-sm text-slate-800">{formatDateTime(selectedItem.diperbarui_pada)}</div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
