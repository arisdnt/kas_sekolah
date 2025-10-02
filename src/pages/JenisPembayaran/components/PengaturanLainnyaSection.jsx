import { Text, Switch } from '@radix-ui/themes'

export function PengaturanLainnyaSection({ formData, setFormData }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
        Pengaturan Lainnya
      </h3>
      
      <div className="space-y-4">
        <label className="flex items-start gap-3">
          <Switch
            checked={formData.wajib}
            onCheckedChange={(checked) => setFormData({ ...formData, wajib: checked })}
          />
          <div>
            <Text size="2" weight="medium" className="text-slate-700">
              Pembayaran Wajib
            </Text>
            <Text size="1" className="text-slate-500 block mt-1">
              Tandai jika pembayaran ini wajib untuk semua siswa
            </Text>
          </div>
        </label>

        <label className="flex items-start gap-3">
          <Switch
            checked={formData.status_aktif}
            onCheckedChange={(checked) => setFormData({ ...formData, status_aktif: checked })}
          />
          <div>
            <Text size="2" weight="medium" className="text-slate-700">
              Status Aktif
            </Text>
            <Text size="1" className="text-slate-500 block mt-1">
              Nonaktifkan jika jenis pembayaran ini tidak lagi digunakan
            </Text>
          </div>
        </label>
      </div>
    </div>
  )
}
