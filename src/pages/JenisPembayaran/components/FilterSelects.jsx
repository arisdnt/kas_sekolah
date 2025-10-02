import { Select } from '@radix-ui/themes'

export function FilterSelects({
  filterTahunId,
  setFilterTahunId,
  filterTingkat,
  setFilterTingkat,
  filterKelasId,
  setFilterKelasId,
  filterTipe,
  setFilterTipe,
  filterStatus,
  setFilterStatus,
  tahunList,
  tingkatList,
  kelasByTingkat,
}) {
  return (
    <>
      {/* Filter Tahun Ajaran */}
      <Select.Root value={filterTahunId} onValueChange={setFilterTahunId}>
        <Select.Trigger
          style={{ borderRadius: 0, minWidth: '140px' }}
          className="cursor-pointer shrink-0"
          placeholder="Tahun Ajaran"
        />
        <Select.Content style={{ borderRadius: 0, zIndex: 100 }}>
          <Select.Item value="all">Semua Tahun</Select.Item>
          {tahunList.map(t => (
            <Select.Item key={t.id} value={t.id}>{t.nama}</Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Filter Tingkat */}
      <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
        <Select.Trigger
          style={{ borderRadius: 0, minWidth: '110px' }}
          className="cursor-pointer shrink-0"
          placeholder="Tingkat"
        />
        <Select.Content style={{ borderRadius: 0, zIndex: 100 }}>
          <Select.Item value="all">Semua Tingkat</Select.Item>
          {tingkatList.map(tk => (
            <Select.Item key={tk} value={tk}>Kelas {tk}</Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Filter Kelas (depends on Tingkat) */}
      <Select.Root value={filterKelasId} onValueChange={setFilterKelasId} disabled={filterTingkat === 'all'}>
        <Select.Trigger
          style={{ borderRadius: 0, minWidth: '140px' }}
          className="cursor-pointer shrink-0"
          placeholder={filterTingkat === 'all' ? 'Pilih tingkat' : `Kelas ${filterTingkat}`}
        />
        <Select.Content style={{ borderRadius: 0, zIndex: 100 }}>
          <Select.Item value="all">Semua Kelas</Select.Item>
          {(kelasByTingkat.get(filterTingkat) || []).map(k => (
            <Select.Item key={k.id} value={k.id}>{k.tingkat} {k.nama_sub_kelas}</Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Filter Tipe */}
      <Select.Root value={filterTipe} onValueChange={setFilterTipe}>
        <Select.Trigger
          style={{ borderRadius: 0, minWidth: '100px' }}
          className="cursor-pointer shrink-0"
          placeholder="Tipe"
        />
        <Select.Content style={{ borderRadius: 0, zIndex: 100 }}>
          <Select.Item value="all">Semua Tipe</Select.Item>
          <Select.Item value="bulanan">Bulanan</Select.Item>
          <Select.Item value="tahunan">Tahunan</Select.Item>
          <Select.Item value="sekali">Sekali</Select.Item>
        </Select.Content>
      </Select.Root>

      {/* Filter Status */}
      <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
        <Select.Trigger
          style={{ borderRadius: 0, minWidth: '100px' }}
          className="cursor-pointer shrink-0"
          placeholder="Status"
        />
        <Select.Content style={{ borderRadius: 0, zIndex: 100 }}>
          <Select.Item value="all">Semua Status</Select.Item>
          <Select.Item value="aktif">Aktif</Select.Item>
          <Select.Item value="nonaktif">Nonaktif</Select.Item>
        </Select.Content>
      </Select.Root>
    </>
  )
}
