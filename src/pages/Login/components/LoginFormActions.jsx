import { Button, Text, Separator, Flex } from '@radix-ui/themes'

export function LoginFormActions({ loading, email, error, onMagicLink }) {
  return (
    <>
      {error && (
        <Text color="red" size="2">
          {error}
        </Text>
      )}

      <Button
        type="submit"
        size="3"
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Memproses…' : 'Masuk'}
      </Button>

      <Separator size="2" />

      <Flex direction="column" gap="3">
        <Text size="2" color="gray" className="text-center">
          Atau kirim tautan login ke email Anda
        </Text>
        <Button
          variant="soft"
          className="w-full"
          onClick={onMagicLink}
          disabled={loading || !email}
        >
          Kirim Magic Link
        </Button>
      </Flex>
    </>
  )
}
