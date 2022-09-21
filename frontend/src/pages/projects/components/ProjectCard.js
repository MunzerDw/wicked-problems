import Button from 'components/Button'
import Flex from 'components/Flex'
import NumberStat from 'components/NumberStat'
import TimeAgo from 'javascript-time-ago'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import projectEditor from 'models/ProjectEditor'
import projects from 'models/Projects'
import { observer } from 'mobx-react'
import firebase from 'firebase/app'

const ProjectCard = observer(({ id }) => {
  const timeAgo = new TimeAgo('en-EN')
  const project = projects.findProject(id)
  const currentdate = new Date(project.createdAt)
  const timeSince = timeAgo.format(currentdate)
  const userId = firebase.auth()?.currentUser?.uid
  return (
    <>
      <Link to={'/projects/' + project.urlSafeName} className="cursor-pointer">
        <Flex.Col
          space="2"
          justify="between"
          className="p-4 rounded shadow-xl hover:shadow-2xl trans bg-white dark:bg-gray-700 dark:hover:bg-gray-600 w-full h-full cursor-pointer"
        >
          <Flex.Row
            justify="between"
            align="start"
            space="8"
            className="w-full"
          >
            <span className="text-h2 font-medium">{project.name}</span>
            <Flex.Row space="1">
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  projectEditor.setEditorProject(project)
                  projectEditor.setOpen(true)
                }}
                icon="FaEdit"
                color="transparent"
              />
              {userId === project.userId && (
                <Button
                  icon="FaTrashAlt"
                  iconColor="yellow-500"
                  onClick={(e) => {
                    if (
                      window.confirm(
                        'Are you sure you want to delete this project?'
                      )
                    ) {
                      e.preventDefault()
                      e.stopPropagation()
                      projects.deleteProject(project.id)
                    }
                  }}
                />
              )}
            </Flex.Row>
          </Flex.Row>
          <hr />
          <br />
          <NumberStat.Small
            value={
              <Icon
                className={project.public ? 'text-green-600' : ''}
                name={project.public ? 'FaCheck' : 'FaTimes'}
              />
            }
            text="Public"
            icon="FaGlobeEurope"
          />
          <NumberStat.Small
            value={(project.invites?.length || 0) + 1}
            text="Users"
            icon="FaUsers"
          />
          <NumberStat.Small
            value={timeSince}
            text="Created"
            icon="FaCalendarAlt"
          />
        </Flex.Col>
      </Link>
    </>
  )
})
export default ProjectCard
