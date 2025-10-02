import { Text } from '@radix-ui/themes'
import { User, Hash, Calendar, MapPin, Phone, IdCard } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function InfoSiswaSection({ siswa }) {
  return (
    <div className="bg-white border-l-4 border-blue-600 shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-blue-600" />
          <Text size="4" weight="bold" className="text-slate-800 uppercase tracking-wide">
            Informasi Siswa
          </Text>
        </div>

        <div className="grid grid-cols-4 gap-x-6 gap-y-4">
          <div className="col-span-2">
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Nama Lengkap</Text>
            <Text size="3" weight="bold" className="text-slate-900">{siswa.nama_lengkap}</Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">NISN</Text>
            <Text size="2" className="text-slate-900 font-mono">{siswa.nisn || '-'}</Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Jenis Kelamin</Text>
            <Text size="2" className="text-slate-900">
              {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : siswa.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
            </Text>
          </div>

          <div className="col-span-2">
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Alamat</Text>
            <Text size="2" className="text-slate-900">{siswa.alamat || '-'}</Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Tanggal Lahir</Text>
            <Text size="2" className="text-slate-900">{formatDate(siswa.tanggal_lahir)}</Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">No. WA Wali</Text>
            <Text size="2" className="text-slate-900 font-mono">{siswa.nomor_whatsapp_wali || '-'}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}
