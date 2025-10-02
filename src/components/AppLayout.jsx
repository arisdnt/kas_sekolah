import { memo } from 'react'
import { Navbar } from '../layout/Navbar'
import { Sidebar } from '../layout/Sidebar'
import { StatusBar } from '../layout/StatusBar'
import { useSidebar } from '../contexts/SidebarContext'

const MemoizedNavbar = memo(Navbar)
const MemoizedSidebar = memo(Sidebar)
const MemoizedStatusBar = memo(StatusBar)

export const AppLayout = memo(function AppLayout({ children, realtimeStatus = 'disconnected' }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="h-screen w-screen bg-gray-50 overflow-hidden">
      <MemoizedNavbar realtimeStatus={realtimeStatus} />
      <MemoizedSidebar />
      <MemoizedStatusBar />

      <main
        className="transition-all duration-300 overflow-hidden bg-gray-50 flex flex-col route-container"
        style={{
          height: 'calc(100vh - 72px)',
          width: isCollapsed ? 'calc(100vw - 64px)' : 'calc(100vw - 256px)',
          marginLeft: isCollapsed ? '64px' : '256px',
          marginTop: '48px'
        }}
      >
        {children}
      </main>
    </div>
  )
})