import { Text } from '@radix-ui/themes'

export function DetailPanelCapacity({ selectedItem }) {
  const capacityMax = Number(selectedItem.kapasitas_maksimal || 0)
  const occupied = 0
  const available = Math.max(capacityMax - occupied, 0)
  const occupancyPct = capacityMax > 0 ? Math.round((occupied / capacityMax) * 100) : 0

  return (
    <section className="space-y-3 py-6">
      <Text size="1" className="uppercase tracking-wide text-slate-500">Kapasitas</Text>
      <div className="grid grid-cols-3 gap-6 max-sm:grid-cols-3">
        <div>
          <div className="text-xs text-slate-500">Maksimal</div>
          <div className="mt-0.5 text-2xl font-semibold text-slate-900">{capacityMax}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Terisi</div>
          <div className="mt-0.5 text-2xl font-semibold text-slate-900">{occupied}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Tersedia</div>
          <div className="mt-0.5 text-2xl font-semibold text-slate-900">{available}</div>
        </div>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500/80" style={{ width: `${occupancyPct}%` }} />
      </div>
      <div className="flex justify-end text-xs text-slate-500">Okupansi {occupancyPct}%</div>
    </section>
  )
}
