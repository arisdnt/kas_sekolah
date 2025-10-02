import { TahunAjaranDetailSkeleton } from './TahunAjaranDetailSkeleton'
import { TahunAjaranDetailEmpty } from './TahunAjaranDetailEmpty'
import { TahunAjaranDetailHeader } from './TahunAjaranDetailHeader'
import { TahunAjaranDetailBody } from './TahunAjaranDetailBody'
import { TahunAjaranDetailFooter } from './TahunAjaranDetailFooter'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return <TahunAjaranDetailSkeleton />
  }

  if (!selectedItem) {
    return <TahunAjaranDetailEmpty />
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden border border-slate-300 bg-white shadow-sm print:border-gray-400 print:shadow-none">
      {isRefreshing && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
      )}
      <div className="flex-1 overflow-auto px-6 py-5">
        <TahunAjaranDetailHeader tahunAjaran={selectedItem} />
        <TahunAjaranDetailBody tahunAjaran={selectedItem} />
      </div>
      <TahunAjaranDetailFooter />
    </div>
  )
}
