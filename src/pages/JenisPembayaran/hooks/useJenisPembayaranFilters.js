import { useEffect, useMemo, useState } from 'react'

export function useJenisPembayaranFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTipe, setFilterTipe] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTahunId, setFilterTahunId] = useState('all')
  const [filterTingkat, setFilterTingkat] = useState('all')
  const [filterKelasId, setFilterKelasId] = useState('all')

  // Derived lists for filters
  const tahunList = useMemo(() => {
    const map = new Map()
    for (const item of data) {
      const ta = item.tahun_ajaran
      if (ta?.id && !map.has(ta.id)) map.set(ta.id, ta.nama)
    }
    return Array.from(map, ([id, nama]) => ({ id, nama }))
  }, [data])

  const kelasList = useMemo(() => {
    const map = new Map()
    for (const item of data) {
      const k = item.kelas
      if (k?.id && !map.has(k.id)) {
        map.set(k.id, { id: k.id, tingkat: k.tingkat, nama_sub_kelas: k.nama_sub_kelas })
      }
    }
    return Array.from(map.values())
  }, [data])

  const tingkatList = useMemo(() => {
    return Array.from(new Set(kelasList.map(k => k.tingkat))).sort()
  }, [kelasList])

  const kelasByTingkat = useMemo(() => {
    const grouped = new Map()
    for (const k of kelasList) {
      if (!grouped.has(k.tingkat)) grouped.set(k.tingkat, [])
      grouped.get(k.tingkat).push(k)
    }
    for (const arr of grouped.values()) {
      arr.sort((a, b) => (a.nama_sub_kelas || '').localeCompare(b.nama_sub_kelas || ''))
    }
    return grouped
  }, [kelasList])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.kode?.toLowerCase().includes(query) ||
        item.nama?.toLowerCase().includes(query)
      )
    }

    if (filterTipe !== 'all') {
      filtered = filtered.filter((item) => item.tipe_pembayaran === filterTipe)
    }

    if (filterStatus === 'aktif') {
      filtered = filtered.filter((item) => item.status_aktif)
    } else if (filterStatus === 'nonaktif') {
      filtered = filtered.filter((item) => !item.status_aktif)
    }

    if (filterTahunId !== 'all') {
      filtered = filtered.filter((item) => item.id_tahun_ajaran === filterTahunId)
    }
    if (filterTingkat !== 'all') {
      filtered = filtered.filter((item) => item.kelas?.tingkat === filterTingkat)
    }
    if (filterKelasId !== 'all') {
      filtered = filtered.filter((item) => item.id_kelas === filterKelasId)
    }

    return filtered
  }, [data, searchQuery, filterTipe, filterStatus, filterTahunId, filterTingkat, filterKelasId])

  const hasActiveFilters = searchQuery.trim() || filterTipe !== 'all' || 
    filterStatus !== 'all' || filterTahunId !== 'all' || 
    filterTingkat !== 'all' || filterKelasId !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterTipe('all')
    setFilterStatus('all')
    setFilterTahunId('all')
    setFilterTingkat('all')
    setFilterKelasId('all')
  }

  // Reset kelas when tingkat changes
  useEffect(() => {
    setFilterKelasId('all')
  }, [filterTingkat])

  return {
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
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  }
}
