import { useMemo, useState } from 'react'
import { Badge, IconButton, Switch, Text, Button, TextField, Select } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Calendar, Clock2, Plus, X } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function TahunAjaranTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdd,
  selectedItem,
  onSelectItem,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nama.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((item) => item.status_aktif)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((item) => !item.status_aktif)
    }

    return filtered
  }, [data, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const total = data.length
    const active = data.filter((item) => item.status_aktif).length
    const filtered = filteredData.length
    const lastUpdate = data
      .map((item) => item.diperbarui_pada || item.dibuat_pada)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))
      .at(0)

    return {
      total,
      active,
      filtered,
      lastUpdate: lastUpdate ? formatDateTime(lastUpdate) : 'Belum ada aktivitas',
    }
  }, [data, filteredData])

  const isEmpty = !isLoading && filteredData.length === 0
  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        {/* Header Section - Single Row */}
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-wrap items-center gap-4 px-6 py-4">
            {/* Search */}
            <div className="flex-1 min-w-[240px] max-w-xs">
              <TextField.Root
                placeholder="Cari periode atau ID..."
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

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                <Select.Trigger 
                  style={{ borderRadius: 0, minWidth: '130px' }}
                  className="cursor-pointer"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">Semua Status</Select.Item>
                  <Select.Item value="active">Aktif</Select.Item>
                  <Select.Item value="inactive">Nonaktif</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Reset Filter */}
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="soft"
                color="gray"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Stats - Kanan */}
            <div className="ml-auto flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200">
                <span className="text-slate-500">Total:</span>
                <span className="font-semibold text-slate-900">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200">
                <span className="inline-flex h-1.5 w-1.5 bg-emerald-500" />
                <span className="text-emerald-700">Aktif:</span>
                <span className="font-semibold text-emerald-900">{stats.active}</span>
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200">
                  <span className="text-blue-700">Ditampilkan:</span>
                  <span className="font-semibold text-blue-900">{stats.filtered}</span>
                </div>
              )}
            </div>

            {/* Button Tambah Baru - Paling Kanan */}
            <div>
              <Button
                onClick={onAdd}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                size="2"
                style={{ borderRadius: 0 }}
              >
                <Plus className="h-4 w-4" />
                Tambah Baru
              </Button>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            {isRefreshing && !isLoading ? (
              <div className="pointer-events-none sticky top-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
            ) : null}
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: '28%' }} />
                <col style={{ width: '28%' }} />
                <col style={{ width: '20%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '8%' }} />
              </colgroup>
              <thead>
                <tr className="bg-white/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Periode Akademik
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Rentang Waktu
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Status
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
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="px-6 py-4 align-middle">
                          <div className="flex flex-col gap-2">
                            <div className="h-4 w-40 bg-slate-200" />
                            <div className="h-3 w-24 bg-slate-200" />
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex gap-6">
                            <div className="space-y-2">
                              <div className="h-3 w-20 bg-slate-200" />
                              <div className="h-3 w-24 bg-slate-200" />
                            </div>
                            <div className="space-y-2">
                              <div className="h-3 w-16 bg-slate-200" />
                              <div className="h-3 w-24 bg-slate-200" />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="h-6 w-24 bg-slate-200" />
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="h-3 w-28 bg-slate-200" />
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="ml-auto h-6 w-20 bg-slate-200" />
                        </td>
                      </tr>
                    ))
                  : filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`group transition-colors cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-indigo-50/40'
                    }`}
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <Text size="3" weight="medium" className="text-slate-900">
                          {item.nama}
                        </Text>
                        <Text size="1" className="text-slate-500 uppercase tracking-wider">
                          ID: {item.id?.slice(0, 8) ?? '—'}
                        </Text>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-600">
                        <div>
                          <Text size="1" className="text-slate-500 uppercase tracking-wider">
                            Mulai
                          </Text>
                          <Text size="2" className="text-slate-700">
                            {formatDate(item.tanggal_mulai)}
                          </Text>
                        </div>
                        <div>
                          <Text size="1" className="text-slate-500 uppercase tracking-wider">
                            Selesai
                          </Text>
                          <Text size="2" className="text-slate-700">
                            {formatDate(item.tanggal_selesai)}
                          </Text>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={item.status_aktif}
                          onCheckedChange={() => onToggleStatus(item)}
                          size="2"
                        />
                        <Badge
                          variant="soft"
                          color={item.status_aktif ? 'green' : 'gray'}
                          className="text-xs"
                        >
                          {item.status_aktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock2 className="h-4 w-4 text-slate-400" />
                        <span>{formatDateTime(item.diperbarui_pada || item.dibuat_pada)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={() => onEdit(item)}
                          className="cursor-pointer hover:bg-blue-50 text-blue-600"
                          aria-label={`Edit ${item.nama}`}
                        >
                          <Pencil1Icon />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={() => onDelete(item)}
                          className="cursor-pointer hover:bg-red-50 text-red-600"
                          aria-label={`Hapus ${item.nama}`}
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                  ))}
                {isEmpty ? (
                  <tr>
                    <td colSpan={5} className="relative">
                      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                        {hasActiveFilters ? (
                          <>
                            <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mb-4" />
                            <Text size="3" className="text-slate-500 mb-1">
                              Tidak ada data yang sesuai
                            </Text>
                            <Text size="2" className="text-slate-400 mb-4">
                              Coba ubah kata kunci pencarian atau filter yang Anda gunakan
                            </Text>
                            <Button
                              onClick={handleClearFilters}
                              variant="soft"
                              size="2"
                              style={{ borderRadius: 0 }}
                              className="cursor-pointer"
                            >
                              Reset Pencarian
                            </Button>
                          </>
                        ) : (
                          <>
                            <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                            <Text size="3" className="text-slate-500 mb-1">
                              Belum ada data tahun ajaran
                            </Text>
                            <Text size="2" className="text-slate-400">
                              Tambahkan periode baru melalui tombol di atas untuk mulai mengelola daftar ini.
                            </Text>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>


        </div>
      </div>
    </div>
  )
}
