import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../../../lib/supabaseClient'

let cachedSiswa = null

export function useSiswa() {
  const [data, setData] = useState(() => cachedSiswa ?? [])
  const [loading, setLoading] = useState(() => !cachedSiswa)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('siswa')
      .select('*')
      .order('nama_lengkap', { ascending: true })

    if (queryError) {
      setError('Gagal memuat data siswa: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const applyData = useCallback((result) => {
    const next = Array.isArray(result) ? result : []
    cachedSiswa = next
    setData(next)
  }, [])

  const refreshData = useCallback(
    async ({ withSpinner = true } = {}) => {
      const showInitialSpinner = !cachedSiswa
      const showRefreshIndicator = cachedSiswa && withSpinner

      if (showInitialSpinner) {
        setLoading(true)
      }
      if (showRefreshIndicator) {
        setIsRefreshing(true)
      }

      setError('')

      try {
        const result = await fetchData()
        if (isMountedRef.current) {
          applyData(result)
        }
        return result
      } finally {
        if (isMountedRef.current) {
          if (showInitialSpinner) {
            setLoading(false)
          }
          if (showRefreshIndicator) {
            setIsRefreshing(false)
          }
        }
      }
    },
    [fetchData, applyData],
  )

  useEffect(() => {
    isMountedRef.current = true
    let ignore = false
    let channel

    async function initializeData() {
      await refreshData()

      channel = supabase
        .channel('realtime-siswa')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'siswa',
          },
          async (payload) => {
            console.log('Realtime event received:', payload.eventType)
            if (ignore) return
            await refreshData({ withSpinner: false })
          }
        )
        .subscribe((status) => {
          console.log('Realtime status:', status)
          if (!isMountedRef.current) return
          if (status === 'SUBSCRIBED') {
            setRealtimeStatus('connected')
          }
          if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
            setRealtimeStatus('disconnected')
          }
        })
    }

    initializeData()

    return () => {
      ignore = true
      isMountedRef.current = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [refreshData])

  const toggleStatus = async (item) => {
    try {
      const { error: updateError } = await supabase
        .from('siswa')
        .update({
          status_aktif: !item.status_aktif,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', item.id)

      if (updateError) throw updateError

      await refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('siswa')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await refreshData()
    } catch (err) {
      // Deteksi error foreign key constraint
      const errorMessage = err.message || ''
      
      if (errorMessage.includes('violates foreign key constraint')) {
        // Parse nama tabel dari error message
        const tableMatch = errorMessage.match(/on table "([^"]+)"/)
        const tableName = tableMatch ? tableMatch[1] : 'tabel terkait'
        
        // Mapping nama tabel ke nama yang lebih user-friendly
        const tableNameMap = {
          'riwayat_kelas_siswa': 'Riwayat Kelas Siswa',
          'transaksi': 'Transaksi',
          'pembayaran': 'Pembayaran',
          'tagihan': 'Tagihan'
        }
        
        const friendlyTableName = tableNameMap[tableName] || tableName
        
        setError(`Siswa tidak dapat dihapus karena masih memiliki data di tabel "${friendlyTableName}". Hapus data di tabel tersebut terlebih dahulu.`)
      } else {
        setError(err.message)
      }
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      // Generate token akses unik jika tidak ada (untuk siswa baru)
      const tokenAksesUnik = formData.token_akses_unik || 
        `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('siswa')
          .update({
            nama_lengkap: formData.nama_lengkap,
            nisn: formData.nisn || null,
            tanggal_lahir: formData.tanggal_lahir || null,
            jenis_kelamin: formData.jenis_kelamin || null,
            alamat: formData.alamat || null,
            nomor_whatsapp_wali: formData.nomor_whatsapp_wali || null,
            status_aktif: formData.status_aktif,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('siswa')
          .insert({
            nama_lengkap: formData.nama_lengkap,
            nisn: formData.nisn || null,
            tanggal_lahir: formData.tanggal_lahir || null,
            jenis_kelamin: formData.jenis_kelamin || null,
            alamat: formData.alamat || null,
            nomor_whatsapp_wali: formData.nomor_whatsapp_wali || null,
            token_akses_unik: tokenAksesUnik,
            status_aktif: formData.status_aktif,
          })

        if (insertError) throw insertError
      }

      await refreshData()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    isRefreshing,
    realtimeStatus,
    error,
    setError,
    toggleStatus,
    deleteItem,
    saveItem,
    refreshData,
  }
}
