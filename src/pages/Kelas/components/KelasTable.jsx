import { useKelasFilters } from '../hooks/useKelasFilters'
import { KelasTableHeader } from './KelasTableHeader'
import { KelasTableRow } from './KelasTableRow'
import { KelasTableSkeleton } from './KelasTableSkeleton'
import { KelasEmptyState } from './KelasEmptyState'

export function KelasTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onAdd,
  selectedItem,
  onSelectItem,
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterTingkat,
    setFilterTingkat,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = useKelasFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        <KelasTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterTingkat={filterTingkat}
          setFilterTingkat={setFilterTingkat}
          stats={stats}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAdd={onAdd}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            {isRefreshing && !isLoading ? (
              <div className="pointer-events-none sticky top-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
            ) : null}
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: '15%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '15%' }} />
                <col style={{ width: '25%' }} />
                <col style={{ width: '17%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr className="bg-white/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tingkat
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Nama Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Kapasitas
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Terakhir Diperbarui
                  </th>
                  <th className="px-6 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <KelasTableSkeleton />
                ) : (
                  filteredData.map((item) => (
                    <KelasTableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={onSelectItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))
                )}
                {isEmpty && (
                  <KelasEmptyState
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
