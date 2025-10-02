import { IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Clock } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

export function PembayaranTableRow({ item, isSelected, onSelect, onEdit, onDelete }) {
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
        <Text size="2" weight="bold" className="text-slate-900 font-mono">
          {item.nomor_pembayaran || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <Text size="2" weight="medium" className="text-slate-900 font-mono">
            {item.tagihan?.nomor_tagihan || '—'}
          </Text>
          {item.tagihan?.judul && (
            <Text size="1" className="text-slate-500 line-clamp-1">
              {item.tagihan.judul}
            </Text>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <Text size="2" className="text-slate-700">
            {item.tagihan?.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
          </Text>
          {item.tagihan?.riwayat_kelas_siswa?.siswa?.nisn && (
            <Text size="1" className="text-slate-500 font-mono">
              {item.tagihan.riwayat_kelas_siswa.siswa.nisn}
            </Text>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 line-clamp-2">
          {item.catatan || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <Text size="1">
            {formatDateTime(item.tanggal_dibuat)}
          </Text>
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
