import { Dialog, Text } from '@radix-ui/themes'
import { X, Wallet, Hash, Receipt, FileText, Clock, User } from 'lucide-react'
import { formatCurrency } from '../utils/currencyHelpers'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function PembayaranDetailModal({ open, onOpenChange, pembayaran }) {
  if (!pembayaran) return null

  const iconColors = {
    Hash: 'text-blue-500',
    Receipt: 'text-purple-500',
    User: 'text-indigo-500',
    FileText: 'text-slate-500',
    Clock: 'text-slate-500',
  }

  const FieldItem = ({ label, icon: Icon, children, fullWidth = false }) => {
    const iconColor = Icon ? iconColors[Icon.name] || 'text-slate-400' : ''
    
    return (
      <div className={`${fullWidth ? 'col-span-2' : ''}`}>
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 mb-2">
            {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
            <Text size="1" weight="medium" className="text-slate-500 uppercase tracking-wider text-[0.65rem]">
              {label}
            </Text>
          </div>
          <div className="ml-5">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '90vw',
          width: '1200px',
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
            <div className="flex h-10 w-10 items-center justify-center bg-green-600 border border-green-700 shadow-sm">
              <Wallet className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Pembayaran
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi lengkap pembayaran
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          <div className="p-6 space-y-5">
            {/* Nomor Pembayaran - Full Width Header */}
            <div className="bg-slate-50 border-2 border-slate-300 p-4 shadow-sm">
              <Text size="1" className="text-slate-500 uppercase tracking-wider font-medium mb-1 block">
                Nomor Pembayaran
              </Text>
              <Text size="6" weight="bold" className="text-slate-900 font-mono">
                {pembayaran.nomor_pembayaran}
              </Text>
            </div>

            {/* Detail Information - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FieldItem label="ID Pembayaran" icon={Hash}>
                <Text size="2" className="font-mono text-slate-700 font-medium">
                  {pembayaran.id}
                </Text>
              </FieldItem>

              <FieldItem label="Nomor Tagihan" icon={Receipt}>
                <Text size="2" className="font-mono text-slate-700 font-medium">
                  {pembayaran.tagihan?.nomor_tagihan || '—'}
                </Text>
              </FieldItem>

              {pembayaran.tagihan?.judul && (
                <FieldItem label="Judul Tagihan" icon={Receipt} fullWidth>
                  <Text size="2" className="text-slate-700">
                    {pembayaran.tagihan.judul}
                  </Text>
                </FieldItem>
              )}

              {pembayaran.tagihan?.riwayat_kelas_siswa?.siswa && (
                <>
                  <FieldItem label="Nama Siswa" icon={User}>
                    <Text size="2" className="text-slate-700">
                      {pembayaran.tagihan.riwayat_kelas_siswa.siswa.nama_lengkap}
                    </Text>
                  </FieldItem>

                  {pembayaran.tagihan.riwayat_kelas_siswa.siswa.nisn && (
                    <FieldItem label="NISN" icon={Hash}>
                      <Text size="2" className="font-mono text-slate-700">
                        {pembayaran.tagihan.riwayat_kelas_siswa.siswa.nisn}
                      </Text>
                    </FieldItem>
                  )}
                </>
              )}
            </div>

            {/* Catatan - Full Width */}
            {pembayaran.catatan && (
              <div className="border-t-2 border-slate-200 pt-4">
                <FieldItem label="Catatan" icon={FileText} fullWidth>
                  <Text size="2" className="text-slate-700 leading-relaxed">
                    {pembayaran.catatan}
                  </Text>
                </FieldItem>
              </div>
            )}

            {/* Metadata Section - 2 Column Grid */}
            <div className="border-t-2 border-slate-200 pt-5 mt-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FieldItem label="Dibuat Pada" icon={Clock}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <Text size="1" className="text-slate-600 font-mono">
                      {formatDateTime(pembayaran.tanggal_dibuat)}
                    </Text>
                  </div>
                </FieldItem>

                {pembayaran.diperbarui_pada && (
                  <FieldItem label="Diperbarui Pada" icon={Clock}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <Text size="1" className="text-slate-600 font-mono">
                        {formatDateTime(pembayaran.diperbarui_pada)}
                      </Text>
                    </div>
                  </FieldItem>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4 flex items-center justify-between">
          <Text size="1" className="text-slate-500">
            Data pembayaran • Sistem Kas Sekolah
          </Text>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm border border-blue-700 flex items-center gap-2"
          >
            <X className="h-3.5 w-3.5" />
            Tutup
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
