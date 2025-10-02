import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'

export function useCreateJenisPembayaran() {
  const navigate = useNavigate()
  
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
    apply_all_kelas: false,
    status_aktif: true,
  })

  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const tingkatList = Array.from(new Set(kelasList.map(k => k.tingkat))).sort()

  useEffect(() => {
    const loadRefs = async () => {
      const [{ data: tahun }, { data: kelas }] = await Promise.all([
        supabase.from('tahun_ajaran').select('id, nama').order('nama', { ascending: false }),
        supabase.from('kelas').select('id, tingkat, nama_sub_kelas').order('tingkat')
      ])
      setTahunAjaranList(tahun || [])
      setKelasList(kelas || [])
    }
    loadRefs()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const validKelas = formData.apply_all_kelas ? !!formData.tingkat_for_kelas : !!formData.id_kelas
    if (!formData.kode || !formData.nama || !formData.tipe_pembayaran || !formData.id_tahun_ajaran || !validKelas) {
      setError('Kode, Nama, Tipe Pembayaran, Tahun Ajaran, dan Kelas/Tingkat wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      if (formData.apply_all_kelas) {
        const kelasForTingkat = kelasList.filter(k => k.tingkat === formData.tingkat_for_kelas)
        const insertData = kelasForTingkat.map(k => ({
          kode: formData.kode,
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          jumlah_default: formData.jumlah_default ? parseFloat(formData.jumlah_default) : null,
          tipe_pembayaran: formData.tipe_pembayaran,
          wajib: formData.wajib,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          id_kelas: k.id,
          status_aktif: formData.status_aktif,
        }))
        const { error: insertError } = await supabase
          .from('jenis_pembayaran')
          .insert(insertData)
        if (insertError) throw insertError
      } else {
        const { error: insertError } = await supabase
          .from('jenis_pembayaran')
          .insert([{
            kode: formData.kode,
            nama: formData.nama,
            deskripsi: formData.deskripsi || null,
            jumlah_default: formData.jumlah_default ? parseFloat(formData.jumlah_default) : null,
            tipe_pembayaran: formData.tipe_pembayaran,
            wajib: formData.wajib,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            id_kelas: formData.id_kelas,
            status_aktif: formData.status_aktif,
          }])
        if (insertError) throw insertError
      }

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
    handleSubmit,
    handleCancel,
  }
}
