import { Badge, IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { formatCurrency } from '../utils/currencyFormatter'
import { getTipeBadgeColor } from '../utils/badgeHelper'

export function JenisPembayaranTableRow({ item, onEdit, onDelete }) {
  return (
    <tr className="group transition-colors hover:bg-indigo-50/40">
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="bold" className="text-slate-900 font-mono uppercase">
          {item.kode}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="medium" className="text-slate-900">
          {item.nama}
        </Text>
        {item.deskripsi && (
          <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
            {item.deskripsi}
          </Text>
        )}
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="medium" className="text-slate-700">
          {formatCurrency(item.jumlah_default)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={getTipeBadgeColor(item.tipe_pembayaran)}
          className="text-xs capitalize"
        >
          {item.tipe_pembayaran}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="text-[13px] text-slate-700">{item.tahun_ajaran?.nama || '—'}</div>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="text-[13px] text-slate-700">
          {item.kelas ? `Kelas ${item.kelas.tingkat}` : '—'}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={item.wajib ? 'red' : 'gray'}
          className="text-xs"
        >
          {item.wajib ? 'Wajib' : 'Opsional'}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={item.status_aktif ? 'green' : 'gray'}
          className="text-xs"
        >
          {item.status_aktif ? 'Aktif' : 'Nonaktif'}
        </Badge>
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
