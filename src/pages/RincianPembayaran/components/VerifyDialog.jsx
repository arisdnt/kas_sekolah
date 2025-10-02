import { useState } from 'react'
import { Dialog, Flex, Text, Button, TextArea } from '@radix-ui/themes'

export function VerifyDialog({ open, onOpenChange, onConfirm, isReject }) {
  const [rejectReason, setRejectReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleConfirm = async () => {
    if (isReject && !rejectReason.trim()) {
      return
    }
    setSubmitting(true)
    try {
      await onConfirm(isReject ? rejectReason : null)
      onOpenChange(false)
      setRejectReason('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450, borderRadius: 0 }}>
        <Dialog.Title>{isReject ? 'Tolak Pembayaran' : 'Verifikasi Pembayaran'}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {isReject ? 'Berikan alasan penolakan pembayaran' : 'Konfirmasi verifikasi pembayaran ini'}
        </Dialog.Description>

        {isReject && (
          <TextArea placeholder="Alasan penolakan..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} style={{ borderRadius: 0 }} rows={3} required />
        )}

        <Flex gap="3" mt="4" justify="end">
          <Button variant="soft" color="gray" disabled={submitting} onClick={() => onOpenChange(false)} style={{ borderRadius: 0 }}>Batal</Button>
          <Button color={isReject ? 'red' : 'green'} onClick={handleConfirm} disabled={submitting || (isReject && !rejectReason.trim())} style={{ borderRadius: 0 }}>
            {submitting ? 'Proses...' : isReject ? 'Tolak' : 'Verifikasi'}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
