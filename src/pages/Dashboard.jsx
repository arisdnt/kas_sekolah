import { useState, useEffect } from 'react'
import { Text } from '@radix-ui/themes'
import { Users, Receipt, Wallet, AlertCircle, RefreshCw } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useDashboardData } from '../hooks/useDashboardData'
import { DashboardFilters } from '../components/dashboard/DashboardFilters'
import { StatCard } from '../components/dashboard/StatCard'
import { PembayaranChart } from '../components/dashboard/PembayaranChart'
import { StatusPieChart } from '../components/dashboard/StatusPieChart'
import { TagihanTable } from '../components/dashboard/TagihanTable'
import { PembayaranPendingTable } from '../components/dashboard/PembayaranPendingTable'
import { PageLayout } from '../layout/PageLayout'

function DashboardContent() {
  const [filters, setFilters] = useState({
    tahunAjaran: '',
    tingkat: '',
    kelas: '',
    timeRange: 'all'
  })
  
  const [masterData, setMasterData] = useState({
    tahunAjaranList: [],
    kelasList: [],
    tingkatList: []
  })

  const { data, loading, error, refresh } = useDashboardData(filters)

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      const [tahunResult, kelasResult] = await Promise.all([
        supabase.from('tahun_ajaran').select('*').order('tanggal_mulai', { ascending: false }),
        supabase.from('kelas').select('*').order('tingkat')
      ])

      const uniqueTingkat = [...new Set(kelasResult.data?.map(k => k.tingkat) || [])].sort()

      setMasterData({
        tahunAjaranList: tahunResult.data || [],
        kelasList: kelasResult.data || [],
        tingkatList: uniqueTingkat
      })
    } catch (err) {
      console.error('Error fetching master data:', err)
    }
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 bg-white px-6 py-4 border-b-2 border-slate-300 space-y-3">
          <div className="flex items-center justify-between">
            <Text size="4" weight="bold" className="text-slate-900">
              Dashboard Kas Sekolah
            </Text>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
              type="button"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              <Text size="2" weight="medium" className="text-slate-700">
                Refresh
              </Text>
            </button>
          </div>
          <DashboardFilters
            tahunAjaranList={masterData.tahunAjaranList}
            kelasList={masterData.kelasList}
            tingkatList={masterData.tingkatList}
            selectedTahunAjaran={filters.tahunAjaran}
            onTahunAjaranChange={(val) => setFilters({ ...filters, tahunAjaran: val, tingkat: '', kelas: '' })}
            selectedTingkat={filters.tingkat}
            onTingkatChange={(val) => setFilters({ ...filters, tingkat: val, kelas: '' })}
            selectedKelas={filters.kelas}
            onKelasChange={(val) => setFilters({ ...filters, kelas: val })}
            selectedTimeRange={filters.timeRange}
            onTimeRangeChange={(val) => setFilters({ ...filters, timeRange: val })}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border-2 border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">Error</Text>
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="grid grid-cols-4 gap-4 h-full">
            {/* Stats - Row 1 */}
            <StatCard title="Total Siswa" value={data.stats.totalSiswa} icon={Users} color="text-blue-600" loading={loading} />
            <StatCard title="Total Tagihan" value={data.stats.totalTagihan} icon={Receipt} color="text-purple-600" loading={loading} />
            <StatCard title="Total Pembayaran" value={data.stats.totalPembayaran} icon={Wallet} color="text-green-600" loading={loading} />
            <StatCard title="Tunggakan" value={data.stats.totalTunggakan} icon={AlertCircle} color="text-red-600" isCurrency loading={loading} />

            {/* Charts - Row 2 */}
            <div className="col-span-2">
              <PembayaranChart data={data.chartData.pembayaranPerBulan} loading={loading} />
            </div>
            <StatusPieChart data={data.chartData.statusPembayaran} loading={loading} />
            <div className="col-span-1">
              <PembayaranPendingTable data={data.recentData.pembayaranPending} loading={loading} />
            </div>

            {/* Tables - Row 3 */}
            <div className="col-span-4">
              <TagihanTable data={data.recentData.tagihanTerbaru} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function Dashboard() {
  return <DashboardContent />
}
