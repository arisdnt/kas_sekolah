import { Text, Select } from '@radix-ui/themes'
import { User, School, Calendar, CheckCircle } from 'lucide-react'

export function PrimaryInfoSection({ 
  formData, 
  setFormData, 
  siswaList, 
  kelasList, 
  tahunAjaranList 
}) {
  return (
    <div className="space-y-4">
      <div className="border-b border-slate-200 pb-3 mb-4">
        <Text size="3" weight="bold" className="text-slate-900">
          Informasi Utama
        </Text>
        <Text size="2" className="text-slate-600">
          Data siswa dan penempatan kelas
        </Text>
      </div>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-600" />
            Siswa <span className="text-red-600">*</span>
          </div>
        </Text>
        <Select.Root
          value={formData.id_siswa}
          onValueChange={(value) => setFormData({ ...formData, id_siswa: value })}
          required
        >
          <Select.Trigger
            style={{ borderRadius: 0, width: '100%', height: '40px' }}
            placeholder="Pilih siswa"
            className="cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            {siswaList.map((siswa) => (
              <Select.Item key={siswa.id} value={siswa.id}>
                {siswa.nama_lengkap} {siswa.nisn ? `(${siswa.nisn})` : ''}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </label>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <School className="h-4 w-4 text-slate-600" />
            Kelas <span className="text-red-600">*</span>
          </div>
        </Text>
        <Select.Root
          value={formData.id_kelas}
          onValueChange={(value) => setFormData({ ...formData, id_kelas: value })}
          required
        >
          <Select.Trigger
            style={{ borderRadius: 0, width: '100%', height: '40px' }}
            placeholder="Pilih kelas"
            className="cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            {kelasList.map((kelas) => (
              <Select.Item key={kelas.id} value={kelas.id}>
                {kelas.tingkat} {kelas.nama_sub_kelas}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </label>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-600" />
            Tahun Ajaran <span className="text-red-600">*</span>
          </div>
        </Text>
        <Select.Root
          value={formData.id_tahun_ajaran}
          onValueChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
          required
        >
          <Select.Trigger
            style={{ borderRadius: 0, width: '100%', height: '40px' }}
            placeholder="Pilih tahun ajaran"
            className="cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            {tahunAjaranList.map((tahun) => (
              <Select.Item key={tahun.id} value={tahun.id}>
                {tahun.nama}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </label>

      <label>
        <Text as="div" size="2" mb="2" weight="medium">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-slate-600" />
            Status <span className="text-red-600">*</span>
          </div>
        </Text>
        <Select.Root
          value={formData.status}
          onValueChange={(value) => setFormData({ ...formData, status: value })}
          required
        >
          <Select.Trigger
            style={{ borderRadius: 0, width: '100%', height: '40px' }}
            className="cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="aktif">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Aktif
              </div>
            </Select.Item>
            <Select.Item value="pindah_kelas">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Pindah Kelas
              </div>
            </Select.Item>
            <Select.Item value="lulus">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Lulus
              </div>
            </Select.Item>
            <Select.Item value="keluar">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Keluar
              </div>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </label>
    </div>
  )
}
