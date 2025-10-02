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
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Informasi Siswa
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Nama Lengkap */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-indigo-500" />
              <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Nama Lengkap
              </Text>
            </div>
            <Text size="4" weight="bold" className="text-slate-900">
              {siswa.nama_lengkap}
            </Text>
          </div>

          {/* NISN */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Hash className="h-4 w-4 text-blue-500" />
              <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
                NISN
              </Text>
            </div>
            <Text size="3" className="text-slate-900 font-mono">
              {siswa.nisn || '-'}
            </Text>
          </div>

          {/* Tanggal Lahir */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-green-500" />
              <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Tanggal Lahir
              </Text>
            </div>
            <Text size="3" className="text-slate-900">
              {formatDate(siswa.tanggal_lahir)}
            </Text>
          </div>

          {/* Jenis Kelamin */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IdCard className="h-4 w-4 text-purple-500" />
              <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Jenis Kelamin
              </Text>
            </div>
            <Text size="3" className="text-slate-900">
              {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : siswa.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
            </Text>
          </div>

          {/* Alamat */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Alamat
              </Text>
            </div>
            <Text size="3" className="text-slate-900">
              {siswa.alamat || '-'}
            </Text>
          </div>

          {/* Nomor WhatsApp Wali */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-orange-500" />
              <Text size="2" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Nomor WhatsApp Wali
              </Text>
            </div>
            <Text size="3" className="text-slate-900 font-mono">
              {siswa.nomor_whatsapp_wali || '-'}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
