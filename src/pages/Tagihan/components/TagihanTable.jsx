import { useMemo, useState } from 'react'
import { IconButton, Text, Button, TextField } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Receipt, Clock, Plus, X } from 'lucide-react'

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

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function TagihanTable({ data, onEdit, onDelete, onAdd, selectedItem, onSelectItem }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nomor_tagihan?.toLowerCase().includes(query) ||
        item.judul?.toLowerCase().includes(query) ||
        item.riwayat_kelas_siswa?.siswa?.nama_lengkap?.toLowerCase().includes(query) ||
        item.riwayat_kelas_siswa?.siswa?.nisn?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [data, searchQuery])

  const stats = useMemo(() => {
    const total = data.length
    const filtered = filteredData.length

    return { total, filtered }
  }, [data, filteredData])

  const isEmpty = filteredData.length === 0
  const hasActiveFilters = searchQuery.trim()

  const handleClearFilters = () => {
    setSearchQuery('')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-wrap items-center gap-4 px-6 py-4">
            <div className="flex-1 min-w-[240px] max-w-xs">
              <TextField.Root
                placeholder="Cari nomor, judul, siswa..."
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

            <div className="ml-auto flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200">
                <span className="text-slate-500">Total:</span>
                <span className="font-semibold text-slate-900">{stats.total}</span>
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200">
                  <span className="text-blue-700">Ditampilkan:</span>
                  <span className="font-semibold text-blue-900">{stats.filtered}</span>
                </div>
              )}
            </div>

            <div>
              <Button
                onClick={onAdd}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                size="2"
                style={{ borderRadius: 0 }}
              >
                <Plus className="h-4 w-4" />
                Tambah Tagihan
              </Button>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>
                <col style={{ width: '13%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '16%' }} />
                <col style={{ width: '13%' }} />
                <col style={{ width: '12%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '7%' }} />
              </colgroup>
              <thead>
                <tr className="bg-white/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    No. Tagihan
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Judul
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Siswa
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tgl Tagihan
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Jatuh Tempo
                  </th>
                  <th className="px-6 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
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
                      <Text size="2" weight="medium" className="text-slate-900 font-mono">
                        {item.nomor_tagihan || '—'}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" weight="medium" className="text-slate-900">
                        {item.judul || '—'}
                      </Text>
                      {item.deskripsi && (
                        <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
                          {item.deskripsi}
                        </Text>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <Text size="2" className="text-slate-700">
                          {item.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
                        </Text>
                        {item.riwayat_kelas_siswa?.siswa?.nisn && (
                          <Text size="1" className="text-slate-500 font-mono">
                            {item.riwayat_kelas_siswa.siswa.nisn}
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {item.riwayat_kelas_siswa?.kelas
                          ? `${item.riwayat_kelas_siswa.kelas.tingkat} ${item.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
                          : '—'}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" weight="bold" className="text-emerald-700">
                        {formatCurrency(item.total_tagihan)}
                      </Text>
                      {item.rincian_tagihan && item.rincian_tagihan.length > 0 && (
                        <Text size="1" className="text-slate-500 mt-0.5">
                          {item.rincian_tagihan.length} item
                        </Text>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {formatDate(item.tanggal_tagihan)}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {formatDate(item.tanggal_jatuh_tempo)}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                          }}
                          className="cursor-pointer hover:bg-blue-50 text-blue-600"
                          aria-label="Edit"
                        >
                          <Pencil1Icon />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item)
                          }}
                          className="cursor-pointer hover:bg-red-50 text-red-600"
                          aria-label="Hapus"
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {isEmpty ? (
                  <tr>
                    <td colSpan={8} className="relative">
                      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                        {hasActiveFilters ? (
                          <>
                            <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mb-4" />
                            <Text size="3" className="text-slate-500 mb-1">
                              Tidak ada data yang sesuai
                            </Text>
                            <Text size="2" className="text-slate-400 mb-4">
                              Coba ubah kata kunci pencarian
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
                            <Receipt className="h-12 w-12 text-slate-300 mb-4" />
                            <Text size="3" className="text-slate-500 mb-1">
                              Belum ada tagihan
                            </Text>
                            <Text size="2" className="text-slate-400">
                              Tambahkan tagihan baru melalui tombol di atas.
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
