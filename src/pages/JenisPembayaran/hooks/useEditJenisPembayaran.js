import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'

export function useEditJenisPembayaran() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [formData, setFormData] = useState({
    kode: '',
    nama: '',
    deskripsi: '',
    jumlah_default: '',
    tipe_pembayaran: 'bulanan',
    wajib: true,
    id_tahun_ajaran: '',
    id_kelas: '',
    tingkat_for_kelas: '',
    status_aktif: true,
  })

  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const tingkatList = Array.from(new Set(kelasList.map(k => k.tingkat))).sort()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { data: tahun }, 
          { data: kelas },
          { data: jenisPembayaran, error: fetchError }
        ] = await Promise.all([
          supabase.from('tahun_ajaran').select('id, nama').order('nama', { ascending: false }),
          supabase.from('kelas').select('id, tingkat, nama_sub_kelas').order('tingkat'),
          supabase.from('jenis_pembayaran').select('*').eq('id', id).single()
        ])

        if (fetchError) throw fetchError

        setTahunAjaranList(tahun || [])
        setKelasList(kelas || [])

        if (jenisPembayaran) {
          const kelasData = kelas?.find(k => k.id === jenisPembayaran.id_kelas)
          setFormData({
            kode: jenisPembayaran.kode || '',
            nama: jenisPembayaran.nama || '',
            deskripsi: jenisPembayaran.deskripsi || '',
            jumlah_default: jenisPembayaran.jumlah_default || '',
            tipe_pembayaran: jenisPembayaran.tipe_pembayaran || 'bulanan',
            wajib: jenisPembayaran.wajib ?? true,
            id_tahun_ajaran: jenisPembayaran.id_tahun_ajaran || '',
            id_kelas: jenisPembayaran.id_kelas || '',
            tingkat_for_kelas: kelasData?.tingkat || '',
            status_aktif: jenisPembayaran.status_aktif ?? true,
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.kode || !formData.nama || !formData.tipe_pembayaran || !formData.id_tahun_ajaran || !formData.id_kelas) {
      setError('Kode, Nama, Tipe Pembayaran, Tahun Ajaran, dan Kelas wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('jenis_pembayaran')
        .update({
          kode: formData.kode,
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          jumlah_default: formData.jumlah_default ? parseFloat(formData.jumlah_default) : null,
          tipe_pembayaran: formData.tipe_pembayaran,
          wajib: formData.wajib,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          id_kelas: formData.id_kelas,
          status_aktif: formData.status_aktif,
        })
        .eq('id', id)

      if (updateError) throw updateError

      navigate('/jenis-pembayaran')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/jenis-pembayaran')
  }

  return {
    formData,
    setFormData,
    tahunAjaranList,
    kelasList,
    tingkatList,
    error,
    submitting,
    loading,
    handleSubmit,
    handleCancel,
  }
}
