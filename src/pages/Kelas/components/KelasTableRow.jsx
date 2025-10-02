import { Badge, IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Clock } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

export function KelasTableRow({ item, isSelected, onSelect, onEdit, onDelete }) {
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
        <Badge variant="soft" color="blue" size="2">
          Tingkat {item.tingkat}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="3" weight="medium" className="text-slate-900">
          {item.nama_sub_kelas}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700">
          {item.kapasitas_maksimal ? `${item.kapasitas_maksimal} siswa` : '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="1" className="text-slate-500 uppercase tracking-wider font-mono">
          {item.id?.slice(0, 8) ?? '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <span className="text-sm">{formatDateTime(item.diperbarui_pada || item.dibuat_pada)}</span>
        </div>
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
            aria-label={`Edit ${item.nama_sub_kelas}`}
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
            aria-label={`Hapus ${item.nama_sub_kelas}`}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
