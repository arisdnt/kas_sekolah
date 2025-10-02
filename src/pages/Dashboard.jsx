import { Button, Card, Flex, Grid, Heading } from '@radix-ui/themes'
import { ReloadIcon } from '@radix-ui/react-icons'
import { useDashboardEvents } from '../hooks/useDashboardEvents'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { ErrorCard } from '../components/dashboard/ErrorCard'
import { StatsCard } from '../components/dashboard/StatsCard'
import { EventsTable } from '../components/dashboard/EventsTable'
import { RefreshIndicator } from '../components/dashboard/RefreshIndicator'

function DashboardContent() {
  const { events, loading, isRefreshing, error, loadEvents } = useDashboardEvents()
  const stats = useDashboardStats(events)
  return (
    <div className="px-6 py-6 overflow-auto h-full">
      <RefreshIndicator isRefreshing={isRefreshing} loading={loading} />
      
      <ErrorCard error={error} />

      <Grid columns={{ initial: '1', md: '3' }} gap="6" className="mb-6">
        <StatsCard
          title="Total Event"
          value={stats.total}
          description="Data tersimpan dalam cache lokal."
          valueColor="text-blue-600"
          loading={loading}
        />
        <StatsCard
          title="Event Terakhir"
          value={stats.lastType}
          description="Type event terbaru."
          valueColor="text-green-600"
          loading={loading}
        />
        <StatsCard
          title="Waktu Update"
          value={stats.lastCreatedAt}
          description="Timestamp event paling baru."
          valueColor="text-purple-600"
          loading={loading}
        />
      </Grid>

      <Card className="bg-white border border-gray-200 shadow-sm">
        <div className="p-6">
          <Flex justify="between" align="center" className="mb-6">
            <Heading size="5" className="text-gray-900">Aktivitas Realtime</Heading>
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50"
              onClick={() => loadEvents()}
              disabled={loading || isRefreshing}
            >
              <ReloadIcon /> Muat ulang data
            </Button>
          </Flex>
          <EventsTable events={events} loading={loading} />
        </div>
      </Card>
    </div>
  )
}

export function Dashboard() {
  return <DashboardContent />
}
