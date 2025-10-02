import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

export function CreateJenisPembayaranError({ error }) {
  if (!error) return null

  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-6 rounded-lg">
      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <Text size="2" weight="medium" className="text-red-700">
          Terjadi kesalahan
        </Text>
        <Text size="2" className="text-red-600">{error}</Text>
      </div>
    </div>
  )
}
