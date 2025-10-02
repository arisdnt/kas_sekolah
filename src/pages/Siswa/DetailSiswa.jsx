import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Button, Badge } from '@radix-ui/themes'
import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import { useDetailSiswa } from './hooks/useDetailSiswa'
import { InfoSiswaSection } from './components/detail/InfoSiswaSection'
import { RiwayatKelasSection } from './components/detail/RiwayatKelasSection'
import { PeminatanSection } from './components/detail/PeminatanSection'
import { TagihanPembayaranSection } from './components/detail/TagihanPembayaranSection'

export function DetailSiswa() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { siswa, riwayatKelas, peminatan, tagihanData, loading, error } = useDetailSiswa(id)

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <Text size="3" className="text-slate-600">
              Memuat data siswa...
            </Text>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <Text size="4" weight="bold" className="text-slate-800 mb-2 block">
              Terjadi Kesalahan
            </Text>
            <Text size="2" className="text-slate-600 mb-4 block">
              {error}
            </Text>
            <Button onClick={() => navigate('/siswa')} style={{ borderRadius: 0 }}>
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Siswa
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!siswa) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <Text size="4" weight="bold" className="text-slate-800 mb-2 block">
              Siswa Tidak Ditemukan
            </Text>
            <Text size="2" className="text-slate-600 mb-4 block">
              Data siswa yang Anda cari tidak ditemukan dalam sistem.
            </Text>
            <Button onClick={() => navigate('/siswa')} style={{ borderRadius: 0 }}>
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Siswa
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/siswa')}
                variant="soft"
                color="gray"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali
              </Button>
              <div>
                <Text size="5" weight="bold" className="text-slate-800 block">
                  Detail Siswa
                </Text>
                <Text size="2" className="text-slate-600">
                  Informasi lengkap dan riwayat siswa
                </Text>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {siswa.status_aktif ? (
                <Badge color="green" size="2" style={{ borderRadius: 0 }}>
                  Aktif
                </Badge>
              ) : (
                <Badge color="gray" size="2" style={{ borderRadius: 0 }}>
                  Tidak Aktif
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto excel-scrollbar bg-slate-50">
          <div className="p-6 space-y-4">
            {/* Informasi Siswa */}
            <InfoSiswaSection siswa={siswa} />

            {/* Riwayat Kelas */}
            <RiwayatKelasSection riwayatKelas={riwayatKelas} />

            {/* Peminatan */}
            {peminatan.length > 0 && (
              <PeminatanSection peminatan={peminatan} />
            )}

            {/* Tagihan dan Pembayaran */}
            <TagihanPembayaranSection tagihanData={tagihanData} />
          </div>
        </div>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 16px;
          height: 16px;
        }
        
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </PageLayout>
  )
}
