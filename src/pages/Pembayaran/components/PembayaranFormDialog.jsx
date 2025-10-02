import { useState } from 'react'
import { Dialog, Text, Button, Select, TextArea, TextField } from '@radix-ui/themes'
import { AlertCircle, Wallet, Edit3, Hash, FileText, Receipt, X } from 'lucide-react'

export function PembayaranFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_tagihan: '',
      nomor_pembayaran: '',
      catatan: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_tagihan || !formData.nomor_pembayaran) {
      setError('Tagihan dan Nomor Pembayaran wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '1100px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? <Edit3 className="h-5 w-5 text-white" /> : <Wallet className="h-5 w-5 text-white" />}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi pembayaran' : 'Tambahkan pembayaran baru'}
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {error && (
              <div className="mb-4 flex items-start gap-3 bg-red-50 border-2 border-red-300 p-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <Text size="2" weight="medium" className="text-red-900">Kesalahan</Text>
                  <Text size="2" className="text-red-700">{error}</Text>
                </div>
              </div>
            )}

            {/* Row 1: Nomor Pembayaran */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  <Text size="2" weight="medium">Nomor Pembayaran <span className="text-red-600">*</span></Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: PAY-2024-001"
                  value={formData.nomor_pembayaran}
                  onChange={(e) => setFormData({ ...formData, nomor_pembayaran: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">Nomor unik untuk identifikasi pembayaran</Text>
              </label>
            </div>

            {/* Row 2: Tagihan ID */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Receipt className="h-3.5 w-3.5 text-purple-500" />
                  <Text size="2" weight="medium">ID Tagihan <span className="text-red-600">*</span></Text>
                </div>
                <TextField.Root
                  placeholder="ID Tagihan yang akan dibayar"
                  value={formData.id_tagihan}
                  onChange={(e) => setFormData({ ...formData, id_tagihan: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">Masukkan ID tagihan yang ingin dibayar</Text>
              </label>
            </div>

            {/* Row 3: Catatan */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <Text size="2" weight="medium">Catatan</Text>
                </div>
                <TextArea
                  placeholder="Catatan pembayaran (opsional)"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  style={{ borderRadius: 0, minHeight: '80px' }}
                />
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <Button
            type="button"
            variant="soft"
            color="gray"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300"
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              borderRadius: 0,
              backgroundColor: isEdit ? '#d97706' : '#16a34a',
              border: isEdit ? '1px solid #b45309' : '1px solid #15803d'
            }}
            className="cursor-pointer text-white"
          >
            {isEdit ? <Edit3 className="h-3.5 w-3.5" /> : <Wallet className="h-3.5 w-3.5" />}
            {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
