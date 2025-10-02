import { Outlet } from 'react-router-dom'
import { SidebarProvider } from '../contexts/SidebarContext'
import { AppLayout } from './AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

export function ProtectedShell() {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppLayout realtimeStatus="connected">
          <Outlet />
        </AppLayout>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
