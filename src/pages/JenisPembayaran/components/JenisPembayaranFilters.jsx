import { Button, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X } from 'lucide-react'
import { FilterSelects } from './FilterSelects'

export function JenisPembayaranFilters({
  searchQuery,
  setSearchQuery,
  filterTipe,
  setFilterTipe,
  filterStatus,
  setFilterStatus,
  filterTahunId,
  setFilterTahunId,
  filterTingkat,
  setFilterTingkat,
  filterKelasId,
  setFilterKelasId,
  tahunList,
  tingkatList,
  kelasByTingkat,
  hasActiveFilters,
  handleClearFilters,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white overflow-visible">
      <div className="flex items-center gap-4 px-6 py-3 overflow-visible">
        {/* Left Column - 95% for forms and filters */}
        <div className="flex-[95_1_0%] flex items-center gap-3 overflow-x-auto scrollbar-hide" style={{ zIndex: 50 }}>
          {/* Search Field */}
          <div className="flex-shrink-0 min-w-[220px]">
            <TextField.Root
              placeholder="Cari kode atau nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="2"
              style={{ borderRadius: 0 }}
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
              {searchQuery && (
                <TextField.Slot>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="cursor-pointer text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </TextField.Slot>
              )}
            </TextField.Root>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-nowrap">
            <FilterSelects
              filterTahunId={filterTahunId}
              setFilterTahunId={setFilterTahunId}
              filterTingkat={filterTingkat}
              setFilterTingkat={setFilterTingkat}
              filterKelasId={filterKelasId}
              setFilterKelasId={setFilterKelasId}
              filterTipe={filterTipe}
              setFilterTipe={setFilterTipe}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              tahunList={tahunList}
              tingkatList={tingkatList}
              kelasByTingkat={kelasByTingkat}
            />

            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="soft"
                color="gray"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer shrink-0"
                title="Reset Filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Right Column - 5% for add button */}
        <div className="flex-[5_0_auto] flex justify-end">
          <Button
            onClick={onAdd}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
            size="2"
            style={{ borderRadius: 0 }}
            title="Tambah Jenis Pembayaran"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
