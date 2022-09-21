import Flex from 'components/Flex'
import Button from 'components/Button'
import project from 'models/Project'
import firebase from 'firebase/app'

function Invite({ invite }) {
  const userId = firebase.auth()?.currentUser?.uid
  return (
    <Flex.Row className="p-2 rounded bg-white dark:bg-gray-900">
      <div>{invite.email}</div>
      {userId === invite.hostId && (
        <Button
          icon="FaUserSlash"
          color="red"
          basic
          onClick={() => {
            project.deleteInvite(invite.id)
          }}
        >
          Kick
        </Button>
      )}
    </Flex.Row>
  )
}

export default Invite
