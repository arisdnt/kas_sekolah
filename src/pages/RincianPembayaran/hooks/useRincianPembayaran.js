import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export function useRincianPembayaran() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const [pembayaranList, setPembayaranList] = useState([])

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('rincian_pembayaran')
      .select(`
        *,
        pembayaran:id_pembayaran(
          id, 
          nomor_pembayaran,
          tagihan:id_tagihan(
            nomor_tagihan,
            riwayat_kelas_siswa:id_riwayat_kelas_siswa(
              siswa:id_siswa(nama_lengkap, nisn)
            )
          )
        )
      `)
      .order('tanggal_bayar', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const fetchPembayaranList = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('pembayaran')
      .select(`
        id, 
        nomor_pembayaran,
        tagihan:id_tagihan(
          nomor_tagihan,
          riwayat_kelas_siswa:id_riwayat_kelas_siswa(
            siswa:id_siswa(nama_lengkap)
          )
        )
      `)
      .order('nomor_pembayaran', { ascending: false })

    if (!queryError) {
      setPembayaranList(result ?? [])
    }
  }, [])

  const refreshData = useCallback(async () => {
    const result = await fetchData()
    setData(result)
  }, [fetchData])

  useEffect(() => {
    let ignore = false
    let channel

    async function initializeData() {
      setLoading(true)
      setError('')

      await fetchPembayaranList()
      const result = await fetchData()
      
      if (!ignore) {
        setData(result)
        setLoading(false)
      }

      channel = supabase
        .channel('realtime-rincian-pembayaran')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rincian_pembayaran',
          },
          async () => {
            const { data: refreshedData } = await supabase
              .from('rincian_pembayaran')
              .select(`
                *,
                pembayaran:id_pembayaran(
                  id, 
                  nomor_pembayaran,
                  tagihan:id_tagihan(
                    nomor_tagihan,
                    riwayat_kelas_siswa:id_riwayat_kelas_siswa(
                      siswa:id_siswa(nama_lengkap, nisn)
                    )
                  )
                )
              `)
              .order('tanggal_bayar', { ascending: false })

            if (!ignore && refreshedData) {
              setData(refreshedData)
            }
          }
        )
        .subscribe((status) => {
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
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchData, fetchPembayaranList])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('rincian_pembayaran')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      await refreshData()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('rincian_pembayaran')
          .update({
            id_pembayaran: formData.id_pembayaran,
            nomor_transaksi: formData.nomor_transaksi,
            jumlah_dibayar: formData.jumlah_dibayar,
            tanggal_bayar: formData.tanggal_bayar,
            metode_pembayaran: formData.metode_pembayaran,
            referensi_pembayaran: formData.referensi_pembayaran || null,
            catatan: formData.catatan || null,
            status: formData.status,
            alasan_reject: formData.alasan_reject || null,
            cicilan_ke: formData.cicilan_ke || null,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('rincian_pembayaran')
          .insert({
            id_pembayaran: formData.id_pembayaran,
            nomor_transaksi: formData.nomor_transaksi,
            jumlah_dibayar: formData.jumlah_dibayar,
            tanggal_bayar: formData.tanggal_bayar,
            metode_pembayaran: formData.metode_pembayaran,
            referensi_pembayaran: formData.referensi_pembayaran || null,
            catatan: formData.catatan || null,
            status: formData.status || 'pending',
            cicilan_ke: formData.cicilan_ke || null,
          })

        if (insertError) throw insertError
      }

      await refreshData()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const verifyItem = async (id, verified, rejectReason = null) => {
    try {
      const updateData = {
        status: verified ? 'verified' : 'rejected',
        tanggal_verifikasi: new Date().toISOString(),
        diperbarui_pada: new Date().toISOString(),
      }

      if (!verified && rejectReason) {
        updateData.alasan_reject = rejectReason
      }

      const { error: updateError } = await supabase
        .from('rincian_pembayaran')
        .update(updateData)
        .eq('id', id)

      if (updateError) throw updateError
      await refreshData()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    verifyItem,
    refreshData,
    pembayaranList,
  }
}
