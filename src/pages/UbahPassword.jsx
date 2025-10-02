import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { Text, Button, TextField } from '@radix-ui/themes'
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function UbahPassword() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  })
  const [showPasswordLama, setShowPasswordLama] = useState(false)
  const [showPasswordBaru, setShowPasswordBaru] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validasi
    if (!formData.passwordLama || !formData.passwordBaru || !formData.konfirmasiPassword) {
      setError('Semua field wajib diisi')
      return
    }

    if (formData.passwordBaru.length < 6) {
      setError('Password baru minimal 6 karakter')
      return
    }

    if (formData.passwordBaru !== formData.konfirmasiPassword) {
      setError('Password baru dan konfirmasi password tidak cocok')
      return
    }

    if (formData.passwordLama === formData.passwordBaru) {
      setError('Password baru tidak boleh sama dengan password lama')
      return
    }

    setLoading(true)

    try {
      // Verifikasi password lama dengan mencoba login ulang
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.passwordLama,
      })

      if (signInError) {
        throw new Error('Password lama tidak sesuai')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.passwordBaru,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setFormData({
        passwordLama: '',
        passwordBaru: '',
        konfirmasiPassword: '',
      })

      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-4 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="soft"
              color="gray"
              style={{ borderRadius: 0 }}
              className="cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div>
              <Text size="5" weight="bold" className="text-slate-800 block">
                Ubah Password
              </Text>
              <Text size="2" className="text-slate-600">
                Ganti password akun Anda
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto excel-scrollbar bg-slate-50">
          <div className="max-w-2xl mx-auto p-6">
            <div className="border-2 border-slate-300 bg-white shadow-lg">
              {/* Form Header */}
              <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center bg-blue-600 border border-blue-700">
                    <Key className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                      Informasi Akun
                    </Text>
                    <Text size="2" className="text-slate-600">
                      {user?.email}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-5">
                  {/* Success Message */}
                  {success && (
                    <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-300">
                      <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <Text size="2" weight="bold" className="text-green-800 block mb-1">
                          Password Berhasil Diubah!
                        </Text>
                        <Text size="2" className="text-green-700">
                          Password Anda telah berhasil diperbarui. Anda akan dialihkan ke dashboard...
                        </Text>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300">
                      <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <Text size="2" weight="bold" className="text-red-800 block mb-1">
                          Terjadi Kesalahan
                        </Text>
                        <Text size="2" className="text-red-700">
                          {error}
                        </Text>
                      </div>
                    </div>
                  )}

                  {/* Password Lama */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-red-500" />
                      <Text as="div" size="2" weight="medium" className="text-slate-700">
                        Password Lama <span className="text-red-600">*</span>
                      </Text>
                    </div>
                    <div className="relative">
                      <TextField.Root
                        type={showPasswordLama ? 'text' : 'password'}
                        placeholder="Masukkan password lama"
                        value={formData.passwordLama}
                        onChange={(e) => setFormData({ ...formData, passwordLama: e.target.value })}
                        style={{ borderRadius: 0, paddingRight: '40px' }}
                        required
                        disabled={loading || success}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordLama(!showPasswordLama)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                        style={{ borderRadius: 0 }}
                        disabled={loading || success}
                      >
                        {showPasswordLama ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-green-500" />
                      <Text as="div" size="2" weight="medium" className="text-slate-700">
                        Password Baru <span className="text-red-600">*</span>
                      </Text>
                    </div>
                    <div className="relative">
                      <TextField.Root
                        type={showPasswordBaru ? 'text' : 'password'}
                        placeholder="Masukkan password baru (minimal 6 karakter)"
                        value={formData.passwordBaru}
                        onChange={(e) => setFormData({ ...formData, passwordBaru: e.target.value })}
                        style={{ borderRadius: 0, paddingRight: '40px' }}
                        required
                        disabled={loading || success}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                        style={{ borderRadius: 0 }}
                        disabled={loading || success}
                      >
                        {showPasswordBaru ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                    <Text size="1" className="text-slate-500 mt-1">
                      Password minimal 6 karakter
                    </Text>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      <Text as="div" size="2" weight="medium" className="text-slate-700">
                        Konfirmasi Password Baru <span className="text-red-600">*</span>
                      </Text>
                    </div>
                    <div className="relative">
                      <TextField.Root
                        type={showKonfirmasi ? 'text' : 'password'}
                        placeholder="Masukkan ulang password baru"
                        value={formData.konfirmasiPassword}
                        onChange={(e) => setFormData({ ...formData, konfirmasiPassword: e.target.value })}
                        style={{ borderRadius: 0, paddingRight: '40px' }}
                        required
                        disabled={loading || success}
                      />
                      <button
                        type="button"
                        onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                        style={{ borderRadius: 0 }}
                        disabled={loading || success}
                      >
                        {showKonfirmasi ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="p-4 bg-blue-50 border border-blue-200">
                    <Text size="2" weight="bold" className="text-blue-800 block mb-2">
                      ⚠️ Perhatian
                    </Text>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Password minimal 6 karakter</li>
                      <li>• Gunakan kombinasi huruf, angka, dan simbol untuk keamanan</li>
                      <li>• Jangan bagikan password Anda kepada siapa pun</li>
                      <li>• Setelah password diubah, Anda akan tetap login</li>
                    </ul>
                  </div>
                </div>
              </form>

              {/* Footer */}
              <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    variant="soft"
                    color="gray"
                    size="3"
                    style={{ borderRadius: 0 }}
                    className="cursor-pointer"
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    size="3"
                    style={{ 
                      borderRadius: 0,
                      backgroundColor: '#0066cc',
                      border: '1px solid #0052a3'
                    }}
                    className="cursor-pointer text-white"
                    disabled={loading || success}
                  >
                    <Lock className="h-4 w-4" />
                    {loading ? 'Mengubah Password...' : 'Ubah Password'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 16px;
          height: 16px;
        }
        
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </PageLayout>
  )
}
