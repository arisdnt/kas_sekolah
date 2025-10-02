import { memo } from 'react'
import { Navbar } from '../layout/Navbar'
import { StatusBar } from '../layout/StatusBar'
import TitleBar from './TitleBar'

const MemoizedNavbar = memo(Navbar)
const MemoizedStatusBar = memo(StatusBar)

export const AppLayout = memo(function AppLayout({ children, realtimeStatus = 'disconnected' }) {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <TitleBar title="Kas Sekolah" />
      <MemoizedNavbar realtimeStatus={realtimeStatus} />
      <MemoizedStatusBar />

      <main
        className="overflow-hidden bg-white flex flex-col route-container"
        style={{
          height: 'calc(100vh - 104px)', // 72px + 32px (title bar height)
          width: '100vw',
          marginTop: '48px'
        }}
      >
        {children}
      </main>
    </div>
  )
})