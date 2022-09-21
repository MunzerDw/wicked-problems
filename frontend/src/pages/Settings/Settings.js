import CanvasPage from 'components/CanvasPage/CanvasPage'
import Toogle from 'components/Toogle'
import { observer } from 'mobx-react'
import projectModel from 'models/Project'
import Flex from 'components/Flex'
import InviteUser from './components/InviteUser'
import Invite from './components/Invite'
import firebase from 'firebase/app'
import settings from 'models/Settings'
import SimpleButton from 'components/SimpleButton'
import Badge from 'components/Badge'
import Icon from 'components/Icon'
import LabelEditor from './components/LabelEditor'

function formatDate(date) {
  return (
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    ' @ ' +
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds()
  )
}

const Settings = observer(() => {
  const project = projectModel.project
  const userId = firebase.auth()?.currentUser?.uid
  return (
    <CanvasPage className="p-12">
      <LabelEditor />
      <div className="text-4xl font-medium mb-16">Settings</div>
      <Flex.Col space="16">
        <Flex.Col>
          <div className="grid grid-cols-2 gap-y-6 gap-x-8 flex items-center w-96">
            <div className="opacity-75">Public</div>
            <div className="font-bold text-lg">
              <Toogle
                checked={project.public ? true : false}
                onChange={(value) => {
                  projectModel.updateProject({
                    public: value,
                  })
                }}
              />
            </div>
            <div className="opacity-75">Created at</div>
            <div className="font-bold text-lg">
              {formatDate(new Date(project.createdAt))}
            </div>
            <div className="opacity-75">Last updated at</div>
            <div className="font-bold text-lg">
              {formatDate(new Date(project.updatedAt))}
            </div>
          </div>
        </Flex.Col>

        <Flex.Col>
          <Flex.Col space="1">
            <div className="text-2xl">Labels</div>
            <SimpleButton
              icon="FaPlus"
              text="add label"
              onClick={() => {
                settings.setOpen(true)
              }}
            />
          </Flex.Col>
          <Flex.Row space="1">
            {settings.labels?.map((label, i) => {
              return (
                <Badge
                  key={i}
                  className="py-1 text-white rounded cursor-pointer hover:shadow-lg"
                  onClick={(e) => {
                    settings.setEditorLabel(label)
                    settings.setOpen(true)
                  }}
                  style={{
                    backgroundColor: label.color,
                  }}
                  text={
                    <Flex.Row space="1">
                      <Icon
                        className="opacity-75 hover:opacity-100 cursor-pointer"
                        name="FaTimes"
                        onClick={async (e) => {
                          e.stopPropagation()
                          await settings.deleteLabel(label.id)
                        }}
                      />
                      <div className="font-normal">{label.text}</div>
                    </Flex.Row>
                  }
                />
              )
            })}
          </Flex.Row>
        </Flex.Col>

        <Flex.Col>
          <div className="text-2xl">Users</div>
          {userId === project.userId && <InviteUser />}
          <Flex.Col>
            {project.invites?.map((invite) => {
              return <Invite invite={invite} />
            })}
          </Flex.Col>
        </Flex.Col>
      </Flex.Col>
    </CanvasPage>
  )
})

export default Settings
