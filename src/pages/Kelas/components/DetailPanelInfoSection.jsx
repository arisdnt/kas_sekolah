import { Text, Badge } from '@radix-ui/themes'

export function DetailPanelInfoSection({ selectedItem }) {
  return (
    <section className="space-y-3 pb-6">
      <Text size="1" className="uppercase tracking-wide text-slate-500">Informasi Kelas</Text>
      <div className="grid grid-cols-2 gap-6 text-slate-900 max-sm:grid-cols-1">
        <div>
          <div className="text-xs text-slate-500">Tingkat</div>
          <div className="mt-1">
            <Badge variant="soft" color="blue" size="1">{selectedItem.tingkat}</Badge>
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Sub Kelas</div>
          <div className="mt-1 font-mono text-sm px-2 py-1 rounded bg-slate-50 text-slate-900 inline-block">
            {selectedItem.nama_sub_kelas}
          </div>
        </div>
      </div>
    </section>
  )
}
