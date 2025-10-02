import { PageLayout } from '../../layout/PageLayout'
import { Card } from '@radix-ui/themes'
import { useCreateJenisPembayaran } from './hooks/useCreateJenisPembayaran'
import { CreateJenisPembayaranHeader } from './components/CreateJenisPembayaranHeader'
import { CreateJenisPembayaranError } from './components/CreateJenisPembayaranError'
import { InformasiDasarSection } from './components/InformasiDasarSection'
import { PengaturanKelasSection } from './components/PengaturanKelasSection'
import { PengaturanLainnyaSection } from './components/PengaturanLainnyaSection'
import { CreateJenisPembayaranActions } from './components/CreateJenisPembayaranActions'

function CreateJenisPembayaranContent() {
  const {
    formData,
    setFormData,
    tahunAjaranList,
    kelasList,
    tingkatList,
    error,
    submitting,
    handleSubmit,
    handleCancel,
  } = useCreateJenisPembayaran()

  return (
    <PageLayout>
      <div className="w-full h-full overflow-auto">
        <div className="p-6">
          <CreateJenisPembayaranHeader onBack={handleCancel} />
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
                  <PengaturanKelasSection
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

              <CreateJenisPembayaranActions 
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

export function CreateJenisPembayaran() {
  return <CreateJenisPembayaranContent />
}
