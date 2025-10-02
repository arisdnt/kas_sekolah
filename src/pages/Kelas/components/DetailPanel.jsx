import { DetailPanelSkeleton } from './DetailPanelSkeleton'
import { DetailPanelEmpty } from './DetailPanelEmpty'
import { DetailPanelHeader } from './DetailPanelHeader'
import { DetailPanelInfoSection } from './DetailPanelInfoSection'
import { DetailPanelCapacity } from './DetailPanelCapacity'
import { DetailPanelMetadata } from './DetailPanelMetadata'
import { DetailPanelFooter } from './DetailPanelFooter'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'
  const schoolAddress = import.meta.env.VITE_SCHOOL_ADDRESS || ''
  const footerInfo = import.meta.env.VITE_SCHOOL_FOOTER || ''

  if (isLoading) {
    return <DetailPanelSkeleton />
  }

  if (!selectedItem) {
    return <DetailPanelEmpty />
  }

  return (
    <div className="relative h-full flex flex-col bg-white/80 backdrop-blur shadow-sm">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
      ) : null}

      <DetailPanelHeader
        selectedItem={selectedItem}
        schoolName={schoolName}
        schoolAddress={schoolAddress}
      />

      <div className="flex-1 min-h-0 overflow-auto px-4 py-4">
        <div className="divide-y divide-slate-200/60">
          <DetailPanelInfoSection selectedItem={selectedItem} />
          <DetailPanelCapacity selectedItem={selectedItem} />
          <DetailPanelMetadata selectedItem={selectedItem} />
        </div>
      </div>

      <DetailPanelFooter selectedItem={selectedItem} footerInfo={footerInfo} />
    </div>
  )
}
