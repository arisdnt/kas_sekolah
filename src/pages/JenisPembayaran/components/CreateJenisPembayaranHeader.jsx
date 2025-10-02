import { Button } from '@radix-ui/themes'
import { ArrowLeft } from 'lucide-react'

export function CreateJenisPembayaranHeader({ onBack }) {
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
        Tambah Jenis Pembayaran
      </h1>
      <p className="text-slate-600">
        Tambahkan jenis pembayaran baru ke sistem
      </p>
    </div>
  )
}
