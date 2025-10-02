import { Button } from '@radix-ui/themes'
import { ArrowLeft } from 'lucide-react'

export function EditJenisPembayaranHeader({ onBack }) {
  return (
    <div className="mb-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali
      </Button>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-2">
        Edit Jenis Pembayaran
      </h1>
      <p className="text-slate-600">
        Perbarui informasi jenis pembayaran
      </p>
    </div>
  )
}
