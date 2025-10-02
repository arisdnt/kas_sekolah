import { Text, Badge } from '@radix-ui/themes'
import { UserCheck, Clock, Mail, Phone } from 'lucide-react'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return (
      <div className="relative flex h-full flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="flex-1 space-y-6 p-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-200" />
            <div className="h-8 w-56 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-20 bg-slate-200" />
            <div className="h-4 w-48 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-24 bg-slate-200" />
            <div className="h-4 w-40 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-32 bg-slate-200" />
            <div className="h-4 w-48 bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-28 bg-slate-200" />
            <div className="h-4 w-48 bg-slate-200" />
          </div>
        </div>
        <div className="border-t border-slate-200/80 bg-white/80 px-6 py-4">
          <div className="h-3 w-56 bg-slate-200" />
        </div>
      </div>
    )
  }

  if (!selectedItem) {
    return (
      <div className="flex h-full flex-col items-center justify-center border border-slate-200/80 bg-white/80 backdrop-blur p-6">
        <div className="text-center text-slate-400">
          <UserCheck className="mx-auto mb-4 h-16 w-16 text-slate-300" />
          <Text size="3" className="mb-2 text-slate-500">
            Tidak ada data dipilih
          </Text>
          <Text size="2" className="text-slate-400">
            Pilih baris pada tabel untuk melihat detail
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex h-full flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
      ) : null}
      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Nama & Status */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Nama Wali Kelas
            </Text>
            <div className="flex items-center justify-between gap-3">
              <Text size="5" weight="bold" className="text-slate-900">
                {selectedItem.nama_lengkap}
              </Text>
              <Badge
                variant="soft"
                color={selectedItem.status_aktif ? 'green' : 'gray'}
                size="2"
              >
                {selectedItem.status_aktif ? 'Aktif' : 'Nonaktif'}
              </Badge>
            </div>
          </div>

          {/* ID */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              ID
            </Text>
            <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-3 py-2 border border-slate-200">
              {selectedItem.id}
            </Text>
          </div>

          {/* NIP */}
          {selectedItem.nip && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                NIP
              </Text>
              <Text size="3" weight="medium" className="text-slate-900 font-mono">
                {selectedItem.nip}
              </Text>
              <Text size="1" className="text-slate-500 mt-1">
                Nomor Induk Pegawai
              </Text>
            </div>
          )}

          {/* Kontak Information */}
          <div className="border-t border-slate-200 pt-6">
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-3 block">
              Informasi Kontak
            </Text>
            
            <div className="space-y-4">
              {/* Nomor Telepon */}
              {selectedItem.nomor_telepon ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <Text size="1" className="text-slate-500 uppercase tracking-wider">
                      Nomor Telepon
                    </Text>
                  </div>
                  <Text size="3" weight="medium" className="text-slate-900 font-mono ml-6">
                    {selectedItem.nomor_telepon}
                  </Text>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-4 w-4 text-slate-300" />
                    <Text size="1" className="text-slate-400 uppercase tracking-wider">
                      Nomor Telepon
                    </Text>
                  </div>
                  <Text size="2" className="text-slate-400 ml-6">
                    Tidak tersedia
                  </Text>
                </div>
              )}

              {/* Email */}
              {selectedItem.email ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <Text size="1" className="text-slate-500 uppercase tracking-wider">
                      Email
                    </Text>
                  </div>
                  <Text size="3" weight="medium" className="text-slate-900 ml-6">
                    {selectedItem.email}
                  </Text>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-4 w-4 text-slate-300" />
                    <Text size="1" className="text-slate-400 uppercase tracking-wider">
                      Email
                    </Text>
                  </div>
                  <Text size="2" className="text-slate-400 ml-6">
                    Tidak tersedia
                  </Text>
                </div>
              )}
            </div>
          </div>

          {/* Informasi Status */}
          <div className="border-t border-slate-200 pt-6">
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-3 block">
              Status Keaktifan
            </Text>
            
            <div className="bg-slate-50 border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <Text size="2" className="text-slate-700">
                  Status Saat Ini:
                </Text>
                <Badge
                  variant="soft"
                  color={selectedItem.status_aktif ? 'green' : 'gray'}
                  size="2"
                >
                  {selectedItem.status_aktif ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
              <Text size="1" className="text-slate-500 mt-2">
                {selectedItem.status_aktif 
                  ? 'Wali kelas ini dapat ditugaskan ke kelas'
                  : 'Wali kelas ini tidak dapat ditugaskan'}
              </Text>
            </div>
          </div>

          {/* Dibuat */}
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Dibuat Pada
            </Text>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <Text size="2">
                {formatDateTime(selectedItem.dibuat_pada)}
              </Text>
            </div>
          </div>

          {/* Diperbarui */}
          {selectedItem.diperbarui_pada && (
            <div>
              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
                Terakhir Diperbarui
              </Text>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="h-4 w-4 text-slate-400" />
                <Text size="2">
                  {formatDateTime(selectedItem.diperbarui_pada)}
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
