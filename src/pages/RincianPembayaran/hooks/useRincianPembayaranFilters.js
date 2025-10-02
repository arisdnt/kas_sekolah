import { useMemo, useState } from 'react'
import { formatCurrency } from '../utils/helpers'

export function useRincianPembayaranFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nomor_transaksi?.toLowerCase().includes(query) ||
        item.pembayaran?.nomor_pembayaran?.toLowerCase().includes(query) ||
        item.metode_pembayaran?.toLowerCase().includes(query)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    return filtered
  }, [data, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const total = data.length
    const totalJumlah = data.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)
    const pending = data.filter((item) => item.status === 'pending').length
    const verified = data.filter((item) => item.status === 'verified').length
    const filtered = filteredData.length

    return { total, totalJumlah, pending, verified, filtered }
  }, [data, filteredData])

  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
