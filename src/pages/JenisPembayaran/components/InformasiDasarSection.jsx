import { Text, TextField, TextArea, Select } from '@radix-ui/themes'

export function InformasiDasarSection({ formData, setFormData }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
        Informasi Dasar
      </h3>
      
      <div className="space-y-4">
        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Kode <span className="text-red-600">*</span>
          </Text>
          <TextField.Root
            value={formData.kode}
            onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
            placeholder="Contoh: SPP, SERAGAM, BUKU"
            required
          />
          <Text size="1" className="text-slate-500">
            Kode unik untuk identifikasi (huruf besar)
          </Text>
        </label>

        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Nama <span className="text-red-600">*</span>
          </Text>
          <TextField.Root
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            placeholder="Contoh: SPP Bulanan"
            required
          />
        </label>

        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Deskripsi
          </Text>
          <TextArea
            placeholder="Deskripsi jenis pembayaran (opsional)"
            value={formData.deskripsi}
            onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
            rows={3}
          />
        </label>

        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Jumlah Default (Rp)
          </Text>
          <TextField.Root
            type="number"
            value={formData.jumlah_default}
            onChange={(e) => setFormData({ ...formData, jumlah_default: e.target.value })}
            placeholder="Contoh: 500000"
            min="0"
            step="1000"
          />
          <Text size="1" className="text-slate-500">
            Nominal default dalam Rupiah (opsional)
          </Text>
        </label>

        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Tipe Pembayaran <span className="text-red-600">*</span>
          </Text>
          <Select.Root 
            value={formData.tipe_pembayaran} 
            onValueChange={(value) => setFormData({ ...formData, tipe_pembayaran: value })}
            required
          >
            <Select.Trigger className="w-full" />
            <Select.Content>
              <Select.Item value="bulanan">Bulanan (setiap bulan)</Select.Item>
              <Select.Item value="tahunan">Tahunan (sekali per tahun)</Select.Item>
              <Select.Item value="sekali">Sekali (one-time)</Select.Item>
            </Select.Content>
          </Select.Root>
        </label>
      </div>
    </div>
  )
}
