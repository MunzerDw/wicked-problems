import Flex from 'components/Flex'
import Input from 'components/Input'
import Button from 'components/Button'
import { useState } from 'react'
import project from 'models/Project'

function InviteUser() {
  const [email, setEmail] = useState('')
  return (
    <Flex.Row className="p-2 rounded bg-white dark:bg-gray-900">
      <Input
        className="w-full"
        value={email}
        type="email"
        onChange={(e) => {
          setEmail(e.currentTarget.value)
        }}
        placeholder="E-mail"
      />
      <Button
        icon="FaEnvelope"
        color="green"
        basic
        onClick={() => {
          project.createInvite(email)
        }}
      >
        Invite
      </Button>
    </Flex.Row>
  )
}

export default InviteUser
