import Button from 'components/Button'
import Flex from 'components/Flex'
import Form from 'components/Form'
import Popup from 'components/Popup'
import { observer } from 'mobx-react'
import snapshotEditor from 'models/SnapshotEditor'
import Input from 'components/Input'
import snapshots from 'models/Snapshots'

const SnapshotEditor = observer(() => {
  return (
    <Popup state={snapshotEditor.open} setState={snapshotEditor.setOpen}>
      <Form
        className="bg-white dark:bg-gray-700 shadow-lg rounded p-6"
        onSubmit={async () => {
          if (snapshotEditor.editorSnapshot.id) {
            snapshots.updateSnapshot(
              { name: snapshotEditor.editorSnapshot.name },
              snapshotEditor.editorSnapshot.id
            )
          } else {
            snapshots.createSnapshot(snapshotEditor.editorSnapshot)
          }
          snapshotEditor.setOpen(false)
        }}
      >
        <Input
          required
          label="name"
          value={snapshotEditor.editorSnapshot?.name}
          onChange={(e) =>
            snapshotEditor.setEditorSnapshot({
              ...snapshotEditor.editorSnapshot,
              name: e.currentTarget.value,
            })
          }
        />
        <Flex.Row space="2">
          <Button basic color="green" type="submit">
            {snapshotEditor.editorSnapshot.id ? 'Save' : 'Add'}
          </Button>
          <Button
            basic
            color="gray"
            onClick={() => {
              snapshotEditor.setOpen(false)
            }}
          >
            Cancel
          </Button>
        </Flex.Row>
      </Form>
    </Popup>
  )
})
export default SnapshotEditor
