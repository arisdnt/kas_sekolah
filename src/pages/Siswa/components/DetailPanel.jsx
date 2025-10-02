import { SiswaDetailSkeleton } from './SiswaDetailSkeleton'
import { SiswaDetailEmpty } from './SiswaDetailEmpty'
import { SiswaDetailInfo } from './SiswaDetailInfo'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return <SiswaDetailSkeleton />
  }

  if (!selectedItem) {
    return <SiswaDetailEmpty />
  }

  return (
    <div className="relative flex h-full flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
      {isRefreshing && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
      )}
      <div className="flex-1 overflow-auto p-6">
        <SiswaDetailInfo siswa={selectedItem} />
      </div>
    </div>
  )
}
