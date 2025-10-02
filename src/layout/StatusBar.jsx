import { useSidebar } from '../contexts/SidebarContext'
import { useClock } from '../hooks/useClock'
import { useSystemInfo } from '../hooks/useSystemInfo'
import { SystemInfoSection } from './SystemInfoSection'
import { AppStatusSection } from './AppStatusSection'
import { DateTimeSection } from './DateTimeSection'

export function StatusBar() {
  const { isCollapsed } = useSidebar()
  const currentTime = useClock()
  const systemInfo = useSystemInfo()

  return (
    <div
      className="fixed bottom-0 bg-gray-100 border-t border-gray-300 text-gray-900 text-xs transition-all duration-300 z-20"
      style={{
        left: isCollapsed ? '64px' : '256px',
        width: isCollapsed ? 'calc(100vw - 64px)' : 'calc(100vw - 256px)',
        height: '24px'
      }}
    >
      <div className="flex items-center justify-between h-full px-3">
        <SystemInfoSection systemInfo={systemInfo} />
        <AppStatusSection />
        <DateTimeSection currentTime={currentTime} battery={systemInfo.battery} />
      </div>
    </div>
  )
}