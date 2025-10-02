import { Text, Badge } from '@radix-ui/themes'
import { Clock, Calendar } from 'lucide-react'
import { formatDateTime, formatDate, hitungUsia } from '../utils/dateHelpers'

export function SiswaDetailInfo({ siswa }) {
  const usia = hitungUsia(siswa.tanggal_lahir)

  return (
    <div className="space-y-6">
      <div>
        <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
          Nama Siswa
        </Text>
        <div className="flex items-center justify-between gap-3">
          <Text size="5" weight="bold" className="text-slate-900">
            {siswa.nama_lengkap}
          </Text>
          <Badge
            variant="soft"
            color={siswa.status_aktif ? 'green' : 'gray'}
            size="2"
          >
            {siswa.status_aktif ? 'Aktif' : 'Nonaktif'}
          </Badge>
        </div>
      </div>

      <div>
        <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
          ID
        </Text>
        <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-3 py-2 border border-slate-200">
          {siswa.id}
        </Text>
      </div>

      {siswa.nisn && (
        <div>
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            NISN
          </Text>
          <Text size="3" weight="medium" className="text-slate-900 font-mono">
            {siswa.nisn}
          </Text>
        </div>
      )}

      {siswa.tanggal_lahir && (
        <div>
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            Tanggal Lahir
          </Text>
          <div className="flex items-center gap-2 text-slate-700">
            <Calendar className="h-4 w-4 text-slate-400" />
            <Text size="3" weight="medium">
              {formatDate(siswa.tanggal_lahir)}
            </Text>
          </div>
          {usia !== null && (
            <Text size="1" className="text-slate-500 mt-1">
              Usia: {usia} tahun
            </Text>
          )}
        </div>
      )}

      {siswa.jenis_kelamin && (
        <div>
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            Jenis Kelamin
          </Text>
          <Badge variant="soft" color="blue" size="2">
            {siswa.jenis_kelamin}
          </Badge>
        </div>
      )}

      {siswa.alamat && (
        <div>
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            Alamat
          </Text>
          <Text size="2" className="text-slate-700 leading-relaxed">
            {siswa.alamat}
          </Text>
        </div>
      )}

      {siswa.nomor_whatsapp_wali && (
        <div>
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            Nomor WhatsApp Wali
          </Text>
          <Text size="3" weight="medium" className="text-slate-900 font-mono">
            {siswa.nomor_whatsapp_wali}
          </Text>
          <Text size="1" className="text-slate-500 mt-1">
            Untuk notifikasi tagihan
          </Text>
        </div>
      )}

      <div>
        <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
          Token Akses
        </Text>
        <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-3 py-2 border border-slate-200 break-all">
          {siswa.token_akses_unik}
        </Text>
        <Text size="1" className="text-slate-500 mt-1">
          Token unik untuk akses data tagihan
        </Text>
      </div>

      <div>
        <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
          Dibuat Pada
        </Text>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <Text size="2">
            {formatDateTime(siswa.dibuat_pada)}
          </Text>
        </div>
      </div>

      {siswa.diperbarui_pada && (
        <div>
          <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
            Terakhir Diperbarui
          </Text>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="h-4 w-4 text-slate-400" />
            <Text size="2">
              {formatDateTime(siswa.diperbarui_pada)}
            </Text>
          </div>
        </div>
      )}
    </div>
  )
}
