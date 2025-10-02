import { useJenisPembayaranFilters } from '../hooks/useJenisPembayaranFilters'
import { JenisPembayaranFilters } from './JenisPembayaranFilters'
import { JenisPembayaranTableHeader } from './JenisPembayaranTableHeader'
import { JenisPembayaranTableRow } from './JenisPembayaranTableRow'
import { JenisPembayaranEmptyState } from './JenisPembayaranEmptyState'

export function JenisPembayaranTable({ data, isLoading, isRefreshing, onEdit, onDelete, onAdd, onViewDetail, selectedItem, onSelectItem }) {
  const filters = useJenisPembayaranFilters(data)
  const isEmpty = filters.filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg relative">
        <JenisPembayaranFilters
          searchQuery={filters.searchQuery}
          setSearchQuery={filters.setSearchQuery}
          filterTipe={filters.filterTipe}
          setFilterTipe={filters.setFilterTipe}
          filterStatus={filters.filterStatus}
          setFilterStatus={filters.setFilterStatus}
          filterTahunId={filters.filterTahunId}
          setFilterTahunId={filters.setFilterTahunId}
          filterTingkat={filters.filterTingkat}
          setFilterTingkat={filters.setFilterTingkat}
          filterKelasId={filters.filterKelasId}
          setFilterKelasId={filters.setFilterKelasId}
          tahunList={filters.tahunList}
          tingkatList={filters.tingkatList}
          kelasByTingkat={filters.kelasByTingkat}
          hasActiveFilters={filters.hasActiveFilters}
          handleClearFilters={filters.handleClearFilters}
          onAdd={onAdd}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: '10%' }} /> {/* Kode */}
                <col style={{ width: '18%' }} /> {/* Nama */}
                <col style={{ width: '12%' }} /> {/* Jumlah Default */}
                <col style={{ width: '10%' }} /> {/* Tipe */}
                <col style={{ width: '14%' }} /> {/* Tahun Ajaran */}
                <col style={{ width: '14%' }} /> {/* Kelas */}
                <col style={{ width: '8%' }} />  {/* Wajib */}
                <col style={{ width: '8%' }} />  {/* Status */}
                <col style={{ width: '6%' }} />  {/* Aksi */}
              </colgroup>
              <JenisPembayaranTableHeader />
              <tbody className="divide-y divide-slate-100">
                {filters.filteredData.map((item) => (
                  <JenisPembayaranTableRow
                    key={item.id}
                    item={item}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetail={onViewDetail}
                    selectedItem={selectedItem}
                    onSelectItem={onSelectItem}
                  />
                ))}
                {isEmpty && (
                  <JenisPembayaranEmptyState
                    hasActiveFilters={filters.hasActiveFilters}
                    onClearFilters={filters.handleClearFilters}
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
