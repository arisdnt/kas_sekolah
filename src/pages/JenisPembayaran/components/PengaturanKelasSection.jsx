import { Text, Select } from '@radix-ui/themes'

export function PengaturanKelasSection({ 
  formData, 
  setFormData, 
  tahunAjaranList, 
  kelasList, 
  tingkatList 
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
        Pengaturan Kelas
      </h3>
      
      <div className="space-y-4">
        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Tahun Ajaran <span className="text-red-600">*</span>
          </Text>
          <Select.Root 
            value={formData.id_tahun_ajaran} 
            onValueChange={(v) => setFormData({ ...formData, id_tahun_ajaran: v })}
          >
            <Select.Trigger className="w-full" placeholder="Pilih tahun ajaran" />
            <Select.Content>
              {tahunAjaranList.map(t => (
                <Select.Item key={t.id} value={t.id}>{t.nama}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>

        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Tingkat
          </Text>
          <Select.Root 
            value={formData.tingkat_for_kelas} 
            onValueChange={(v) => setFormData({ 
              ...formData, 
              tingkat_for_kelas: v, 
              id_kelas: '', 
              apply_all_kelas: false 
            })}
          >
            <Select.Trigger className="w-full" placeholder="Pilih tingkat" />
            <Select.Content>
              {tingkatList.map(ting => (
                <Select.Item key={ting} value={ting}>{ting}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </label>

        <label className="space-y-2">
          <Text as="div" size="2" weight="medium" className="text-slate-700">
            Kelas <span className="text-red-600">*</span>
          </Text>
          <Select.Root
            value={formData.apply_all_kelas ? '__ALL__' : (formData.id_kelas || '')}
            onValueChange={(v) => {
              if (v === '__ALL__') {
                setFormData({ ...formData, apply_all_kelas: true, id_kelas: '' })
              } else {
                setFormData({ ...formData, apply_all_kelas: false, id_kelas: v })
              }
            }}
          >
            <Select.Trigger 
              className="w-full" 
              placeholder={
                formData.tingkat_for_kelas 
                  ? `Pilih kelas tingkat ${formData.tingkat_for_kelas}` 
                  : 'Pilih tingkat dahulu'
              } 
            />
            <Select.Content>
              {formData.tingkat_for_kelas && (
                <Select.Item value="__ALL__">
                  Semua kelas tingkat {formData.tingkat_for_kelas}
                </Select.Item>
              )}
              {kelasList
                .filter(k => !formData.tingkat_for_kelas || k.tingkat === formData.tingkat_for_kelas)
                .map(k => (
                  <Select.Item key={k.id} value={k.id}>
                    {k.tingkat} {k.nama_sub_kelas}
                  </Select.Item>
                ))
              }
            </Select.Content>
          </Select.Root>
        </label>
      </div>
    </div>
  )
}
