import Button from 'components/Button'
import Flex from 'components/Flex'
import Form from 'components/Form'
import Popup from 'components/Popup'
import evidenceEditor from 'models/EvidenceEditor'
import Textarea from 'components/Textarea'
import { observer } from 'mobx-react'
import project from 'models/Project'
import nodeEditor from 'models/NodeEditor'

const EvidenceEditor = observer(() => {
  const readFile = (e) => {
    e.preventDefault()
    const files = e.target?.files || e.dataTransfer?.files
    const file = files[0]
    evidenceEditor.setEditorEvidence({
      ...evidenceEditor.editorEvidence,
      file: file,
    })
  }

  return (
    <Popup state={evidenceEditor.open} setState={evidenceEditor.setOpen}>
      <Form
        className="bg-gray-200 dark:bg-gray-700 shadow-lg rounded p-6"
        onSubmit={async () => {
          project.createEvidence({
            ...evidenceEditor.editorEvidence,
            nodeId: nodeEditor.editorNode.id,
          })
          evidenceEditor.setOpen(false)
        }}
      >
        <Textarea
          label="Text"
          value={evidenceEditor.editorEvidence?.text}
          onChange={(e) => {
            const value = e.currentTarget.value
            evidenceEditor.setEditorEvidence({
              ...evidenceEditor.editorEvidence,
              text: value,
            })
          }}
        />
        <Flex.Col>
          <div>File</div>
          {/* <div className="w-full h-64 flex items-center justify-center border rounded">
            <span className="">Drop or click here</span>
          </div> */}
          {!evidenceEditor.editorEvidence.file ? (
            <>
              <input
                type="file"
                onChange={readFile}
                style={{
                  display: 'none',
                }}
                id="file-upload"
              />
              <div
                style={{
                  maxWidth: '1000px',
                }}
                className={
                  'flex justify-center items-center h-64 w-full rounded border hover:bg-gray-100 dark:hover:bg-gray-800 trans '
                }
                onDragEnter={() => {
                  // setHighlighted(true)
                }}
                onDragLeave={() => {
                  // setHighlighted(false)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                }}
                onMouseUp={() => {
                  // setHighlighted(false)
                }}
                onDrop={readFile}
                onClick={() => {
                  document.getElementById('file-upload').click()
                }}
              >
                <div className="w-full h-full border border-dashed border-secondary-200 flex items-center justify-center italic">
                  Drop file or click here
                </div>
              </div>
            </>
          ) : (
            <div className="h-64">
              <Flex.Row justify="between">
                <div>{evidenceEditor.editorEvidence?.file?.name}</div>
                <Button
                  icon="FaTimes"
                  iconColor="red"
                  onClick={() => {
                    evidenceEditor.setEditorEvidence({
                      ...evidenceEditor.editorEvidence,
                      file: null,
                    })
                  }}
                />
              </Flex.Row>
            </div>
          )}
        </Flex.Col>
        <Flex.Row space="2">
          <Button basic color="green" type="submit">
            {evidenceEditor.editorEvidence.id ? 'Save' : 'Add'}
          </Button>
          <Button
            basic
            color="gray"
            onClick={() => {
              evidenceEditor.setOpen(false)
            }}
          >
            Cancel
          </Button>
        </Flex.Row>
      </Form>
    </Popup>
  )
})
export default EvidenceEditor
