import { PageLayout } from '../../layout/PageLayout'
import { Card, Text } from '@radix-ui/themes'
import { useEditJenisPembayaran } from './hooks/useEditJenisPembayaran'
import { EditJenisPembayaranHeader } from './components/EditJenisPembayaranHeader'
import { CreateJenisPembayaranError } from './components/CreateJenisPembayaranError'
import { InformasiDasarSection } from './components/InformasiDasarSection'
import { EditPengaturanKelasSection } from './components/EditPengaturanKelasSection'
import { PengaturanLainnyaSection } from './components/PengaturanLainnyaSection'
import { EditJenisPembayaranActions } from './components/EditJenisPembayaranActions'

function EditJenisPembayaranContent() {
  const {
    formData,
    setFormData,
    tahunAjaranList,
    kelasList,
    tingkatList,
    error,
    submitting,
    loading,
    handleSubmit,
    handleCancel,
  } = useEditJenisPembayaran()

  if (loading) {
    return (
      <PageLayout>
        <div className="w-full h-full overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-center h-64">
              <Text size="3" className="text-slate-500">Memuat data...</Text>
            </div>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="w-full h-full overflow-auto">
        <div className="p-6">
          <EditJenisPembayaranHeader onBack={handleCancel} />
          <CreateJenisPembayaranError error={error} />

          <Card className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <InformasiDasarSection 
                    formData={formData} 
                    setFormData={setFormData} 
                  />
                </div>

                <div className="space-y-6">
                  <EditPengaturanKelasSection
                    formData={formData}
                    setFormData={setFormData}
                    tahunAjaranList={tahunAjaranList}
                    kelasList={kelasList}
                    tingkatList={tingkatList}
                  />
                  <PengaturanLainnyaSection
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>
              </div>

              <EditJenisPembayaranActions 
                submitting={submitting} 
                onCancel={handleCancel} 
              />
            </form>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

export function EditJenisPembayaran() {
  return <EditJenisPembayaranContent />
}
