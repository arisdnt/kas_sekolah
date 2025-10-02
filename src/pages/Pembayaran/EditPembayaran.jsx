import { useNavigate } from 'react-router-dom'
 
import { PageLayout } from '../../layout/PageLayout'
import { Button, Card, Text, Select, TextField, TextArea } from '@radix-ui/themes'
import { Plus, Save } from 'lucide-react'
import { Loader } from '../../components/Loader'
import { useEditPembayaran } from './hooks/useEditPembayaran'
import { EditPembayaranHeader } from './components/EditPembayaranHeader'
import { EditRincianPembayaranItem } from './components/EditRincianPembayaranItem'
import { formatCurrency } from './utils/currencyHelpers'

function EditPembayaranContent() {
  const navigate = useNavigate()
  
  const {
    loading,
    tagihanList,
    selectedTagihan,
    formData,
    setFormData,
    rincianItems,
    error,
    submitting,
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    totalPembayaran,
    handleSubmit,
  } = useEditPembayaran()

  // Hindari loader layar penuh; render konten langsung

  return (
      <PageLayout>
        <div className="flex flex-col h-full">
        <EditPembayaranHeader onBack={() => navigate('/pembayaran')} error={error} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card style={{ borderRadius: 0 }}>
              <div className="p-6 space-y-4">
                <Text size="3" weight="bold">Informasi Pembayaran</Text>
                
                <div>
                  <Text size="2" mb="1" weight="medium">Tagihan *</Text>
                  <Select.Root value={formData.id_tagihan} onValueChange={(v) => setFormData({...formData, id_tagihan: v})}>
                    <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tagihan" />
                    <Select.Content style={{ borderRadius: 0 }}>
                      {tagihanList.map(t => (
                        <Select.Item key={t.id} value={t.id}>
                          {t.nomor_tagihan} - {t.judul} ({t.riwayat_kelas_siswa?.siswa?.nama_lengkap})
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                {selectedTagihan && (
                  <div className="p-4 bg-blue-50 border border-blue-200">
                    <div className="flex justify-between">
                      <Text size="2" className="text-blue-900">Total Tagihan</Text>
                      <Text size="2" weight="bold" className="text-blue-900">
                        {formatCurrency(selectedTagihan.total_tagihan)}
                      </Text>
                    </div>
                  </div>
                )}

                <div>
                  <Text size="2" mb="1" weight="medium">Nomor Pembayaran *</Text>
                  <TextField.Root
                    value={formData.nomor_pembayaran}
                    onChange={(e) => setFormData({...formData, nomor_pembayaran: e.target.value})}
                    placeholder="PAY-2024-001"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <Text size="2" mb="1" weight="medium">Catatan</Text>
                  <TextArea
                    value={formData.catatan}
                    onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    placeholder="Catatan pembayaran (opsional)"
                    style={{ borderRadius: 0 }}
                    rows={2}
                  />
                </div>
              </div>
            </Card>

            <Card style={{ borderRadius: 0 }}>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Text size="3" weight="bold">Rincian Transaksi Pembayaran</Text>
                  <Button onClick={handleAddRincian} size="2" style={{ borderRadius: 0 }} className="cursor-pointer">
                    <Plus className="h-4 w-4" />
                    Tambah Transaksi
                  </Button>
                </div>

                {rincianItems.length === 0 ? (
                  <div className="text-center py-8 text-slate-400">
                    <Text size="2">Belum ada rincian transaksi. Klik "Tambah Transaksi" untuk menambahkan.</Text>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rincianItems.map((item, idx) => (
                      <EditRincianPembayaranItem
                        key={idx}
                        item={item}
                        index={idx}
                        onChange={(field, value) => handleRincianChange(idx, field, value)}
                        onRemove={() => handleRemoveRincian(idx)}
                      />
                    ))}

                    <div className="p-4 bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <Text size="2" weight="bold" className="text-emerald-900">Total Pembayaran</Text>
                        <Text size="5" weight="bold" className="text-emerald-700">
                          {formatCurrency(totalPembayaran)}
                        </Text>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-3 justify-end pb-8">
              <Button
                variant="soft"
                color="gray"
                onClick={() => navigate('/pembayaran')}
                style={{ borderRadius: 0 }}
                disabled={submitting}
                className="cursor-pointer"
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || rincianItems.length === 0}
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <Save className="h-4 w-4" />
                {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </div>
          </div>
        </div>
        </div>
      </PageLayout>
  )
}

export function EditPembayaran() {
  return <EditPembayaranContent />
}
