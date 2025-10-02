import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export function useJenisPembayaran() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('jenis_pembayaran')
      .select(`
        id, kode, nama, deskripsi, jumlah_default, tipe_pembayaran, wajib,
        status_aktif, dibuat_pada, diperbarui_pada, id_tahun_ajaran, id_kelas,
        tahun_ajaran:id_tahun_ajaran(id, nama),
        kelas:id_kelas(id, tingkat, nama_sub_kelas)
      `)
      .order('kode')

    if (queryError) {
      setError('Gagal memuat data: ' + queryError.message)
      return []
    }
    
    return result ?? []
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

      const result = await fetchData()
      
      if (!ignore) {
        setData(result)
        setLoading(false)
      }

      channel = supabase
        .channel('realtime-jenis-pembayaran')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'jenis_pembayaran',
          },
          async () => {
            const { data: refreshedData } = await supabase
              .from('jenis_pembayaran')
              .select(`
                id, kode, nama, deskripsi, jumlah_default, tipe_pembayaran, wajib,
                status_aktif, dibuat_pada, diperbarui_pada, id_tahun_ajaran, id_kelas,
                tahun_ajaran:id_tahun_ajaran(id, nama),
                kelas:id_kelas(id, tingkat, nama_sub_kelas)
              `)
              .order('kode')

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
  }, [fetchData])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('jenis_pembayaran')
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
        if (formData.apply_all_kelas) {
          throw new Error('Edit dengan lingkup "Semua kelas di tingkat" belum didukung. Silakan buat baru menggunakan opsi tersebut.')
        }
        const { error: updateError } = await supabase
          .from('jenis_pembayaran')
          .update({
            kode: formData.kode,
            nama: formData.nama,
            deskripsi: formData.deskripsi || null,
            jumlah_default: formData.jumlah_default || null,
            tipe_pembayaran: formData.tipe_pembayaran,
            wajib: formData.wajib,
            status_aktif: formData.status_aktif,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            id_kelas: formData.id_kelas,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        if (formData.apply_all_kelas) {
          if (!formData.tingkat_for_kelas) throw new Error('Pilih tingkat untuk opsi Semua Kelas.')
          const { data: kelasByTingkat, error: kelasErr } = await supabase
            .from('kelas')
            .select('id')
            .eq('tingkat', formData.tingkat_for_kelas)
          if (kelasErr) throw kelasErr
          const rows = (kelasByTingkat || []).map(k => ({
            kode: formData.kode,
            nama: formData.nama,
            deskripsi: formData.deskripsi || null,
            jumlah_default: formData.jumlah_default || null,
            tipe_pembayaran: formData.tipe_pembayaran,
            wajib: formData.wajib,
            status_aktif: formData.status_aktif,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            id_kelas: k.id,
          }))
          if (rows.length === 0) throw new Error('Tidak ada kelas pada tingkat terpilih.')
          const { error: bulkErr } = await supabase.from('jenis_pembayaran').insert(rows)
          if (bulkErr) throw bulkErr
        } else {
          const { error: insertError } = await supabase
            .from('jenis_pembayaran')
            .insert({
              kode: formData.kode,
              nama: formData.nama,
              deskripsi: formData.deskripsi || null,
              jumlah_default: formData.jumlah_default || null,
              tipe_pembayaran: formData.tipe_pembayaran,
              wajib: formData.wajib,
              status_aktif: formData.status_aktif,
              id_tahun_ajaran: formData.id_tahun_ajaran,
              id_kelas: formData.id_kelas,
            })
          if (insertError) throw insertError
        }
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
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    refreshData,
  }
}
