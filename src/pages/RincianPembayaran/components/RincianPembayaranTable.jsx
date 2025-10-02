import { useRincianPembayaranFilters } from '../hooks/useRincianPembayaranFilters'
import { RincianPembayaranTableHeader } from './RincianPembayaranTableHeader'
import { RincianPembayaranTableRow } from './RincianPembayaranTableRow'
import { RincianPembayaranEmptyState } from './RincianPembayaranEmptyState'

export function RincianPembayaranTable({ 
  data, 
  onEdit, 
  onDelete, 
  onAdd, 
  onVerify, 
  onReject, 
  selectedItem, 
  onSelectItem 
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = useRincianPembayaranFilters(data)

  const isEmpty = filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        <RincianPembayaranTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          stats={stats}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAdd={onAdd}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '12%' }} />
              </colgroup>
              <thead>
                <tr className="bg-white/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    No. Transaksi
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    No. Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Metode
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Cicilan Ke
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tanggal Bayar
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Verifikasi
                  </th>
                  <th className="px-6 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <RincianPembayaranTableRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={onSelectItem}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onVerify={onVerify}
                    onReject={onReject}
                  />
                ))}
                {isEmpty && (
                  <RincianPembayaranEmptyState
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
