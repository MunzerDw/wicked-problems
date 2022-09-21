import Toogle from 'components/Toogle'
import Button from 'components/Button'
import Flex from 'components/Flex'
import Form from 'components/Form'
import Input from 'components/Input'
import Popup from 'components/Popup'
import projectEditor from 'models/ProjectEditor'
import projects from 'models/Projects'
import { observer } from 'mobx-react'

const UrlSafeString = require('url-safe-string'),
  tagGenerator = new UrlSafeString()

const ProjectEditor = observer(() => {
  const editorProject = projectEditor.getEditorProject()
  return (
    <Popup
      state={projectEditor.open}
      setState={projectEditor.setOpen}
      onClose={() => projectEditor.setEditorProject({ name: '' })}
    >
      <Form
        className="bg-white dark:bg-gray-700 shadow-lg rounded p-6"
        onSubmit={async () => {
          if (editorProject.id) {
            await projects.updateProject(
              {
                name: editorProject.name,
                public: editorProject.public,
              },
              editorProject.id
            )
          } else {
            await projects.createProject(editorProject)
          }
          projectEditor.setOpen(false)
        }}
      >
        <div className="opacity-50">
          {tagGenerator.generate(editorProject.name || '')}
        </div>
        <Input
          required
          label="Project name"
          value={editorProject.name}
          onChange={(e) => {
            const value = e.currentTarget.value
            projectEditor.setEditorProject({ ...editorProject, name: value })
          }}
        />
        <Flex.Row>
          <div>Public</div>
          <Toogle
            checked={editorProject.public ? true : false}
            onChange={(value) => {
              projectEditor.setEditorProject({
                ...editorProject,
                public: value,
              })
            }}
          />
        </Flex.Row>
        <Flex.Row space="2">
          <Button basic color="green" type="submit">
            {editorProject.id ? 'Save' : 'Add'}
          </Button>
          <Button
            basic
            color="gray"
            onClick={() => {
              projectEditor.setOpen(false)
            }}
          >
            Cancel
          </Button>
        </Flex.Row>
      </Form>
    </Popup>
  )
})
export default ProjectEditor
