import { Badge, IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon, CheckIcon, Cross2Icon } from '@radix-ui/react-icons'
import { formatCurrency, formatDateTime, getStatusBadgeColor, getStatusLabel } from '../utils/helpers'

export function RincianPembayaranTableRow({ 
  item, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onVerify, 
  onReject 
}) {
  return (
    <tr
      key={item.id}
      onClick={() => onSelect(item)}
      className={`group transition-colors cursor-pointer ${
        isSelected
          ? 'bg-blue-50 hover:bg-blue-100'
          : 'hover:bg-indigo-50/40'
      }`}
    >
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="medium" className="text-slate-900 font-mono">
          {item.nomor_transaksi}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 font-mono">
          {item.pembayaran?.nomor_pembayaran || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="bold" className="text-emerald-700">
          {formatCurrency(item.jumlah_dibayar)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 capitalize">
          {item.metode_pembayaran}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 text-center font-mono">
          {item.cicilan_ke || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="1" className="text-slate-600">
          {formatDateTime(item.tanggal_bayar)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={getStatusBadgeColor(item.status)}
          className="text-xs"
        >
          {getStatusLabel(item.status)}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        {item.status === 'pending' && (
          <div className="flex gap-1">
            <IconButton
              size="1"
              variant="soft"
              color="green"
              onClick={(e) => {
                e.stopPropagation()
                onVerify(item)
              }}
              className="cursor-pointer"
              aria-label="Verifikasi"
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              size="1"
              variant="soft"
              color="red"
              onClick={(e) => {
                e.stopPropagation()
                onReject(item)
              }}
              className="cursor-pointer"
              aria-label="Tolak"
            >
              <Cross2Icon />
            </IconButton>
          </div>
        )}
        {item.status === 'verified' && (
          <Text size="1" className="text-emerald-600">
            ✓ Verified
          </Text>
        )}
        {item.status === 'rejected' && (
          <Text size="1" className="text-red-600">
            ✗ Rejected
          </Text>
        )}
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex justify-end gap-2">
          <IconButton
            size="1"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="cursor-pointer hover:bg-blue-50 text-blue-600"
            aria-label="Edit"
          >
            <Pencil1Icon />
          </IconButton>
          <IconButton
            size="1"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="cursor-pointer hover:bg-red-50 text-red-600"
            aria-label="Hapus"
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
