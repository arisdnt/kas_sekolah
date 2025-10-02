import { Text } from '@radix-ui/themes'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function StatCard({ title, value, icon: Icon, color, isCurrency, loading }) {
  const displayValue = loading 
    ? '...' 
    : isCurrency 
      ? formatCurrency(value) 
      : value.toLocaleString('id-ID')

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${color}`} />
          <Text size="1" weight="bold" className="text-slate-600 uppercase tracking-wider">
            {title}
          </Text>
        </div>
      </div>
      <div className="p-6">
        <Text size="8" weight="bold" className={`${color} font-mono`}>
          {displayValue}
        </Text>
      </div>
    </div>
  )
}
