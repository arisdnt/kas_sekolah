import { Text, TextField, Flex } from '@radix-ui/themes'
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons'

export function LoginFormFields({ email, setEmail, password, setPassword }) {
  return (
    <Flex direction="column" gap="4">
      <label>
        <Text as="div" size="2" mb="1" weight="medium" className="text-gray-700">
          Email
        </Text>
        <TextField.Root
          className="w-full"
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        >
          <TextField.Slot>
            <EnvelopeClosedIcon />
          </TextField.Slot>
        </TextField.Root>
      </label>

      <label>
        <Text as="div" size="2" mb="1" weight="medium" className="text-gray-700">
          Password
        </Text>
        <TextField.Root
          className="w-full"
          required
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        >
          <TextField.Slot>
            <LockClosedIcon />
          </TextField.Slot>
        </TextField.Root>
      </label>
    </Flex>
  )
}
